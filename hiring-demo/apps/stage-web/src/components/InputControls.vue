<script setup lang="ts">
/**
 * InputControls Component - 多模态输入控制组件
 *
 * This is a skeleton component for multimodal input controls.
 * Candidates need to complete the implementation.
 *
 * 这是多模态输入控制的骨架组件。
 * 求职者需要完成实现。
 *
 * Requirements / 要求:
 * 1. Voice input button and functionality / 语音输入按钮及功能
 * 2. Image upload functionality (file select, preview) / 图像上传功能（文件选择、预览）
 * 3. Input status indicator / 输入状态指示器
 * 4. Mobile-friendly responsive design / 移动端适配
 */

import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { ImageInputState, InputMode, VoiceInputState } from '../types'

// ============================================
// Props & Emits - 属性与事件
// ============================================

interface Props {
  /** Current input mode */
  mode?: InputMode
  /** Disable all controls */
  disabled?: boolean
  /** Max file size in bytes (default: 5MB) */
  maxFileSize?: number
  /** Accepted image types */
  acceptedImageTypes?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'text',
  disabled: false,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedImageTypes: () => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
})

const emit = defineEmits<{
  /** Emitted when input mode changes */
  (e: 'mode-change', mode: InputMode): void
  /** Emitted when voice recording starts */
  (e: 'voice-start'): void
  /** Emitted when voice recording stops with audio data */
  (e: 'voice-stop', audioBlob: Blob): void
  /** Emitted when voice recording is cancelled */
  (e: 'voice-cancel'): void
  /** Emitted when an image is selected */
  (e: 'image-select', file: File, preview: string): void
  /** Emitted when image is removed */
  (e: 'image-remove'): void
  /** Emitted when an error occurs */
  (e: 'error', message: string): void
}>()

// ============================================
// State - 状态
// ============================================

/** Current active input mode */
const activeMode = ref<InputMode>(props.mode)

/** Voice input state */
const voiceState = ref<VoiceInputState>({
  isRecording: false,
  duration: 0,
  audioLevel: 0,
})

/** Image input state */
const imageState = ref<ImageInputState>({
  isUploading: false,
  preview: null,
  file: null,
})

/** File input reference */
const fileInputRef = ref<HTMLInputElement | null>(null)

/** MediaRecorder instance */
let mediaRecorder: MediaRecorder | null = null
/** Audio chunks for recording */
let audioChunks: Blob[] = []
/** Recording timer */
let recordingTimer: ReturnType<typeof setInterval> | null = null
/** Audio stream */
let audioStream: MediaStream | null = null

// ============================================
// Computed - 计算属性
// ============================================

/**
 * Check if voice recording is supported
 * 检查是否支持语音录制
 */
const isVoiceSupported = computed(() => {
  return typeof navigator !== 'undefined'
    && !!navigator.mediaDevices
    && !!navigator.mediaDevices.getUserMedia
    && typeof window !== 'undefined'
    && 'MediaRecorder' in window
})

/**
 * Format recording duration
 * 格式化录制时长
 *
 * TODO: Implement duration formatting (mm:ss)
 * TODO: 实现时长格式化 (mm:ss)
 */
const formattedDuration = computed(() => {
  const seconds = voiceState.value.duration
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

/**
 * Get accept string for file input
 * 获取文件输入的 accept 字符串
 */
const acceptString = computed(() => {
  return props.acceptedImageTypes.join(',')
})

// ============================================
// Voice Input Methods - 语音输入方法
// ============================================

/**
 * Start voice recording
 * 开始语音录制
 *
 * TODO: Complete the voice recording implementation
 * TODO: 完成语音录制实现
 *
 * Steps:
 * 1. Request microphone permission
 * 2. Create MediaRecorder
 * 3. Start recording and timer
 * 4. Handle audio data
 */
async function startVoiceRecording(): Promise<void> {
  if (!isVoiceSupported.value) {
    emit('error', 'Voice recording is not supported in this browser')
    return
  }

  if (voiceState.value.isRecording) return

  try {
    // TODO: Implement microphone access and recording
    // Request microphone access
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // Create MediaRecorder
    mediaRecorder = new MediaRecorder(audioStream)
    audioChunks = []

    // Handle data available event
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data)
      }
    }

    // Handle recording stop
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      emit('voice-stop', audioBlob)
      cleanupRecording()
    }

    // Start recording
    mediaRecorder.start()
    voiceState.value.isRecording = true
    voiceState.value.duration = 0

    // Start duration timer
    recordingTimer = setInterval(() => {
      voiceState.value.duration++
    }, 1000)

    emit('voice-start')
    activeMode.value = 'voice'
    emit('mode-change', 'voice')
  }
  catch (error) {
    console.error('Failed to start voice recording:', error)
    emit('error', 'Failed to access microphone. Please check permissions.')
    cleanupRecording()
  }
}

