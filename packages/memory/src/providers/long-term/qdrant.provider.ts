import type { IMemoryProvider, MemorySearchResult, Message } from '../../interfaces/memory.interface'
import type { EmbeddingProviderConfiguration } from '../../types/config'
import type { EmbeddingClient } from '../../utils/embedding'

import { randomUUID } from 'node:crypto'

import { QdrantClient } from '@qdrant/js-client-rest'

import { DEFAULT_EMBEDDING_DIMENSIONS } from '../../utils/constants'
import { createEmbeddingClient, resolveEmbeddingConfiguration } from '../../utils/embedding'
import { extractSessionId, extractUserId } from '../../utils/metadata'

const DEFAULT_COLLECTION_NAME = 'memory_entries'

export interface QdrantMemoryOptions {
  url?: string
  apiKey?: string
  client?: QdrantClient
  collectionName?: string
  vectorSize?: number
  embedding?: EmbeddingProviderConfiguration
}

interface QdrantPayload {
  userId: string
  sessionId?: string | null
  role: string
  content: string
  metadata?: Record<string, unknown> | null
  timestamp: string
}

export class QdrantMemoryProvider implements IMemoryProvider {
  private readonly client: QdrantClient
  private readonly collectionName: string
  private readonly vectorSize: number
  private readonly embeddingClient: EmbeddingClient

  constructor(private readonly options: QdrantMemoryOptions = {}) {
    if (!options.client && !options.url) {
      throw new Error('QdrantMemoryProvider requires either an existing client or a URL.')
    }

    this.client = options.client ?? new QdrantClient({
      url: options.url!,
      apiKey: options.apiKey,
    })

    this.collectionName = options.collectionName ?? DEFAULT_COLLECTION_NAME
    this.vectorSize = options.vectorSize ?? DEFAULT_EMBEDDING_DIMENSIONS

    const embeddingConfig = resolveEmbeddingConfiguration(options.embedding)
    this.embeddingClient = createEmbeddingClient(embeddingConfig, { dimensions: this.vectorSize })
  }

  async initialize(): Promise<void> {
    try {
      await this.client.getCollection(this.collectionName)
    }
    catch {
      await this.client.createCollection(this.collectionName, {
        vectors: {
          size: this.vectorSize,
          distance: 'Cosine',
        },
      })
    }
  }

  async addMessage(sessionId: string, message: Message): Promise<void> {
    const derivedUserId = extractUserId(message)
    if (!derivedUserId) {
      return
    }

    const metadata = {
      ...message.metadata,
      sessionId,
    } as Record<string, unknown>

    await this.saveLongTermMemory({ ...message, metadata }, derivedUserId)
  }

  async getRecentMessages(sessionId: string, limit = 50): Promise<Message[]> {
    const points: Message[] = []
    let offset: string | undefined

    do {
      const response = await this.client.scroll(this.collectionName, {
        with_payload: true,
        with_vectors: false,
        limit,
        offset,
        filter: {
          must: [
            {
              key: 'sessionId',
              match: { value: sessionId },
            },
          ],
        },
      })

      const batch = (response.points ?? []).map(point => this.payloadToMessage(point.payload as QdrantPayload | undefined))
      points.push(...batch)
      offset = response.next_page_offset ?? undefined
    } while (offset && points.length < limit)

    return points
      .filter((message): message is Message => Boolean(message))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
      .reverse()
  }

  async searchSimilar(query: string, userId: string, limit = 10): Promise<MemorySearchResult[]> {
    const embedding = await this.embeddingClient.generate(query)

    const results = await this.client.search(this.collectionName, {
      vector: embedding,
      limit,
      with_payload: true,
      filter: {
        must: [
          {
            key: 'userId',
            match: { value: userId },
          },
        ],
      },
    })

    return (results ?? [])
      .map((item) => {
        const message = this.payloadToMessage(item.payload as QdrantPayload | undefined)
        if (!message) {
          return null
        }

        return {
          message,
          similarity: typeof item.score === 'number' ? item.score : 0,
          timestamp: message.timestamp,
          metadata: message.metadata,
        } satisfies MemorySearchResult
      })
      .filter((entry): entry is MemorySearchResult => Boolean(entry))
  }

  async saveLongTermMemory(message: Message, userId: string): Promise<void> {
    const embedding = await this.embeddingClient.generate(message.content)
    const timestamp = message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp)
    const sessionId = extractSessionId(message)

    const payload: QdrantPayload = {
      userId,
      sessionId: sessionId ?? undefined,
      role: message.role,
      content: message.content,
      metadata: message.metadata ?? undefined,
      timestamp: timestamp.toISOString(),
    }

    await this.client.upsert(this.collectionName, {
      wait: true,
      points: [
        {
          id: randomUUID(),
          vector: embedding,
          payload,
        },
      ],
    })
  }

  async clearSession(sessionId: string): Promise<void> {
    await this.client.delete(this.collectionName, {
      filter: {
        must: [
          {
            key: 'sessionId',
            match: { value: sessionId },
          },
        ],
      },
    })
  }

  private payloadToMessage(payload: QdrantPayload | undefined): Message | null {
    if (!payload) {
      return null
    }

    return {
      role: payload.role ?? 'assistant',
      content: payload.content,
      metadata: payload.metadata ?? undefined,
      timestamp: new Date(payload.timestamp ?? Date.now()),
    } satisfies Message
  }
}
