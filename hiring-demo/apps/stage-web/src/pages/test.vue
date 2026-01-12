<script setup lang="ts">
/**
 * Test Page - 测试页面
 *
 * This page integrates all components for testing purposes.
 * Candidates can use this page to test their implementations.
 *
 * 此页面整合所有组件用于测试目的。
 * 求职者可以使用此页面测试他们的实现。
 */

import { onMounted, ref } from 'vue'
import type { AIStatus, ChatMessage } from '../types'
import ChatInterface from '../components/ChatInterface.vue'
import InputControls from '../components/InputControls.vue'
import StatusIndicator from '../components/StatusIndicator.vue'
import { useSettingsStore } from '../stores/settings'

// ============================================
// Store - Store
// ============================================

const settingsStore = useSettingsStore()

// ============================================
// State - 状态
// ============================================

/** 当前助手状态（测试用） */
const aiStatus = ref<AIStatus>('online')

/** Demo messages */
const messages = ref<ChatMessage[]>([
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m your assistant. How can I help you today?',
    timestamp: new Date(Date.now() - 60000),
    status: 'sent',
  },
])

/** Active tab */
const activeTab = ref<'chat' | 'settings'>('chat')

// ============================================
// Methods - 方法
// ============================================

/**
 * Handle message send
 * 处理消息发送
 */
function handleSendMessage(content: string, images?: string[]): void {
  // 模拟助手处理流程
  aiStatus.value = 'thinking'

  // 模拟延迟响应
  setTimeout(() => {
    aiStatus.value = 'responding'

    // 添加响应消息
    setTimeout(() => {
      messages.value.push({
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: `I received your message: "${content}". This is a demo response. ${images?.length ? `You also attached ${images.length} image(s).` : ''}`,
        timestamp: new Date(),
        status: 'sent',
      })

      aiStatus.value = 'online'
    }, 1500)
  }, 1000)
}

/**
 * Handle voice input
 * 处理语音输入
 */
function handleVoiceStop(audioBlob: Blob): void {
  console.log('Voice recording completed:', audioBlob.size, 'bytes')
  // 真实场景可用于语音转写
}

/**
 * Handle image selection
 * 处理图像选择
 */
function handleImageSelect(file: File, preview: string): void {
  console.log('Image selected:', file.name, preview.length)
  // 真实场景可挂载到消息发送参数
}

/**
 * Cycle through helper statuses for demo
 * 循环切换助手状态用于演示
 */
function cycleStatus(): void {
  const statuses: AIStatus[] = ['online', 'thinking', 'responding', 'offline', 'error']
  const currentIndex = statuses.indexOf(aiStatus.value)
  const nextIndex = (currentIndex + 1) % statuses.length
  aiStatus.value = statuses[nextIndex]
}

// ============================================
// Lifecycle - 生命周期
// ============================================

onMounted(() => {
  settingsStore.initialize()
})
</script>

