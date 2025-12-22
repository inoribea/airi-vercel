# 用户偏好设置

## 任务概述

在 `apps/stage-web/src/stores/settings.ts` 及相关组件中实现用户偏好设置功能。

## 功能要求

### 主题切换
- 明暗模式切换
- 主题偏好记忆
- 系统主题自动适配
- 平滑主题过渡动画

### 设置管理
- 个人偏好设置保存
- 设置同步到本地存储
- 设置导入导出功能
- 重置为默认设置

### 用户界面
- 设置页面UI组件
- 滑块、开关等控件
- 实时预览效果
- 保存状态指示

## 技术实现

### Pinia Store
```typescript
interface SettingsState {
  theme: 'light' | 'dark' | 'auto'
  language: string
  fontSize: number
  enableAnimations: boolean
  privacySettings: {
    dataCollection: boolean
    analytics: boolean
  }
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    theme: 'auto',
    language: 'zh-CN',
    fontSize: 16,
    enableAnimations: true,
    privacySettings: {
      dataCollection: false,
      analytics: false
    }
  }),

  actions: {
    saveSettings() {
      localStorage.setItem('settings', JSON.stringify(this.$state))
    },

    loadSettings() {
      const saved = localStorage.getItem('settings')
      if (saved) {
        this.$patch(JSON.parse(saved))
      }
    }
  }
})
```

### 组件结构
```vue
<template>
  <div class="user-settings">
    <SettingsSection
      v-for="section in settingSections"
      :key="section.id"
      :section="section"
    />
    <div class="settings-actions">
      <button @click="saveSettings">保存</button>
      <button @click="resetSettings">重置</button>
    </div>
  </div>
</template>
```

## 评分要点

- 设置持久化功能完整
- 主题切换功能流畅
- 代码结构清晰
- 用户体验良好