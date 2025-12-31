import type { Pool } from 'pg'

import type { IMemoryProvider, MemorySearchResult, Message } from '../../interfaces/memory.interface'
import type { EmbeddingProviderConfiguration } from '../../types/config'
import type { EmbeddingClient } from '../../utils/embedding'

import { createPool } from '@vercel/postgres'

import { DEFAULT_EMBEDDING_DIMENSIONS } from '../../utils/constants'
import { createEmbeddingClient, resolveEmbeddingConfiguration } from '../../utils/embedding'
import { extractSessionId, extractUserId } from '../../utils/metadata'

const DEFAULT_TABLE_NAME = 'conversations'

export interface PostgresPgvectorMemoryOptions {
  connectionString?: string
  pool?: Pool
  tableName?: string
  embeddingModel?: string
  embeddingDimensions?: number
  openAIApiKey?: string
  embedding?: EmbeddingProviderConfiguration
}

interface MemoryRow {
  user_id: string
  session_id: string | null
  role: string | null
  content: string
  metadata: unknown
  created_at: string | Date
  distance?: number
}

export class PostgresPgvectorMemoryProvider implements IMemoryProvider {
  private readonly pool: Pool
  private readonly tableName: string
  private readonly embeddingClient: EmbeddingClient
  private readonly embeddingDimensions: number

  constructor(options: PostgresPgvectorMemoryOptions = {}) {
    this.tableName = this.validateTableName(options.tableName ?? DEFAULT_TABLE_NAME)
    this.embeddingDimensions = options.embeddingDimensions ?? DEFAULT_EMBEDDING_DIMENSIONS

    const embeddingConfig = resolveEmbeddingConfiguration(options.embedding, {
      model: options.embeddingModel,
      apiKey: options.openAIApiKey,
    })
    this.embeddingClient = createEmbeddingClient(embeddingConfig, { dimensions: this.embeddingDimensions })

    const connectionString = options.connectionString
      ?? process.env.POSTGRES_URL
      ?? process.env.POSTGRES_PRISMA_URL
      ?? process.env.DATABASE_URL

    if (!options.pool && !connectionString) {
      throw new Error('PostgresPgvectorMemoryProvider requires a connection string or an existing Pool instance.')
    }

    this.pool = options.pool ?? createPool({ connectionString: connectionString! })
  }

  async initialize(): Promise<void> {
    await this.ensureExtension()
    await this.ensureTable()
    await this.ensureIndexes()
  }

  async addMessage(sessionId: string, message: Message): Promise<void> {
    const derivedUserId = extractUserId(message)
    if (!derivedUserId) {
      return
    }

    const metadata = {
      ...message.metadata,
      sessionId,
    }

    await this.saveLongTermMemory({ ...message, metadata }, derivedUserId)
  }

  async getRecentMessages(sessionId: string, limit = 50): Promise<Message[]> {
    const { rows } = await this.pool.query(
      `SELECT user_id, session_id, role, content, metadata, created_at
       FROM ${this.tableName}
       WHERE session_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [sessionId, limit],
    )

    return (rows as MemoryRow[])
      .map(row => this.rowToMessage(row))
      .reverse()
  }

  async searchSimilar(query: string, userId: string, limit = 10): Promise<MemorySearchResult[]> {
    const embedding = await this.embeddingClient.generate(query)
    const vector = this.toVectorLiteral(embedding)

    const { rows } = await this.pool.query(
      `SELECT user_id, session_id, role, content, metadata, created_at,
              embedding <-> $2::vector AS distance
       FROM ${this.tableName}
       WHERE user_id = $1
       ORDER BY embedding <-> $2::vector
       LIMIT $3`,
      [userId, vector, limit],
    )

    return (rows as MemoryRow[]).map((row) => {
      const message = this.rowToMessage(row)
      const distance = typeof row.distance === 'number' ? row.distance : Number(row.distance ?? 0)
      const similarity = Math.max(0, 1 - distance)

      return {
        message,
        similarity,
        timestamp: message.timestamp,
        metadata: message.metadata,
      } satisfies MemorySearchResult
    })
  }

  async saveLongTermMemory(message: Message, userId: string): Promise<void> {
    const embedding = await this.embeddingClient.generate(message.content)
    const vector = this.toVectorLiteral(embedding)
    const timestamp = message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp)
    const sessionId = extractSessionId(message)
    const metadata = message.metadata ?? null

    await this.pool.query(
      `INSERT INTO ${this.tableName}
        (user_id, session_id, role, content, metadata, embedding, created_at)
       VALUES ($1, $2, $3, $4, $5, $6::vector, $7)`,
      [
        userId,
        sessionId ?? null,
        message.role ?? null,
        message.content,
        metadata,
        vector,
        timestamp.toISOString(),
      ],
    )
  }

  async clearSession(sessionId: string): Promise<void> {
    await this.pool.query(`DELETE FROM ${this.tableName} WHERE session_id = $1`, [sessionId])
  }

  private async ensureExtension(): Promise<void> {
    await this.pool.query('CREATE EXTENSION IF NOT EXISTS vector;')
  }

  private async ensureTable(): Promise<void> {
    await this.pool.query(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id BIGSERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        session_id TEXT,
        role TEXT,
        content TEXT NOT NULL,
        metadata JSONB,
        embedding vector(${this.embeddingDimensions}) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );`,
    )
  }

  private async ensureIndexes(): Promise<void> {
    await this.pool.query(`CREATE INDEX IF NOT EXISTS ${this.tableName}_user_id_idx ON ${this.tableName} (user_id);`)
    await this.pool.query(`CREATE INDEX IF NOT EXISTS ${this.tableName}_session_id_idx ON ${this.tableName} (session_id);`)
    await this.pool.query(`CREATE INDEX IF NOT EXISTS ${this.tableName}_created_at_idx ON ${this.tableName} (created_at DESC);`)
    await this.pool.query(
      `CREATE INDEX IF NOT EXISTS ${this.tableName}_embedding_idx
       ON ${this.tableName}
       USING ivfflat (embedding vector_l2_ops)
       WITH (lists = 100);`,
    )
  }

  private rowToMessage(row: MemoryRow): Message {
    const metadata = this.parseMetadata(row.metadata)
    const timestamp = row.created_at instanceof Date ? row.created_at : new Date(row.created_at)

    return {
      role: row.role ?? 'assistant',
      content: row.content,
      metadata,
      timestamp,
    } satisfies Message
  }

  private parseMetadata(metadata: unknown): Record<string, unknown> | undefined {
    if (metadata == null) {
      return undefined
    }

    if (typeof metadata === 'string') {
      try {
        return JSON.parse(metadata) as Record<string, unknown>
      }
      catch {
        return { raw: metadata }
      }
    }

    if (typeof metadata === 'object') {
      return metadata as Record<string, unknown>
    }

    return undefined
  }

  private toVectorLiteral(embedding: number[]): string {
    return `[${embedding.join(',')}]`
  }

  private validateTableName(name: string): string {
    if (!/^[_a-z]\w*$/i.test(name)) {
      throw new Error(`Invalid table name for PostgresPgvectorMemoryProvider: ${name}`)
    }

    return name
  }
}