<template>
  <div class="test-page" min-h-screen bg-gray-50 dark:bg-gray-900>
    <!-- Header -->
    <header
      class="page-header"
      bg-white dark:bg-gray-800
      border-b border-gray-200 dark:border-gray-700
      px-4 py-3
      flex items-center justify-between
    >
      <div flex items-center gap-4>
        <h1 text-xl font-bold text-gray-900 dark:text-gray-100>
          Frontend Test Bench
        </h1>
        <StatusIndicator
          :status="aiStatus"
          size="sm"
          @click="cycleStatus"
        />
      </div>

      <!-- Theme Toggle -->
      <button
        class="theme-toggle"
        p-2 rounded-lg
        bg-gray-100 dark:bg-gray-700
        hover:bg-gray-200 dark:hover:bg-gray-600
        transition-colors
        @click="settingsStore.toggleDark()"
      >
        <svg
          v-if="settingsStore.isDark"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-yellow-500"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-gray-600"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
    </header>

    <!-- Tab Navigation -->
    <nav
      class="tab-nav"
      bg-white dark:bg-gray-800
      border-b border-gray-200 dark:border-gray-700
      px-4
    >
      <div flex gap-4>
        <button
          :class="activeTab === 'chat' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'"
          border-b-2 px-4 py-3
          transition-colors
          @click="activeTab = 'chat'"
        >
          Chat Interface
        </button>
        <button
          :class="activeTab === 'settings' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'"
          border-b-2 px-4 py-3
          transition-colors
          @click="activeTab = 'settings'"
        >
          Settings
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="page-content" flex-1>
      <!-- Chat Tab -->
      <div v-if="activeTab === 'chat'" class="chat-tab" h="calc(100vh - 120px)" flex="~ col">
        <!-- Chat Interface -->
        <div flex-1 overflow-hidden>
          <ChatInterface
            :messages="messages"
            placeholder="Type your message here..."
            @send="handleSendMessage"
          />
        </div>

        <!-- Input Controls -->
        <div p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800>
          <InputControls
            @voice-stop="handleVoiceStop"
            @image-select="handleImageSelect"
            @error="(msg) => console.error(msg)"
          />
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="settings-tab" p-6>
        <div max-w-2xl mx-auto>
          <h2 text-xl font-bold text-gray-900 dark:text-gray-100 mb-6>
            User Preferences
          </h2>

          <!-- Theme Setting -->
          <div class="setting-item" mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm>
            <label text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block>
              Theme Mode
            </label>
            <div flex gap-2>
              <button
                v-for="mode in ['light', 'dark', 'system'] as const"
                :key="mode"
                :class="settingsStore.theme === mode ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
                px-4 py-2 rounded-lg capitalize
                transition-colors
                @click="settingsStore.setTheme(mode)"
              >
                {{ mode }}
              </button>
            </div>
          </div>

          <!-- Font Size Setting -->
          <div class="setting-item" mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm>
            <label text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block>
              Font Size
            </label>
            <div flex gap-2>
              <button
                v-for="size in ['small', 'medium', 'large'] as const"
                :key="size"
                :class="settingsStore.fontSize === size ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
                px-4 py-2 rounded-lg capitalize
                transition-colors
                @click="settingsStore.setFontSize(size)"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Toggle Settings -->
          <div class="setting-item" mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm space-y-4>
            <div flex items-center justify-between>
              <span text-gray-700 dark:text-gray-300>Sound Effects</span>
              <button
                :class="settingsStore.soundEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
                relative w-12 h-6 rounded-full
                transition-colors
                @click="settingsStore.updateSetting('soundEnabled', !settingsStore.soundEnabled)"
              >
                <span
                  :class="settingsStore.soundEnabled ? 'translate-x-6' : 'translate-x-1'"
                  absolute top-1 w-4 h-4 bg-white rounded-full
                  transition-transform shadow
                />
              </button>
            </div>

            <div flex items-center justify-between>
              <span text-gray-700 dark:text-gray-300>Notifications</span>
              <button
                :class="settingsStore.notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
                relative w-12 h-6 rounded-full
                transition-colors
                @click="settingsStore.updateSetting('notificationsEnabled', !settingsStore.notificationsEnabled)"
              >
                <span
                  :class="settingsStore.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'"
                  absolute top-1 w-4 h-4 bg-white rounded-full
                  transition-transform shadow
                />
              </button>
            </div>

            <div flex items-center justify-between>
              <span text-gray-700 dark:text-gray-300>Send on Enter</span>
              <button
                :class="settingsStore.sendOnEnter ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
                relative w-12 h-6 rounded-full
                transition-colors
                @click="settingsStore.updateSetting('sendOnEnter', !settingsStore.sendOnEnter)"
              >
                <span
                  :class="settingsStore.sendOnEnter ? 'translate-x-6' : 'translate-x-1'"
                  absolute top-1 w-4 h-4 bg-white rounded-full
                  transition-transform shadow
                />
              </button>
            </div>
          </div>

          <!-- Reset Button -->
          <button
            class="reset-button"
            w-full py-3
            border border-red-500 text-red-500
            rounded-lg
            hover:bg-red-50 dark:hover:bg-red-900/20
            transition-colors
            @click="settingsStore.resetToDefault()"
          >
            Reset to Default Settings
          </button>
        </div>
      </div>
    </main>

    <!-- Instructions Panel -->
    <aside
      class="instructions-panel"
      fixed bottom-4 right-4
      max-w-sm
      bg-white dark:bg-gray-800
      rounded-lg shadow-lg
      border border-gray-200 dark:border-gray-700
      p-4
    >
      <h3 font-bold text-gray-900 dark:text-gray-100 mb-2>
        Test Instructions
      </h3>
      <ul text-sm text-gray-600 dark:text-gray-400 space-y-1>
        <li>• Click status indicator to cycle through states</li>
        <li>• Test chat interface messaging</li>
        <li>• Try voice and image input controls</li>
        <li>• Switch between tabs to test settings</li>
        <li>• Toggle dark mode with the button in header</li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
.test-page {
  font-size: var(--app-font-size, 16px);
}

.instructions-panel {
  z-index: 50;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .instructions-panel {
    left: 16px;
    right: 16px;
    max-width: none;
  }
}
</style>

<route lang="yaml">
name: TestPage
meta:
  layout: plain
</route>
