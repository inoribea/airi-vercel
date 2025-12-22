# 多模态输入

## 任务概述

在 `apps/stage-web/src/components/InputControls.vue` 中实现多模态输入功能。

## 功能要求

### 语音输入
- 语音录制按钮
- 录制状态指示
- 录制时长显示
- 音量可视化

### 图像输入
- 图像上传按钮
- 图像预览功能
- 支持拖拽上传
- 文件类型和大小限制

### 输入状态管理
- 实时状态指示
- 加载状态显示
- 错误状态处理

## 技术实现

### 组件结构
```vue
<template>
  <div class="input-controls">
    <div class="input-buttons">
      <VoiceRecorder @record-complete="handleVoiceRecord" />
      <ImageUploader @image-selected="handleImageUpload" />
    </div>
    <div class="input-status" v-if="status">
      <StatusIndicator :status="status" />
    </div>
  </div>
</template>
```

### 音频处理
```typescript
interface AudioRecording {
  blob: Blob
  duration: number
  sampleRate: number
}
```

### 图像处理
```typescript
interface ImageUpload {
  file: File
  previewUrl: string
  metadata: {
    width: number
    height: number
    size: number
  }
}
```

## 评分要点

- 语音录制功能完整
- 图像上传功能实现
- 状态指示清晰
- 移动端适配良好