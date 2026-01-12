<script setup lang="ts">
/**
 * ChatInterface Component - 聊天界面组件
 *
 * This is a skeleton component for the chat interface.
 * Candidates need to complete the implementation.
 *
 * 这是聊天界面的骨架组件。
 * 求职者需要完成实现。
 *
 * Requirements / 要求:
 * 1. Message bubble display (distinguish sent/received) / 消息气泡显示（区分发送/接收）
 * 2. Text message sending functionality / 文本消息发送功能
 * 3. Emoji picker integration / 表情符号选择器
 * 4. Message timestamp display / 消息时间戳显示
 * 5. User avatar display / 用户头像显示
 * 6. Auto-scroll to latest message / 自动滚动到最新消息
 */

import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { ChatMessage, MessageRole } from '../types'

// ============================================
// Props & Emits - 属性与事件
// ============================================

interface Props {
  /** Initial messages list */
  messages?: ChatMessage[]
  /** Current user avatar */
  userAvatar?: string
  /** AI assistant avatar */
  assistantAvatar?: string
  /** Placeholder text for input */
  placeholder?: string
  /** Disable input */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  userAvatar: '/avatars/user.png',
  assistantAvatar: '/avatars/assistant.png',
  placeholder: 'Type your message...',
  disabled: false,
})

const emit = defineEmits<{
  /** Emitted when a message is sent */
  (e: 'send', message: string, images?: string[]): void
  /** Emitted when typing status changes */
  (e: 'typing', isTyping: boolean): void
}>()

// ============================================
// State - 状态
// ============================================

/** Normalize incoming messages to avoid runtime errors */
function normalizeMessage(message: ChatMessage): ChatMessage {
  const parsedTimestamp = (() => {
    if (message.timestamp instanceof Date) return message.timestamp
    const parsed = new Date(message.timestamp ?? Date.now())
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed
  })()

  return {
    id: message.id ?? generateId(),
    role: message.role ?? 'assistant',
    content: message.content ?? '',
    // 允许字符串/时间戳传入，统一转为 Date，避免格式错误导致渲染异常
    timestamp: parsedTimestamp,
    status: message.status ?? 'sent',
    images: message.images ?? [],
    avatar: message.avatar,
  }
}

/** Message list ref */
const messageList = ref<ChatMessage[]>(props.messages.map(normalizeMessage))
/** Input text ref */
const inputText = ref('')
/** Chat container ref for scrolling */
const chatContainerRef = ref<HTMLElement | null>(null)
/** Show emoji picker */
const showEmojiPicker = ref(false)
/** Is sending message */
const isSending = ref(false)

// ============================================
// Computed - 计算属性
// ============================================

/**
 * TODO: Implement computed property to check if send button should be enabled
 * TODO: 实现计算属性以检查发送按钮是否应该启用
 *
 * Hint: Check if input is not empty and not currently sending
 * 提示：检查输入是否不为空且当前未发送中
 */
const canSend = computed(() => {
  // TODO: Implement this
  return inputText.value.trim().length > 0 && !isSending.value && !props.disabled
})

// ============================================
// Methods - 方法
// ============================================

/**
 * Generate unique message ID
 * 生成唯一消息ID
 */
function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Format timestamp for display
 * 格式化时间戳用于显示
 *
 * TODO: Implement timestamp formatting
 * TODO: 实现时间戳格式化
 *
 * @param date - The date to format
 * @returns Formatted time string (e.g., "14:30" or "Yesterday 14:30")
 */
function formatTimestamp(date: Date | string | number): string {
  const parsed = date instanceof Date ? date : new Date(date)

  if (Number.isNaN(parsed.getTime())) return ''

  return parsed.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Scroll to the bottom of the chat
 * 滚动到聊天底部
 *
 * TODO: Implement smooth scroll to bottom
 * TODO: 实现平滑滚动到底部
 */
async function scrollToBottom(): Promise<void> {
  await nextTick()
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTo({
      top: chatContainerRef.value.scrollHeight,
      behavior: 'smooth',
    })
  }
}

