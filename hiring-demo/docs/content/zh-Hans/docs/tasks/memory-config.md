# 记忆系统配置

## 任务概述

在 `apps/stage-web/src/pages/settings/memory.vue` 中实现记忆系统配置页面。

## 功能要求

### 配置表单
- 记忆保留时长设置（滑块或输入框）
- 记忆最大条目数设置
- 记忆类型选择（短期/长期）
- 启用/禁用记忆功能开关

### 参数验证
- 数值范围验证
- 输入格式验证
- 实时错误提示

### 数据持久化
- 保存设置到本地存储
- 加载保存的设置
- 重置为默认设置功能

## 技术实现

### 组件结构
```vue
<template>
  <div class="memory-config">
    <form @submit.prevent="saveSettings">
      <ConfigItem
        v-for="config in configList"
        :key="config.key"
        :config="config"
        @update="handleConfigUpdate"
      />
      <div class="form-actions">
        <button type="submit">保存设置</button>
        <button type="button" @click="resetSettings">重置</button>
      </div>
    </form>
  </div>
</template>
```

### 配置接口
```typescript
interface MemoryConfig {
  retentionTime: number // 记忆保留时间（秒）
  maxEntries: number    // 最大记忆条目数
  memoryType: 'short' | 'long' | 'both'
  enabled: boolean      // 是否启用记忆
}
```

## 评分要点

- 表单验证完整性
- 用户体验流畅性
- 设置持久化功能
- UI设计美观性