<script setup lang="ts">
/**
 * Memory Settings Page - 记忆系统配置页面
 *
 * This is a skeleton page for memory system configuration.
 * Candidates need to complete the implementation.
 *
 * 这是记忆系统配置的骨架页面。
 * 求职者需要完成实现。
 *
 * Requirements / 要求:
 * 1. Memory parameter configuration form / 记忆参数配置表单
 * 2. Parameter validation (number range, format check) / 参数验证（数字范围、格式检查）
 * 3. Settings save and load functionality / 设置保存和加载功能
 * 4. User-friendly UI design / 用户友好的UI设计
 */

import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { MemoryRetentionPolicy, MemorySettings, ValidationResult } from '../../types'

// ============================================
// Constants - 常量
// ============================================

/** Default memory settings */
const DEFAULT_SETTINGS: MemorySettings = {
  enabled: true,
  maxLength: 50,
  retentionPolicy: 'sliding_window',
  summaryThreshold: 30,
  longTermEnabled: false,
  storageLocation: 'local',
}

/** Retention policy options */
const RETENTION_POLICIES: { value: MemoryRetentionPolicy; label: string; description: string }[] = [
  {
    value: 'sliding_window',
    label: 'Sliding Window',
    description: 'Keep the most recent N messages',
  },
  {
    value: 'importance_based',
    label: 'Importance Based',
    description: 'Keep messages based on importance score',
  },
  {
    value: 'time_based',
    label: 'Time Based',
    description: 'Keep messages within a time window',
  },
]

/** Storage location options */
const STORAGE_OPTIONS: { value: 'local' | 'cloud'; label: string }[] = [
  { value: 'local', label: 'Local Storage' },
  { value: 'cloud', label: 'Cloud Storage' },
]

// ============================================
// State - 状态
// ============================================

/** Current settings */
const settings = reactive<MemorySettings>({ ...DEFAULT_SETTINGS })

/** Form validation errors */
const errors = reactive<Partial<Record<keyof MemorySettings, string>>>({})

/** Is saving settings */
const isSaving = ref(false)

/** Is loading settings */
const isLoading = ref(true)

/** Success message */
const successMessage = ref('')

/** Has unsaved changes */
const hasUnsavedChanges = ref(false)

// ============================================
// Computed - 计算属性
// ============================================

/**
 * Check if form is valid
 * 检查表单是否有效
 */
const isFormValid = computed(() => {
  return Object.keys(errors).length === 0 ||
    Object.values(errors).every(error => !error)
})

/**
 * Check if save button should be enabled
 * 检查保存按钮是否应该启用
 */
const canSave = computed(() => {
  return isFormValid.value && hasUnsavedChanges.value && !isSaving.value
})

// ============================================
// Validation Methods - 验证方法
// ============================================

/**
 * Validate max length
 * 验证最大长度
 *
 * TODO: Implement validation rules
 * TODO: 实现验证规则
 *
 * Rules:
 * - Must be a positive integer
 * - Range: 10-500
 */
function validateMaxLength(value: number): ValidationResult {
  if (!Number.isInteger(value)) {
    return { valid: false, message: 'Must be an integer' }
  }
  if (value < 10) {
    return { valid: false, message: 'Minimum value is 10' }
  }
  if (value > 500) {
    return { valid: false, message: 'Maximum value is 500' }
  }
  return { valid: true }
}

/**
 * Validate summary threshold
 * 验证摘要阈值
 *
 * TODO: Implement validation rules
 * TODO: 实现验证规则
 *
 * Rules:
 * - Must be a positive integer
 * - Must be less than maxLength
 * - Range: 5-maxLength
 */
function validateSummaryThreshold(value: number): ValidationResult {
  if (!Number.isInteger(value)) {
    return { valid: false, message: 'Must be an integer' }
  }
  if (value < 5) {
    return { valid: false, message: 'Minimum value is 5' }
  }
  if (value >= settings.maxLength) {
    return { valid: false, message: 'Must be less than max length' }
  }
  return { valid: true }
}

/**
 * Validate all fields
 * 验证所有字段
 */
function validateAll(): boolean {
  // Clear previous errors
  Object.keys(errors).forEach((key) => {
    delete errors[key as keyof MemorySettings]
  })

  // Validate maxLength
  const maxLengthResult = validateMaxLength(settings.maxLength)
  if (!maxLengthResult.valid) {
    errors.maxLength = maxLengthResult.message
  }

  // Validate summaryThreshold
  const summaryResult = validateSummaryThreshold(settings.summaryThreshold)
  if (!summaryResult.valid) {
    errors.summaryThreshold = summaryResult.message
  }

  return isFormValid.value
}

// ============================================
// Data Methods - 数据方法
// ============================================

/**
 * Load settings from storage
 * 从存储加载设置
 *
 * TODO: Implement loading from localStorage or API
 * TODO: 实现从 localStorage 或 API 加载
 */