/**
 * Send a message
 * 发送消息
 *
 * TODO: Complete the message sending logic
 * TODO: 完成消息发送逻辑
 */
async function sendMessage(): Promise<void> {
  if (!canSend.value) return

  const content = inputText.value.trim()
  if (!content) return

  isSending.value = true

  const newMessage = normalizeMessage({
    id: generateId(),
    role: 'user',
    content,
    timestamp: new Date(),
    status: 'sending',
    avatar: props.userAvatar,
  } as ChatMessage)

  messageList.value.push(newMessage)
  inputText.value = ''

  // Emit the send event
  emit('send', content)

  // Update status to sent (simulated)
  setTimeout(() => {
    const msg = messageList.value.find(m => m.id === newMessage.id)
    if (msg) {
      msg.status = 'sent'
    }
    isSending.value = false
  }, 500)

  await scrollToBottom()
}

/**
 * Handle emoji selection
 * 处理表情符号选择
 *
 * TODO: Implement emoji insertion
 * TODO: 实现表情符号插入
 *
 * @param emoji - The selected emoji
 */
function handleEmojiSelect(emoji: string): void {
  inputText.value += emoji
  showEmojiPicker.value = false
}

/**
 * Handle input keydown
 * 处理输入框按键事件
 *
 * TODO: Implement Enter key sending (with Shift+Enter for new line)
 * TODO: 实现 Enter 键发送（Shift+Enter 换行）
 */
function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

/**
 * Get CSS class for message bubble based on role
 * 根据角色获取消息气泡的CSS类
 *
 * TODO: Implement dynamic styling
 * TODO: 实现动态样式
 */
function getMessageClass(role: MessageRole): string {
  return role === 'user' ? 'message-user' : 'message-assistant'
}

// ============================================
// Watchers - 监听器
// ============================================

/**
 * Watch for external message updates
 * 监听外部消息更新
 */
watch(() => props.messages, (newMessages) => {
  messageList.value = newMessages.map(normalizeMessage)
  scrollToBottom()
}, { deep: true })

watch(messageList, () => {
  scrollToBottom()
}, { deep: true })

// ============================================
// Lifecycle - 生命周期
// ============================================

onMounted(() => {
  scrollToBottom()
})

// ============================================
// Common Emoji List - 常用表情列表
// ============================================

const commonEmojis = [
  '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊',
  '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘',
  '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝',
  '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐',
  '👍', '👎', '👏', '🙌', '🤝', '💪', '❤️', '🔥',
]
</script>

