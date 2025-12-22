/**
 * Chat Store - 聊天消息 Store
 *
 * This is a skeleton store for chat message management.
 * Candidates can use and extend this store.
 *
 * 这是聊天消息管理的骨架 Store。
 * 求职者可以使用和扩展此 Store。
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AIStatus, ChatMessage, MessageRole } from '../types'

// ============================================
// Store Definition - Store 定义
// ============================================

export const useChatStore = defineStore('chat', () => {
  // ============================================
  // State - 状态
  // ============================================

  /** Message list */
  const messages = ref<ChatMessage[]>([])

  /** Current AI status */
  const aiStatus = ref<AIStatus>('online')

  /** Is currently sending a message */
  const isSending = ref(false)

  /** Is AI typing/responding */
  const isTyping = ref(false)

  // ============================================
  // Computed - 计算属性
  // ============================================

  /**
   * Get message count
   * 获取消息数量
   */
  const messageCount = computed(() => messages.value.length)

  /**
   * Get last message
   * 获取最后一条消息
   */
  const lastMessage = computed(() => {
    return messages.value.length > 0
      ? messages.value[messages.value.length - 1]
      : null
  })

  /**
   * Get messages by role
   * 按角色获取消息
   */
  const getMessagesByRole = computed(() => (role: MessageRole) => {
    return messages.value.filter(m => m.role === role)
  })

  // ============================================
  // Actions - 动作
  // ============================================

  /**
   * Generate unique message ID
   * 生成唯一消息ID
   */
  function generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Add a new message
   * 添加新消息
   *
   * TODO: Implement message addition with validation
   * TODO: 实现带验证的消息添加
   */
  function addMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>): ChatMessage {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date(),
      status: 'sending',
    }

    messages.value.push(newMessage)

    // Auto-update status to sent after delay
    setTimeout(() => {
      const msg = messages.value.find(m => m.id === newMessage.id)
      if (msg) {
        msg.status = 'sent'
      }
    }, 500)

    return newMessage
  }

  /**
   * Send a user message
   * 发送用户消息
   *
   * TODO: Implement full send logic with API integration
   * TODO: 实现带API集成的完整发送逻辑
   */
  async function sendMessage(content: string, images?: string[]): Promise<void> {
    if (!content.trim() && !images?.length) return

    isSending.value = true

    // Add user message
    addMessage({
      role: 'user',
      content: content.trim(),
      images,
    })

    // Simulate AI thinking
    aiStatus.value = 'thinking'
    isTyping.value = true

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simulate AI responding
      aiStatus.value = 'responding'

      // Add AI response
      await new Promise(resolve => setTimeout(resolve, 1500))

      addMessage({
        role: 'assistant',
        content: `I received your message: "${content}". This is a simulated response.`,
      })

      aiStatus.value = 'online'
    }
    catch (error) {
      console.error('Failed to send message:', error)
      aiStatus.value = 'error'

      // Mark message as error
      const lastUserMsg = messages.value
        .filter(m => m.role === 'user')
        .pop()
      if (lastUserMsg) {
        lastUserMsg.status = 'error'
      }
    }
    finally {
      isSending.value = false
      isTyping.value = false
    }
  }

  /**
   * Update message content
   * 更新消息内容
   */
  function updateMessage(id: string, updates: Partial<ChatMessage>): void {
    const message = messages.value.find(m => m.id === id)
    if (message) {
      Object.assign(message, updates)
    }
  }

  /**
   * Delete a message
   * 删除消息
   */
  function deleteMessage(id: string): void {
    const index = messages.value.findIndex(m => m.id === id)
    if (index > -1) {
      messages.value.splice(index, 1)
    }
  }

  /**
   * Clear all messages
   * 清空所有消息
   */
  function clearMessages(): void {
    messages.value = []
  }

  /**
   * Set AI status
   * 设置AI状态
   */
  function setStatus(status: AIStatus): void {
    aiStatus.value = status
  }

  /**
   * Load messages from storage
   * 从存储加载消息
   *
   * TODO: Implement persistence
   * TODO: 实现持久化
   */
  function loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('chat_messages')
      if (saved) {
        const parsed = JSON.parse(saved)
        messages.value = parsed.map((m: ChatMessage) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }))
      }
    }
    catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  /**
   * Save messages to storage
   * 保存消息到存储
   */
  function saveToStorage(): void {
    try {
      localStorage.setItem('chat_messages', JSON.stringify(messages.value))
    }
    catch (error) {
      console.error('Failed to save messages:', error)
    }
  }

  // ============================================
  // Return - 返回
  // ============================================

  return {
    // State
    messages,
    aiStatus,
    isSending,
    isTyping,

    // Computed
    messageCount,
    lastMessage,
    getMessagesByRole,

    // Actions
    addMessage,
    sendMessage,
    updateMessage,
    deleteMessage,
    clearMessages,
    setStatus,
    loadFromStorage,
    saveToStorage,
  }
})

// ============================================
// Export Types - 导出类型
// ============================================

export type ChatStore = ReturnType<typeof useChatStore>
