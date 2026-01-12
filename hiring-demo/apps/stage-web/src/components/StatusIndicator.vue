<script setup lang="ts">
/**
 * StatusIndicator Component - AI状态指示器组件
 *
 * This is a skeleton component for displaying AI assistant status.
 * Candidates need to complete the implementation.
 *
 * 这是显示AI助手状态的骨架组件。
 * 求职者需要完成实现。
 *
 * Requirements / 要求:
 * 1. AI status display (online/thinking/responding/offline) / AI助手状态显示
 * 2. Status change animations / 状态变化动画
 * 3. Color coding (green=online, yellow=thinking, red=offline, etc.) / 颜色编码
 * 4. Real-time status updates / 实时状态更新
 */

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { AIStatus, AIStatusConfig } from '../types'

// ============================================
// Props & Emits - 属性与事件
// ============================================

interface Props {
  /** Current AI status */
  status?: AIStatus
  /** Show status label text */
  showLabel?: boolean
  /** Size of the indicator */
  size?: 'sm' | 'md' | 'lg'
  /** Enable pulse animation for active states */
  enablePulse?: boolean
  /** Custom status messages (optional override) */
  customMessages?: Partial<Record<AIStatus, string>>
}

const props = withDefaults(defineProps<Props>(), {
  status: 'offline',
  showLabel: true,
  size: 'md',
  enablePulse: true,
  customMessages: () => ({}),
})

const emit = defineEmits<{
  /** Emitted when status changes */
  (e: 'status-change', newStatus: AIStatus, oldStatus: AIStatus): void
  /** Emitted when user clicks on the indicator */
  (e: 'click'): void
}>()

// ============================================
// Constants - 常量
// ============================================

/**
 * Status configuration map
 * 状态配置映射
 *
 * TODO: Candidates can customize or extend these configurations
 * TODO: 求职者可以自定义或扩展这些配置
 */
const STATUS_CONFIGS: Record<AIStatus, AIStatusConfig> = {
  online: {
    status: 'online',
    label: 'Online',
    color: '#22c55e', // green-500
    icon: 'check-circle',
  },
  thinking: {
    status: 'thinking',
    label: 'Thinking...',
    color: '#eab308', // yellow-500
    icon: 'loader',
  },
  responding: {
    status: 'responding',
    label: 'Responding...',
    color: '#3b82f6', // blue-500
    icon: 'message-circle',
  },
  offline: {
    status: 'offline',
    label: 'Offline',
    color: '#6b7280', // gray-500
    icon: 'x-circle',
  },
  error: {
    status: 'error',
    label: 'Error',
    color: '#ef4444', // red-500
    icon: 'alert-circle',
  },
}

/**
 * Size configuration
 * 尺寸配置
 */
const SIZE_CONFIGS = {
  sm: {
    dot: 8,
    font: 'text-xs',
    padding: 'px-2 py-1',
  },
  md: {
    dot: 10,
    font: 'text-sm',
    padding: 'px-3 py-1.5',
  },
  lg: {
    dot: 12,
    font: 'text-base',
    padding: 'px-4 py-2',
  },
}

// ============================================
// State - 状态
// ============================================

function normalizeStatus(status?: AIStatus): AIStatus {
  return status && status in STATUS_CONFIGS ? status : 'offline'
}

/** Current status (internal) */
const currentStatus = ref<AIStatus>(normalizeStatus(props.status))
/** Previous status for transition */
const previousStatus = ref<AIStatus>(normalizeStatus(props.status))
/** Is transitioning between states */
const isTransitioning = ref(false)

// ============================================
// Computed - 计算属性
// ============================================

/**
 * Get current status configuration
 * 获取当前状态配置
 */
const statusConfig = computed(() => STATUS_CONFIGS[normalizeStatus(currentStatus.value)])

/**
 * Get status label (with custom override support)
 * 获取状态标签（支持自定义覆盖）
 *
 * TODO: Implement custom message support
 * TODO: 实现自定义消息支持
 */
const statusLabel = computed(() => {
  const customMessage = props.customMessages[currentStatus.value]
  return customMessage || statusConfig.value.label
})

/**
 * Get size configuration
 * 获取尺寸配置
 */
const sizeConfig = computed(() => {
  return SIZE_CONFIGS[props.size] ?? SIZE_CONFIGS.md
})

/**
 * Determine if pulse animation should be shown
 * 判断是否显示脉冲动画
 *
 * TODO: Define which states should have pulse animation
 * TODO: 定义哪些状态应该有脉冲动画
 */
const shouldPulse = computed(() => {
  if (!props.enablePulse) return false
  // Active states that should pulse
  return ['online', 'thinking', 'responding'].includes(currentStatus.value)
})

/**
 * Generate CSS custom properties for status color
 * 为状态颜色生成CSS自定义属性
 */
const colorStyle = computed(() => ({
  '--status-color': statusConfig.value.color,
}))

// ============================================
// Methods - 方法
// ============================================

/**
 * Update status with transition
 * 带过渡效果更新状态
 *
 * TODO: Implement smooth transition between states
 * TODO: 实现状态之间的平滑过渡
 */
