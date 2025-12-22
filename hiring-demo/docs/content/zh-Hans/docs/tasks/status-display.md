# 实时状态显示

## 任务概述

在 `apps/stage-web/src/components/StatusIndicator.vue` 中实现实时状态显示功能。

## 功能要求

### 状态类型
- 在线状态（绿色）
- 思考状态（黄色，脉冲动画）
- 响应状态（蓝色，呼吸动画）
- 离线状态（红色）
- 错误状态（闪烁红色）

### 动画效果
- 平滑状态转换动画
- 不同状态的视觉反馈
- 过渡效果自然

### 实时更新
- 状态变化实时响应
- 网络连接状态显示
- 响应延迟指示

## 技术实现

### 组件结构
```vue
<template>
  <div class="status-indicator" :class="statusClass">
    <div class="status-dot" :class="animationClass"></div>
    <span class="status-text">{{ statusText }}</span>
  </div>
</template>
```

### 状态定义
```typescript
type Status = 'online' | 'thinking' | 'responding' | 'offline' | 'error'

interface StatusInfo {
  status: Status
  timestamp: Date
  message?: string
}
```

### 动画类
```css
.thinking-animation {
  animation: pulse 1.5s infinite;
}

.responding-animation {
  animation: breathe 2s ease-in-out infinite;
}
```

## 评分要点

- 状态显示准确
- 动画效果流畅
- 视觉反馈清晰
- 响应式设计