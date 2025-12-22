/**
 * User Settings Store - 用户偏好设置 Store
 *
 * This is a skeleton store for user preferences.
 * Candidates need to complete the implementation.
 *
 * 这是用户偏好设置的骨架 Store。
 * 求职者需要完成实现。
 *
 * Requirements / 要求:
 * 1. Theme switching (light/dark mode) / 主题切换（明暗模式）
 * 2. Save settings to local storage / 个人设置保存到本地存储
 * 3. Settings synchronization and loading / 设置同步和加载
 * 4. Reactive settings changes / 设置更改响应
 */

import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { Language, ThemeMode, UserSettings } from '../types'

// ============================================
// Constants - 常量
// ============================================

/** Local storage key for settings */
const STORAGE_KEY = 'user_settings'

/** Default user settings */
const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  language: 'zh-CN',
  soundEnabled: true,
  notificationsEnabled: true,
  fontSize: 'medium',
  sendOnEnter: true,
}

// ============================================
// Store Definition - Store 定义
// ============================================

export const useSettingsStore = defineStore('settings', () => {
  // ============================================
  // State - 状态
  // ============================================

  /** Current theme mode */
  const theme = ref<ThemeMode>(DEFAULT_SETTINGS.theme)

  /** Current language */
  const language = ref<Language>(DEFAULT_SETTINGS.language)

  /** Sound effects enabled */
  const soundEnabled = ref(DEFAULT_SETTINGS.soundEnabled)

  /** Notifications enabled */
  const notificationsEnabled = ref(DEFAULT_SETTINGS.notificationsEnabled)

  /** Font size preference */
  const fontSize = ref<'small' | 'medium' | 'large'>(DEFAULT_SETTINGS.fontSize)

  /** Send message on Enter key */
  const sendOnEnter = ref(DEFAULT_SETTINGS.sendOnEnter)

  /** Is initialized */
  const isInitialized = ref(false)

  // ============================================
  // Computed - 计算属性
  // ============================================

  /**
   * Determine if dark mode is active
   * 判断是否为暗黑模式
   *
   * TODO: Implement dark mode detection
   * TODO: 实现暗黑模式检测
   *
   * Should consider:
   * - User preference (theme setting)
   * - System preference (if theme is 'system')
   */
  const isDark = computed(() => {
    if (theme.value === 'dark') return true
    if (theme.value === 'light') return false

    // System preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  /**
   * Get all settings as an object
   * 获取所有设置为对象
   */
  const allSettings = computed<UserSettings>(() => ({
    theme: theme.value,
    language: language.value,
    soundEnabled: soundEnabled.value,
    notificationsEnabled: notificationsEnabled.value,
    fontSize: fontSize.value,
    sendOnEnter: sendOnEnter.value,
  }))

  /**
   * Get font size CSS value
   * 获取字体大小 CSS 值
   */
  const fontSizeValue = computed(() => {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
    }
    return sizes[fontSize.value]
  })

  // ============================================
  // Actions - 动作
  // ============================================

  /**
   * Initialize settings from storage
   * 从存储初始化设置
   *
   * TODO: Implement loading from localStorage
   * TODO: 实现从 localStorage 加载
   */
  function initialize(): void {
    if (isInitialized.value) return

    try {
      const saved = localStorage.getItem(STORAGE_KEY)

      if (saved) {
        const parsed = JSON.parse(saved) as Partial<UserSettings>

        // Apply saved settings
        if (parsed.theme) theme.value = parsed.theme
        if (parsed.language) language.value = parsed.language
        if (typeof parsed.soundEnabled === 'boolean') soundEnabled.value = parsed.soundEnabled
        if (typeof parsed.notificationsEnabled === 'boolean') notificationsEnabled.value = parsed.notificationsEnabled
        if (parsed.fontSize) fontSize.value = parsed.fontSize
        if (typeof parsed.sendOnEnter === 'boolean') sendOnEnter.value = parsed.sendOnEnter
      }

      // Apply theme to document
      applyTheme()

      // Apply font size to document
      applyFontSize()

      isInitialized.value = true
    }
    catch (error) {
      console.error('Failed to load settings:', error)
      isInitialized.value = true
    }
  }

  /**
   * Save settings to storage
   * 保存设置到存储
   *
   * TODO: Implement saving to localStorage
   * TODO: 实现保存到 localStorage
   */
  function saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allSettings.value))
    }
    catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  /**
   * Set theme mode
   * 设置主题模式
   *
   * TODO: Implement theme setting with DOM update
   * TODO: 实现带 DOM 更新的主题设置
   */
  function setTheme(newTheme: ThemeMode): void {
    theme.value = newTheme
    applyTheme()
    saveSettings()
  }

  /**
   * Toggle dark mode
   * 切换暗黑模式
   */
  function toggleDark(): void {
    if (theme.value === 'system') {
      // If system, switch to opposite of current
      theme.value = isDark.value ? 'light' : 'dark'
    }
    else {
      theme.value = theme.value === 'dark' ? 'light' : 'dark'
    }
    applyTheme()
    saveSettings()
  }

  /**
   * Apply theme to document
   * 应用主题到文档
   *
   * TODO: Implement DOM manipulation for theme
   * TODO: 实现主题的 DOM 操作
   */
  function applyTheme(): void {
    if (typeof document === 'undefined') return

    const html = document.documentElement

    if (isDark.value) {
      html.classList.add('dark')
      html.setAttribute('data-theme', 'dark')
    }
    else {
      html.classList.remove('dark')
      html.setAttribute('data-theme', 'light')
    }
  }

  /**
   * Set language
   * 设置语言
   */
  function setLanguage(newLanguage: Language): void {
    language.value = newLanguage
    saveSettings()

    // TODO: Implement i18n language change if needed
    // TODO: 如果需要，实现 i18n 语言切换
  }

  /**
   * Set font size
   * 设置字体大小
   */
  function setFontSize(size: 'small' | 'medium' | 'large'): void {
    fontSize.value = size
    applyFontSize()
    saveSettings()
  }

  /**
   * Apply font size to document
   * 应用字体大小到文档
   */
  function applyFontSize(): void {
    if (typeof document === 'undefined') return

    document.documentElement.style.setProperty('--app-font-size', fontSizeValue.value)
  }

  /**
   * Update a single setting
   * 更新单个设置
   */
  function updateSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]): void {
    switch (key) {
      case 'theme':
        setTheme(value as ThemeMode)
        break
      case 'language':
        setLanguage(value as Language)
        break
      case 'fontSize':
        setFontSize(value as 'small' | 'medium' | 'large')
        break
      case 'soundEnabled':
        soundEnabled.value = value as boolean
        saveSettings()
        break
      case 'notificationsEnabled':
        notificationsEnabled.value = value as boolean
        saveSettings()
        break
      case 'sendOnEnter':
        sendOnEnter.value = value as boolean
        saveSettings()
        break
    }
  }

  /**
   * Reset all settings to default
   * 重置所有设置为默认值
   */
  function resetToDefault(): void {
    theme.value = DEFAULT_SETTINGS.theme
    language.value = DEFAULT_SETTINGS.language
    soundEnabled.value = DEFAULT_SETTINGS.soundEnabled
    notificationsEnabled.value = DEFAULT_SETTINGS.notificationsEnabled
    fontSize.value = DEFAULT_SETTINGS.fontSize
    sendOnEnter.value = DEFAULT_SETTINGS.sendOnEnter

    applyTheme()
    applyFontSize()
    saveSettings()
  }

  // ============================================
  // Watchers - 监听器
  // ============================================

  /**
   * Watch for system theme changes
   * 监听系统主题变化
   *
   * TODO: Implement system theme change detection
   * TODO: 实现系统主题变化检测
   */
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    mediaQuery.addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme()
      }
    })
  }

  // ============================================
  // Return - 返回
  // ============================================

  return {
    // State
    theme,
    language,
    soundEnabled,
    notificationsEnabled,
    fontSize,
    sendOnEnter,
    isInitialized,

    // Computed
    isDark,
    allSettings,
    fontSizeValue,

    // Actions
    initialize,
    saveSettings,
    setTheme,
    toggleDark,
    setLanguage,
    setFontSize,
    updateSetting,
    resetToDefault,
  }
})

// ============================================
// Export Types - 导出类型
// ============================================

export type SettingsStore = ReturnType<typeof useSettingsStore>
