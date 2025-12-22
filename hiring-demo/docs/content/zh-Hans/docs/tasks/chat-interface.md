# 消息系统界面

## 任务概述

在 `apps/stage-web/src/components/ChatInterface.vue` 中实现消息系统界面。

## 功能要求

### 消息显示
- 实现消息气泡组件，区分发送和接收消息
- 支持文本消息显示
- 显示消息发送时间戳
- 显示用户头像

### 消息发送
- 实现文本消息输入框
- 发送按钮功能
- 回车发送消息（Shift+回车换行）

### 表情符号支持
- 集成表情符号选择器
- 支持在消息中插入表情符号

## 技术实现

### 组件结构
```vue
<template>
  <div class="chat-interface">
    <div class="messages-container">
      <MessageBubble
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />
    </div>
    <ChatInput @send-message="handleSendMessage" />
  </div>
</template>
```

### 数据结构
```typescript
interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  avatar?: string
}
```

## 评分要点

- 消息界面美观且用户友好
- 消息滚动到最新位置
- 响应式设计
- 代码结构清晰