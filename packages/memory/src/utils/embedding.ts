import type { EmbeddingProviderConfiguration } from '../types/config'

import { env } from 'node:process'

import { embed } from '@xsai/embed'

import {
  DEFAULT_CLOUDFLARE_API_BASE_URL,
  DEFAULT_EMBEDDING_DIMENSIONS,
  DEFAULT_EMBEDDING_MODEL,
} from './constants'

/**
 * Embedding client interface for generating vector embeddings
 */
export interface EmbeddingClient {
  /** Generate embedding vector for the given text */
  generate: (input: string) => Promise<number[]>
  /** Get the expected vector dimensions */
  readonly dimensions: number
}

/**
 * Resolve embedding configuration from explicit config or environment variables
 */
export function resolveEmbeddingConfiguration(
  config?: Partial<EmbeddingProviderConfiguration>,
  fallbacks?: {
    model?: string
    apiKey?: string
  },
): EmbeddingProviderConfiguration {
  const provider = config?.provider
    ?? (env.MEMORY_EMBEDDING_PROVIDER as EmbeddingProviderConfiguration['provider'] | undefined)
    ?? 'openai'

  const apiKey = config?.apiKey
    ?? fallbacks?.apiKey
    ?? env.MEMORY_EMBEDDING_API_KEY
    ?? env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('An embedding API key is required.')
  }

  const model = config?.model
    ?? fallbacks?.model
    ?? env.MEMORY_EMBEDDING_MODEL
    ?? DEFAULT_EMBEDDING_MODEL

  const baseUrl = config?.baseUrl ?? env.MEMORY_EMBEDDING_BASE_URL
  const accountId = config?.accountId ?? env.CLOUDFLARE_ACCOUNT_ID

  if (provider === 'cloudflare' && !accountId) {
    throw new Error('Cloudflare embedding provider requires an account ID.')
  }

  return {
    provider,
    apiKey,
    model,
    baseUrl,
    accountId,
  } satisfies EmbeddingProviderConfiguration
}

/**
 * Create an embedding client based on the provider configuration
 */
export function createEmbeddingClient(
  config: EmbeddingProviderConfiguration,
  options?: { dimensions?: number },
): EmbeddingClient {
  const dimensions = options?.dimensions ?? DEFAULT_EMBEDDING_DIMENSIONS

  if (config.provider === 'cloudflare') {
    return createCloudflareEmbeddingClient(config, dimensions)
  }

  // OpenAI or OpenAI-compatible using xsai
  return createXsaiEmbeddingClient(config, dimensions)
}

function createXsaiEmbeddingClient(
  config: EmbeddingProviderConfiguration,
  dimensions: number,
): EmbeddingClient {
  const baseURL = config.baseUrl ?? 'https://api.openai.com/v1/'

  return {
    dimensions,
    async generate(input: string): Promise<number[]> {
      const trimmed = input.trim()
      if (trimmed.length === 0) {
        return Array.from({ length: dimensions }, () => 0)
      }

      const { embedding } = await embed({
        apiKey: config.apiKey,
        baseURL,
        input: trimmed,
        model: config.model ?? DEFAULT_EMBEDDING_MODEL,
      })

      if (!embedding || !embedding.length) {
        throw new Error('Failed to generate embedding for memory content.')
      }

      if (embedding.length !== dimensions) {
        throw new Error(`Embedding dimension mismatch. Expected ${dimensions}, received ${embedding.length}.`)
      }

      return embedding.map((value: number | string) => Number(value))
    },
  }
}

function createCloudflareEmbeddingClient(
  config: EmbeddingProviderConfiguration,
  dimensions: number,
): EmbeddingClient {
  const accountId = config.accountId
  if (!accountId) {
    throw new Error('Cloudflare account ID is not configured.')
  }

  const baseUrl = config.baseUrl ?? DEFAULT_CLOUDFLARE_API_BASE_URL
  const model = config.model ?? DEFAULT_EMBEDDING_MODEL

  return {
    dimensions,
    async generate(input: string): Promise<number[]> {
      const trimmed = input.trim()
      if (trimmed.length === 0) {
        return Array.from({ length: dimensions }, () => 0)
      }

      const url = `${baseUrl}/accounts/${accountId}/ai/run/${model}`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: trimmed }),
      })

      if (!response.ok) {
        const body = await response.text()
        throw new Error(`Cloudflare embedding request failed: ${response.status} ${body}`)
      }

      const payload = await response.json() as Record<string, unknown>
      const embedding = extractCloudflareEmbedding(payload)

      if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
        throw new Error('Cloudflare embedding response did not include an embedding vector.')
      }

      if (embedding.length !== dimensions) {
        throw new Error(`Embedding dimension mismatch. Expected ${dimensions}, received ${embedding.length}.`)
      }

      return embedding.map((value: number | string) => Number(value))
    },
  }
}

/**
 * Extract embedding vector from Cloudflare API response.
 * Handles multiple response formats from Cloudflare Workers AI.
 */
export function extractCloudflareEmbedding(payload: Record<string, unknown>): number[] | undefined {
  const result = (payload.result ?? payload) as Record<string, unknown>

  // Format 1: { result: { data: [[...numbers...]] } }
  if (Array.isArray(result?.data) && result.data.length > 0) {
    const data = result.data as unknown[]
    const candidate = data[0] as Record<string, unknown> | number[] | undefined

    // Handle nested array: data[0] is the embedding array
    if (Array.isArray(candidate) && typeof candidate[0] === 'number') {
      return candidate as number[]
    }

    // Handle object format: data[0].embedding or data[0].vector
    if (candidate && typeof candidate === 'object') {
      if (Array.isArray((candidate as Record<string, unknown>).embedding)) {
        return (candidate as Record<string, unknown>).embedding as number[]
      }
      if (Array.isArray((candidate as Record<string, unknown>).vector)) {
        return (candidate as Record<string, unknown>).vector as number[]
      }
    }
  }

  // Format 2: { result: [...numbers...] }
  if (Array.isArray(result) && typeof result[0] === 'number') {
    return result as number[]
  }

  // Format 3: { embedding: [...numbers...] }
  if (Array.isArray(result?.embedding)) {
    return result.embedding as number[]
  }

  // Format 4: { data: { embedding: [...numbers...] } }
  if (result?.data && typeof result.data === 'object' && Array.isArray((result.data as Record<string, unknown>).embedding)) {
    return (result.data as Record<string, unknown>).embedding as number[]
  }

  return undefined
}
