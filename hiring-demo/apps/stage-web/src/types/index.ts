/**
 * Type definitions for the test project
 * 测试项目类型定义
 */

// ============================================
// Message Types - 消息类型
// ============================================

/**
 * Message role enum
 * 消息角色枚举
 */
export type MessageRole = 'user' | 'assistant' | 'system'

/**
 * Message status enum
 * 消息状态枚举
 */
export type MessageStatus = 'sending' | 'sent' | 'error'

/**
 * Chat message interface
 * 聊天消息接口
 *
 * TODO: Candidates may extend this interface to support more message types
 * TODO: 求职者可以扩展此接口以支持更多消息类型
 */
export interface ChatMessage {
  /** Unique message ID */
  id: string
  /** Message role: user, assistant, or system */
  role: MessageRole
  /** Message content */
  content: string
  /** Message timestamp */
  timestamp: Date
  /** Message status */
  status: MessageStatus
  /** Optional: Attached images */
  images?: string[]
  /** Optional: User avatar */
  avatar?: string
}

// ============================================
// AI Status Types - AI状态类型
// ============================================

/**
 * AI assistant status enum
 * AI助手状态枚举
 */
export type AIStatus = 'online' | 'thinking' | 'responding' | 'offline' | 'error'

/**
 * AI status display configuration
 * AI状态显示配置
 */
export interface AIStatusConfig {
  status: AIStatus
  label: string
  color: string
  icon?: string
}

// ============================================
// Memory System Types - 记忆系统类型
// ============================================

/**
 * Memory retention policy
 * 记忆保留策略
 */
export type MemoryRetentionPolicy = 'sliding_window' | 'importance_based' | 'time_based'

/**
 * Memory system settings
 * 记忆系统设置
 */
export interface MemorySettings {
  /** Enable memory system */
  enabled: boolean
  /** Maximum memory length (number of messages) */
  maxLength: number
  /** Retention policy */
  retentionPolicy: MemoryRetentionPolicy
  /** Summary threshold (when to summarize) */
  summaryThreshold: number
  /** Enable long-term memory */
  longTermEnabled: boolean
  /** Storage location */
  storageLocation: 'local' | 'cloud'
}

// ============================================
// Input Types - 输入类型
// ============================================

/**
 * Input mode enum
 * 输入模式枚举
 */
export type InputMode = 'text' | 'voice' | 'image'

/**
 * Voice input state
 * 语音输入状态
 */
export interface VoiceInputState {
  isRecording: boolean
  duration: number
  audioLevel: number
}

/**
 * Image input state
 * 图像输入状态
 */
export interface ImageInputState {
  isUploading: boolean
  preview: string | null
  file: File | null
}

// ============================================
// User Settings Types - 用户设置类型
// ============================================

/**
 * Theme mode
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Language setting
 * 语言设置
 */
export type Language = 'zh-CN' | 'en-US' | 'ja-JP'

/**
 * User preferences
 * 用户偏好设置
 */
export interface UserSettings {
  /** Theme mode */
  theme: ThemeMode
  /** Language */
  language: Language
  /** Enable sound effects */
  soundEnabled: boolean
  /** Enable notifications */
  notificationsEnabled: boolean
  /** Font size */
  fontSize: 'small' | 'medium' | 'large'
  /** Send message on Enter key */
  sendOnEnter: boolean
}

// ============================================
// Validation Types - 验证类型
// ============================================

/**
 * Form validation result
 * 表单验证结果
 */
export interface ValidationResult {
  valid: boolean
  message?: string
}

/**
 * Validator function type
 * 验证器函数类型
 */
export type Validator<T> = (value: T) => ValidationResult