async function loadSettings(): Promise<void> {
  isLoading.value = true

  try {
    // TODO: Load from localStorage
    const saved = localStorage.getItem('memory_settings')

    if (saved) {
      const parsed = JSON.parse(saved) as Partial<MemorySettings>
      Object.assign(settings, { ...DEFAULT_SETTINGS, ...parsed })
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    hasUnsavedChanges.value = false
  }
  catch (error) {
    console.error('Failed to load settings:', error)
  }
  finally {
    isLoading.value = false
  }
}

/**
 * Save settings to storage
 * 保存设置到存储
 *
 * TODO: Implement saving to localStorage or API
 * TODO: 实现保存到 localStorage 或 API
 */
async function saveSettings(): Promise<void> {
  if (!validateAll()) {
    return
  }

  isSaving.value = true
  successMessage.value = ''

  try {
    // TODO: Save to localStorage
    localStorage.setItem('memory_settings', JSON.stringify(settings))

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    hasUnsavedChanges.value = false
    successMessage.value = 'Settings saved successfully!'

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }
  catch (error) {
    console.error('Failed to save settings:', error)
  }
  finally {
    isSaving.value = false
  }
}

/**
 * Reset settings to default
 * 重置设置为默认值
 */
function resetToDefault(): void {
  Object.assign(settings, { ...DEFAULT_SETTINGS })
  Object.keys(errors).forEach((key) => {
    delete errors[key as keyof MemorySettings]
  })
  hasUnsavedChanges.value = true
}

// ============================================
// Watchers - 监听器
// ============================================

/**
 * Watch for settings changes to mark as unsaved
 * 监听设置变化以标记为未保存
 */
watch(
  () => ({ ...settings }),
  () => {
    if (!isLoading.value) {
      hasUnsavedChanges.value = true
    }
  },
  { deep: true },
)

/**
 * Validate on field change
 * 字段变化时验证
 */
watch(
  () => settings.maxLength,
  (value) => {
    const result = validateMaxLength(value)
    if (!result.valid) {
      errors.maxLength = result.message
    }
    else {
      delete errors.maxLength
    }
  },
)

watch(
  () => settings.summaryThreshold,
  (value) => {
    const result = validateSummaryThreshold(value)
    if (!result.valid) {
      errors.summaryThreshold = result.message
    }
    else {
      delete errors.summaryThreshold
    }
  },
)

// ============================================
// Lifecycle - 生命周期
// ============================================

onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div class="memory-settings" p-6 max-w-2xl mx-auto>
    <!-- Page Header -->
    <div class="page-header" mb-6>
      <h1 text-2xl font-bold text-gray-900 dark:text-gray-100>
        Memory System Settings
      </h1>
      <p text-gray-500 dark:text-gray-400 mt-2>
        Configure how the AI assistant remembers and manages conversation history.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state" flex items-center justify-center py-12>
      <div class="spinner" w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin />
      <span ml-3 text-gray-500>Loading settings...</span>
    </div>

    <!-- Settings Form -->
    <!--
      TODO: Implement the complete settings form
      TODO: 实现完整的设置表单
    -->
    <form v-else class="settings-form" @submit.prevent="saveSettings">
      <!-- Enable Memory Toggle -->
      <div class="form-section" mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg>
        <div flex items-center justify-between>
          <div>
            <label text-lg font-medium text-gray-900 dark:text-gray-100>
              Enable Memory System
            </label>
            <p text-sm text-gray-500 dark:text-gray-400 mt-1>
              When enabled, the AI will remember previous conversations.
            </p>
          </div>
          <!--
            TODO: Implement toggle switch
            TODO: 实现开关切换
          -->
          <button
            type="button"
            class="toggle-switch"
            :class="settings.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
            relative w-14 h-8 rounded-full
            transition-colors duration-200
            @click="settings.enabled = !settings.enabled"
          >
            <span
              class="toggle-thumb"
              :class="settings.enabled ? 'translate-x-6' : 'translate-x-1'"
              absolute top-1 w-6 h-6 bg-white rounded-full
              transition-transform duration-200 shadow
            />
          </button>
        </div>
      </div>

      <!-- Memory Length -->
      <div class="form-group" mb-6>
        <label class="form-label" block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2>
          Maximum Memory Length
        </label>
        <p text-xs text-gray-500 dark:text-gray-400 mb-2>
          Number of messages to keep in memory (10-500)
        </p>
        <input
          v-model.number="settings.maxLength"
          type="number"
          min="10"
          max="500"
          :disabled="!settings.enabled"
          class="form-input"
          :class="{ 'border-red-500': errors.maxLength }"
          w-full px-4 py-2
          border border-gray-300 dark:border-gray-600
          rounded-lg
          bg-white dark:bg-gray-700
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
        >
        <p v-if="errors.maxLength" text-sm text-red-500 mt-1>
          {{ errors.maxLength }}
        </p>
      </div>

      <!-- Retention Policy -->
      <div class="form-group" mb-6>
        <label class="form-label" block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2>
          Retention Policy
        </label>
        <p text-xs text-gray-500 dark:text-gray-400 mb-2>
          How to decide which messages to keep
        </p>
        <!--
          TODO: Implement radio group for retention policy
          TODO: 实现保留策略的单选组
        -->
        <div class="radio-group" space-y-3>
          <label
            v-for="policy in RETENTION_POLICIES"
            :key="policy.value"
            class="radio-option"
            :class="{ 'opacity-50': !settings.enabled }"
            flex items-start gap-3 p-3
            border border-gray-200 dark:border-gray-700 rounded-lg
            cursor-pointer
            hover:bg-gray-50 dark:hover:bg-gray-700
            transition-colors
          >
            <input
              v-model="settings.retentionPolicy"
              type="radio"
              :value="policy.value"
              :disabled="!settings.enabled"
              class="mt-1"
            >
            <div>
              <span font-medium text-gray-900 dark:text-gray-100>
                {{ policy.label }}
              </span>
              <p text-sm text-gray-500 dark:text-gray-400>
                {{ policy.description }}
              </p>
            </div>
          </label>
        </div>
      </div>

      <!-- Summary Threshold -->
      <div class="form-group" mb-6>
        <label class="form-label" block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2>
          Summary Threshold
        </label>
        <p text-xs text-gray-500 dark:text-gray-400 mb-2>
          Number of messages before auto-summarization (5-{{ settings.maxLength - 1 }})
        </p>
        <input
          v-model.number="settings.summaryThreshold"
          type="number"
          min="5"
          :max="settings.maxLength - 1"
          :disabled="!settings.enabled"
          class="form-input"
          :class="{ 'border-red-500': errors.summaryThreshold }"
          w-full px-4 py-2
          border border-gray-300 dark:border-gray-600
          rounded-lg
          bg-white dark:bg-gray-700
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
        >
        <p v-if="errors.summaryThreshold" text-sm text-red-500 mt-1>
          {{ errors.summaryThreshold }}
        </p>
      </div>

      <!-- Long-term Memory -->
      <div class="form-group" mb-6>
        <div flex items-center gap-3>
          <input
            id="longTermEnabled"
            v-model="settings.longTermEnabled"
            type="checkbox"
            :disabled="!settings.enabled"
            class="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
          >
          <label for="longTermEnabled" text-gray-700 dark:text-gray-300>
            Enable Long-term Memory
          </label>
        </div>
        <p text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7>
          Store important information for future conversations
        </p>
      </div>

      <!-- Storage Location -->
      <div class="form-group" mb-6>
        <label class="form-label" block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2>
          Storage Location
        </label>
        <select
          v-model="settings.storageLocation"
          :disabled="!settings.enabled"
          class="form-select"
          w-full px-4 py-2
          border border-gray-300 dark:border-gray-600
          rounded-lg
          bg-white dark:bg-gray-700
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
        >
          <option v-for="option in STORAGE_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Action Buttons -->
      <div class="form-actions" flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700>
        <button
          type="button"
          class="reset-button"
          px-4 py-2
          text-gray-600 dark:text-gray-400
          hover:text-gray-900 dark:hover:text-gray-100
          transition-colors
          @click="resetToDefault"
        >
          Reset to Default
        </button>

        <div flex items-center gap-4>
          <!-- Unsaved Changes Indicator -->
          <span v-if="hasUnsavedChanges" text-sm text-amber-500>
            Unsaved changes
          </span>

          <!-- Success Message -->
          <span v-if="successMessage" text-sm text-green-500>
            {{ successMessage }}
          </span>

          <!-- Save Button -->
          <button
            type="submit"
            :disabled="!canSave"
            class="save-button"
            px-6 py-2
            bg-blue-500 text-white
            rounded-lg
            hover:bg-blue-600
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
            flex items-center gap-2
          >
            <span v-if="isSaving" class="spinner" w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin />
            <span>{{ isSaving ? 'Saving...' : 'Save Settings' }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
/*
 * TODO: Add custom styles for the settings page
 * TODO: 为设置页面添加自定义样式
 *
 * Consider:
 * - Form field focus states
 * - Toggle switch animation
 * - Validation error styling
 * - Responsive layout
 */

.memory-settings {
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

.form-input:focus,
.form-select:focus {
  border-color: #3b82f6;
}

.form-input.border-red-500 {
  border-color: #ef4444;
}

.radio-option:has(input:checked) {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}

.toggle-switch:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Spinner animation */
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .memory-settings {
    padding: 16px;
  }

  .form-actions {
    flex-direction: column;
    gap: 16px;
  }

  .form-actions > div {
    width: 100%;
    justify-content: space-between;
  }

  .save-button {
    flex: 1;
  }
}
</style>

<route lang="yaml">
name: MemorySettings
meta:
  layout: settings
</route>