function updateStatus(newStatus: AIStatus): void {
  const normalized = normalizeStatus(newStatus)
  if (normalized === currentStatus.value) return

  const oldStatus = currentStatus.value
  previousStatus.value = oldStatus

  // Start transition
  isTransitioning.value = true

  // Update status after brief delay for animation
  setTimeout(() => {
    currentStatus.value = normalized
    emit('status-change', normalized, oldStatus)

    // End transition
    setTimeout(() => {
      isTransitioning.value = false
    }, 200)
  }, 100)
}

/**
 * Handle click on indicator
 * 处理指示器点击
 */
function handleClick(): void {
  emit('click')
}

/**
 * Get status icon SVG path
 * 获取状态图标SVG路径
 *
 * TODO: Candidates can implement custom icons
 * TODO: 求职者可以实现自定义图标
 */
function getStatusIcon(status: AIStatus): string {
  const icons: Record<AIStatus, string> = {
    online: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    thinking: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    responding: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    offline: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  }
  return icons[status]
}

// ============================================
// Watchers - 监听器
// ============================================

/**
 * Watch for external status prop changes
 * 监听外部状态属性变化
 */
watch(() => props.status, (newStatus) => {
  updateStatus(normalizeStatus(newStatus))
})

// ============================================
// Lifecycle - 生命周期
// ============================================

/** Demo: Cycle through statuses for testing */
let demoInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // Uncomment for demo cycling (remove in production)
  // startDemoCycle()
})

onBeforeUnmount(() => {
  if (demoInterval) {
    clearInterval(demoInterval)
  }
})

/**
 * Demo function to cycle through statuses
 * 演示函数：循环切换状态
 *
 * Note: For testing purposes only
 * 注意：仅用于测试目的
 */
function startDemoCycle(): void {
  const statuses: AIStatus[] = ['online', 'thinking', 'responding', 'offline', 'error']
  let index = 0

  demoInterval = setInterval(() => {
    index = (index + 1) % statuses.length
    updateStatus(statuses[index])
  }, 2000)
}
</script>

<template>
  <div
    class="status-indicator"
    :class="[
      `status-${currentStatus}`,
      `size-${size}`,
      { 'is-transitioning': isTransitioning },
    ]"
    :style="colorStyle"
    flex items-center gap-2
    :px="sizeConfig.padding"
    rounded-full
    cursor-pointer
    transition-all duration-300
    hover:opacity-80
    @click="handleClick"
  >
    <!-- Status Dot -->
    <!--
      TODO: Implement status dot with color and animation
      TODO: 实现带颜色和动画的状态点
    -->
    <div class="status-dot-wrapper" relative>
      <!-- Pulse ring (for active states) -->
      <div
        v-if="shouldPulse"
        class="pulse-ring"
        absolute inset-0
        rounded-full
        :style="{ backgroundColor: statusConfig.color }"
        animate-ping
        opacity-75
      />
      <!-- Main dot -->
      <div
        class="status-dot"
        :style="{
          width: `${sizeConfig.dot}px`,
          height: `${sizeConfig.dot}px`,
          backgroundColor: statusConfig.color,
        }"
        rounded-full
        relative z-10
        transition-colors duration-300
      />
    </div>

    <!-- Status Label -->
    <!--
      TODO: Add label with transition animation
      TODO: 添加带过渡动画的标签
    -->
    <Transition name="fade" mode="out-in">
      <span
        v-if="showLabel"
        :key="currentStatus"
        class="status-label"
        :class="sizeConfig.font"
        :style="{ color: statusConfig.color }"
        font-medium
        whitespace-nowrap
        transition-all duration-300
      >
        {{ statusLabel }}
      </span>
    </Transition>

    <!-- Status Icon (optional) -->
    <!--
      TODO: Implement status icon display
      TODO: 实现状态图标显示
    -->
    <svg
      v-if="currentStatus === 'thinking'"
      class="thinking-icon"
      :width="sizeConfig.dot + 4"
      :height="sizeConfig.dot + 4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      :style="{ color: statusConfig.color }"
      animate-spin
    >
      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
    </svg>
  </div>
</template>

<style scoped>
/*
 * TODO: Add custom animations and styles
 * TODO: 添加自定义动画和样式
 *
 * Consider:
 * - Smooth color transitions
 * - Pulse animations for active states
 * - Responsive sizing
 * - Dark mode support
 */

.status-indicator {
  background-color: rgba(var(--status-color-rgb, 128, 128, 128), 0.1);
  border: 1px solid rgba(var(--status-color-rgb, 128, 128, 128), 0.2);
}

/* Status-specific backgrounds */
.status-online {
  background-color: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.2);
}

.status-thinking {
  background-color: rgba(234, 179, 8, 0.1);
  border-color: rgba(234, 179, 8, 0.2);
}

.status-responding {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

.status-offline {
  background-color: rgba(107, 114, 128, 0.1);
  border-color: rgba(107, 114, 128, 0.2);
}

.status-error {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
}

/* Pulse ring animation */
.pulse-ring {
  animation: pulse-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.75;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Transition animation */
.is-transitioning .status-dot {
  animation: dot-bounce 0.3s ease-out;
}

@keyframes dot-bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Label fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Thinking spinner */
.thinking-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Size variations */
.size-sm {
  padding: 4px 8px;
}

.size-md {
  padding: 6px 12px;
}

.size-lg {
  padding: 8px 16px;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .status-indicator {
    background-color: rgba(var(--status-color-rgb, 128, 128, 128), 0.15);
  }
}
</style>