/**
 * Stop voice recording
 * 停止语音录制
 *
 * TODO: Implement recording stop logic
 * TODO: 实现录制停止逻辑
 */
function stopVoiceRecording(): void {
  if (!voiceState.value.isRecording || !mediaRecorder) {
    cleanupRecording()
    return
  }

  try {
    mediaRecorder.stop()
  }
  catch (error) {
    console.error('Failed to stop recording:', error)
    emit('error', 'Stopping recording failed')
    cleanupRecording()
  }
}

/**
 * Cancel voice recording
 * 取消语音录制
 */
function cancelVoiceRecording(): void {
  if (!voiceState.value.isRecording) return

  cleanupRecording()
  emit('voice-cancel')
}

/**
 * Cleanup recording resources
 * 清理录制资源
 */
function cleanupRecording(): void {
  // Clear timer
  if (recordingTimer) {
    clearInterval(recordingTimer)
    recordingTimer = null
  }

  // Stop audio tracks
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop())
    audioStream = null
  }

  // Reset state
  if (mediaRecorder) {
    mediaRecorder.ondataavailable = null
    mediaRecorder.onstop = null
  }
  mediaRecorder = null
  audioChunks = []
  voiceState.value.isRecording = false
  voiceState.value.duration = 0
  voiceState.value.audioLevel = 0
}

// ============================================
// Image Input Methods - 图像输入方法
// ============================================

/**
 * Trigger file input click
 * 触发文件输入点击
 */
function triggerImageSelect(): void {
  if (props.disabled) return
  fileInputRef.value?.click()
}

/**
 * Handle file selection
 * 处理文件选择
 *
 * TODO: Complete the file validation and preview generation
 * TODO: 完成文件验证和预览生成
 *
 * Steps:
 * 1. Validate file type
 * 2. Validate file size
 * 3. Generate preview
 * 4. Update state and emit event
 */
async function handleFileSelect(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  // TODO: Implement file validation
  // Validate file type
  if (!props.acceptedImageTypes.includes(file.type)) {
    emit('error', `Invalid file type. Accepted: ${props.acceptedImageTypes.join(', ')}`)
    input.value = ''
    return
  }

  // Validate file size
  if (file.size > props.maxFileSize) {
    const maxSizeMB = (props.maxFileSize / (1024 * 1024)).toFixed(1)
    emit('error', `File too large. Maximum size: ${maxSizeMB}MB`)
    input.value = ''
    return
  }

  // TODO: Generate preview using FileReader
  imageState.value.isUploading = true

  try {
    const preview = await generatePreview(file)
    imageState.value.file = file
    imageState.value.preview = preview
    imageState.value.isUploading = false

    emit('image-select', file, preview)
    activeMode.value = 'image'
    emit('mode-change', 'image')
  }
  catch {
    emit('error', 'Failed to process image')
    imageState.value.isUploading = false
  }

  // Reset input
  input.value = ''
}

/**
 * Generate image preview using FileReader
 * 使用 FileReader 生成图像预览
 *
 * TODO: Implement preview generation
 * TODO: 实现预览生成
 */
function generatePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result as string)
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Remove selected image
 * 移除选中的图像
 */
function removeImage(): void {
  imageState.value.file = null
  imageState.value.preview = null
  activeMode.value = 'text'
  emit('image-remove')
  emit('mode-change', 'text')
}

// ============================================
// Mode Control Methods - 模式控制方法
// ============================================

/**
 * Switch input mode
 * 切换输入模式
 *
 * TODO: Implement mode switching logic
 * TODO: 实现模式切换逻辑
 */
function switchMode(mode: InputMode): void {
  if (props.disabled) return
  if (activeMode.value === mode) return

  // Cancel any ongoing recording when switching modes
  if (voiceState.value.isRecording && mode !== 'voice') {
    cancelVoiceRecording()
  }

  activeMode.value = mode
  emit('mode-change', mode)
}

// ============================================
// Lifecycle - 生命周期
// ============================================

onBeforeUnmount(() => {
  // Cleanup on component unmount
  cleanupRecording()
})

watch(() => props.mode, (mode) => {
  if (mode && mode !== activeMode.value) {
    switchMode(mode)
  }
})

watch(() => props.disabled, (disabled) => {
  if (disabled && voiceState.value.isRecording) {
    cancelVoiceRecording()
  }
})
</script>

