import type { Message } from '../interfaces/memory.interface'

/**
 * Extract userId from message metadata.
 * Supports multiple naming conventions: userId, userID, user_id
 */
export function extractUserId(message: Message): string | null {
  const metadata = message.metadata ?? {}
  const candidate = (metadata as Record<string, unknown>).userId
    ?? (metadata as Record<string, unknown>).userID
    ?? (metadata as Record<string, unknown>).user_id

  return typeof candidate === 'string' && candidate.length > 0 ? candidate : null
}

/**
 * Extract sessionId from message metadata.
 * Supports multiple naming conventions: sessionId, sessionID, session_id
 */
export function extractSessionId(message: Message): string | null {
  const metadata = message.metadata ?? {}
  const candidate = (metadata as Record<string, unknown>).sessionId
    ?? (metadata as Record<string, unknown>).sessionID
    ?? (metadata as Record<string, unknown>).session_id

  return typeof candidate === 'string' && candidate.length > 0 ? candidate : null
}
