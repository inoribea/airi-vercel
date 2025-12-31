import type { VercelRequest, VercelResponse } from '@vercel/node'

import { z } from 'zod'

import { getConfiguration, setConfiguration } from '../_lib/memory'

// Zod schema for MemoryConfiguration validation
const UpstashConfigSchema = z.object({
  url: z.string(),
  token: z.string(),
}).optional()

const ShortTermConfigSchema = z.object({
  provider: z.enum(['vercel-kv', 'upstash-redis']),
  namespace: z.string().optional(),
  maxMessages: z.number().int().positive().optional(),
  ttlSeconds: z.number().int().nonnegative().optional(),
  upstash: UpstashConfigSchema,
})

const EmbeddingConfigSchema = z.object({
  provider: z.enum(['openai', 'cloudflare', 'openai-compatible']),
  model: z.string().optional(),
  dimensions: z.number().int().positive().optional(),
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  accountId: z.string().optional(),
  apiToken: z.string().optional(),
  openai: z.object({
    apiKey: z.string(),
    baseURL: z.string().optional(),
  }).optional(),
  cloudflare: z.object({
    accountId: z.string(),
    apiToken: z.string(),
    model: z.string().optional(),
  }).optional(),
}).optional()

const LongTermConfigSchema = z.object({
  enabled: z.boolean(),
  provider: z.enum(['postgres-pgvector', 'qdrant']),
  postgres: z.object({
    connectionString: z.string().optional(),
    tableName: z.string().optional(),
  }).optional(),
  qdrant: z.object({
    url: z.string(),
    apiKey: z.string().optional(),
    collectionName: z.string().optional(),
  }).optional(),
  embedding: EmbeddingConfigSchema,
}).optional()

const MemoryConfigurationSchema = z.object({
  shortTerm: ShortTermConfigSchema,
  longTerm: LongTermConfigSchema,
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      const config = getConfiguration()
      return res.status(200).json({ success: true, data: config })
    }

    if (req.method === 'POST') {
      const body = req.body

      if (!body) {
        return res.status(400).json({ success: false, error: 'Configuration payload is required' })
      }

      // Validate configuration with zod
      const result = MemoryConfigurationSchema.safeParse(body)
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid configuration format',
          details: result.error.flatten(),
        })
      }

      setConfiguration(result.data)
      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }
  catch (error) {
    console.error('Error in /api/memory/config:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