<template>
  <div
    class="input-controls"
    :class="{ 'is-disabled': disabled }"
    flex items-center gap-2 p-2
    bg-white dark:bg-gray-800
    rounded-xl shadow-sm
    border border-gray-200 dark:border-gray-700
  >
    <!-- Hidden File Input -->
    <input
      ref="fileInputRef"
      type="file"
      :accept="acceptString"
      hidden
      @change="handleFileSelect"
    >

    <!-- Text Mode Button -->
    <!--
      TODO: Style the mode buttons with active state
      TODO: 为模式按钮添加激活状态样式
    -->
    <button
      class="mode-button"
      :class="{ 'is-active': activeMode === 'text' }"
      :disabled="disabled"
      p-2 rounded-lg
      transition-all duration-200
      :bg="activeMode === 'text' ? 'blue-500' : 'gray-100 dark:gray-700'"
      :text="activeMode === 'text' ? 'white' : 'gray-600 dark:gray-300'"
      hover:opacity-80
      disabled:opacity-50 disabled:cursor-not-allowed
      @click="switchMode('text')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </button>

    <!-- Voice Mode Button -->
    <!--
      TODO: Implement recording animation/indicator
      TODO: 实现录制动画/指示器
    -->
    <button
      v-if="isVoiceSupported"
      class="mode-button voice-button"
      :class="{
        'is-active': activeMode === 'voice',
        'is-recording': voiceState.isRecording,
      }"
      :disabled="disabled"
      p-2 rounded-lg
      transition-all duration-200
      :bg="voiceState.isRecording ? 'red-500' : (activeMode === 'voice' ? 'blue-500' : 'gray-100 dark:gray-700')"
      :text="voiceState.isRecording || activeMode === 'voice' ? 'white' : 'gray-600 dark:gray-300'"
      hover:opacity-80
      disabled:opacity-50 disabled:cursor-not-allowed
      @click="voiceState.isRecording ? stopVoiceRecording() : startVoiceRecording()"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    </button>

    <!-- Image Mode Button -->
    <button
      class="mode-button image-button"
      :class="{ 'is-active': activeMode === 'image' }"
      :disabled="disabled"
      p-2 rounded-lg
      transition-all duration-200
      :bg="activeMode === 'image' ? 'blue-500' : 'gray-100 dark:gray-700'"
      :text="activeMode === 'image' ? 'white' : 'gray-600 dark:gray-300'"
      hover:opacity-80
      disabled:opacity-50 disabled:cursor-not-allowed
      @click="triggerImageSelect"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </button>

    <!-- Recording Status Display -->
    <!--
      TODO: Implement recording status indicator with animation
      TODO: 实现带动画的录制状态指示器
    -->
    <div
      v-if="voiceState.isRecording"
      class="recording-status"
      flex items-center gap-2 px-3
    >
      <!-- Recording Indicator -->
      <div
        class="recording-dot"
        w-3 h-3 rounded-full bg-red-500
        animate-pulse
      />
      <!-- Duration -->
      <span text-sm font-mono text-gray-600 dark:text-gray-300>
        {{ formattedDuration }}
      </span>
      <!-- Cancel Button -->
      <button
        class="cancel-button"
        p-1 rounded
        text-gray-400 hover:text-red-500
        transition-colors
        @click="cancelVoiceRecording"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Image Preview -->
    <!--
      TODO: Implement image preview with remove button
      TODO: 实现带移除按钮的图像预览
    -->
    <div
      v-if="imageState.preview"
      class="image-preview"
      relative
      flex items-center gap-2 px-2
    >
      <img
        :src="imageState.preview"
        alt="Preview"
        w-10 h-10 rounded object-cover
        border border-gray-200 dark:border-gray-600
      >
      <button
        class="remove-image"
        absolute top--1 right--1
        w-5 h-5 rounded-full
        bg-red-500 text-white
        flex items-center justify-center
        text-xs
        hover:bg-red-600
        transition-colors
        @click="removeImage"
      >
        ×
      </button>
    </div>

    <!-- Loading Indicator -->
    <div
      v-if="imageState.isUploading"
      class="loading-indicator"
      flex items-center gap-2 px-3
    >
      <div class="spinner" w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin />
      <span text-sm text-gray-500>Processing...</span>
    </div>
  </div>
</template>

<style scoped>
/*
 * TODO: Add custom styles for input controls
 * TODO: 为输入控制添加自定义样式
 *
 * Consider:
 * - Recording pulse animation
 * - Button hover effects
 * - Mobile touch interactions
 * - Accessibility
 */

.input-controls {
  min-height: 48px;
}

.input-controls.is-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.mode-button {
  flex-shrink: 0;
}

.voice-button.is-recording {
  animation: recordingPulse 1.5s ease-in-out infinite;
}

@keyframes recordingPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
  }
}

.recording-dot {
  animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .input-controls {
    justify-content: center;
    flex-wrap: wrap;
  }

  .mode-button {
    padding: 12px;
  }
}
</style>