<template>
  <div class="chat-interface" flex="~ col" h-full w-full>
    <!-- Chat Messages Container -->
    <!-- 聊天消息容器 -->
    <div
      ref="chatContainerRef"
      class="messages-container"
      flex-1 overflow-y-auto p-4
    >
      <!--
        TODO: Implement message list rendering
        TODO: 实现消息列表渲染

        Requirements:
        1. Loop through messageList
        2. Display message bubbles with different styles for user/assistant
        3. Show avatar, content, and timestamp
        4. Add smooth animations for new messages
      -->
      <div
        v-for="message in messageList"
        :key="message.id"
        class="message-item"
        :class="getMessageClass(message.role)"
        flex
        :justify="message.role === 'user' ? 'end' : 'start'"
        mb-4
      >
        <!-- Avatar -->
        <div
          v-if="message.role === 'assistant'"
          class="avatar"
          mr-3
        >
          <img
            :src="message.avatar || assistantAvatar"
            alt="avatar"
            w-10 h-10 rounded-full object-cover
          >
        </div>

        <!-- Message Bubble -->
        <div
          class="message-bubble"
          :class="{
            'bg-blue-500 text-white': message.role === 'user',
            'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100': message.role === 'assistant',
          }"
          max-w="70%"
          rounded-2xl px-4 py-2
        >
          <!-- Message Content -->
          <p whitespace-pre-wrap break-words>
            {{ message.content }}
          </p>

          <!-- Timestamp -->
          <div
            class="timestamp"
            text-xs mt-1
            :class="{
              'text-blue-200': message.role === 'user',
              'text-gray-400': message.role === 'assistant',
            }"
          >
            {{ formatTimestamp(message.timestamp) }}
            <span v-if="message.status === 'sending'" ml-1>
              ⏳
            </span>
          </div>
        </div>

        <!-- User Avatar -->
        <div
          v-if="message.role === 'user'"
          class="avatar"
          ml-3
        >
          <img
            :src="message.avatar || userAvatar"
            alt="avatar"
            w-10 h-10 rounded-full object-cover
          >
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="messageList.length === 0"
        flex="~ col" items-center justify-center h-full text-gray-400
      >
        <div text-6xl mb-4>
          💬
        </div>
        <p>No messages yet. Start a conversation!</p>
        <p text-sm>还没有消息，开始对话吧！</p>
      </div>
    </div>

    <!-- Input Area -->
    <!-- 输入区域 -->
    <div
      class="input-area"
      border-t border-gray-200 dark:border-gray-700
      p-4 bg-white dark:bg-gray-800
    >
      <!-- Emoji Picker -->
      <!--
        TODO: Implement emoji picker popup
        TODO: 实现表情选择器弹出窗口

        Hint: Use absolute positioning and v-show/v-if for toggle
        提示：使用绝对定位和 v-show/v-if 进行切换
      -->
      <div
        v-if="showEmojiPicker"
        class="emoji-picker"
        absolute bottom-20 left-4
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-lg shadow-lg p-3
        grid grid-cols-8 gap-1
        max-w-xs
      >
        <button
          v-for="emoji in commonEmojis"
          :key="emoji"
          class="emoji-btn"
          text-xl p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700
          transition-colors
          @click="handleEmojiSelect(emoji)"
        >
          {{ emoji }}
        </button>
      </div>

      <!-- Input Row -->
      <div flex items-end gap-2>
        <!-- Emoji Toggle Button -->
        <button
          class="emoji-toggle"
          p-2 rounded-full
          hover:bg-gray-100 dark:hover:bg-gray-700
          transition-colors
          @click="showEmojiPicker = !showEmojiPicker"
        >
          <span text-xl>😊</span>
        </button>

        <!-- Text Input -->
        <!--
          TODO: Implement textarea with auto-resize
          TODO: 实现自动调整大小的文本域
        -->
        <textarea
          v-model="inputText"
          :placeholder="placeholder"
          :disabled="disabled"
          class="message-input"
          flex-1 resize-none
          border border-gray-300 dark:border-gray-600
          rounded-xl px-4 py-2
          bg-white dark:bg-gray-700
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          rows="1"
          @keydown="handleKeydown"
        />

        <!-- Send Button -->
        <button
          class="send-button"
          :disabled="!canSend"
          p-3 rounded-full
          bg-blue-500 text-white
          hover:bg-blue-600
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
          @click="sendMessage"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * TODO: Add custom styles for the chat interface
 * TODO: 为聊天界面添加自定义样式
 *
 * Consider:
 * - Message bubble animations
 * - Smooth scrolling
 * - Responsive design
 * - Dark mode support
 */

.chat-interface {
  position: relative;
}

.messages-container {
  scroll-behavior: smooth;
}

.message-item {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-bubble {
  word-break: break-word;
  position: relative;
}

/* User message bubble tail */
.message-user .message-bubble::after {
  /* TODO: Add bubble tail design */
}

/* Assistant message bubble tail */
.message-assistant .message-bubble::after {
  /* TODO: Add bubble tail design */
}

.message-input {
  min-height: 40px;
  max-height: 120px;
}

/* Emoji picker animation */
.emoji-picker {
  animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
