# 前端开发测试项目 - 代码示例参考

本文档提供一些代码实现的示例参考，帮助你理解项目的代码风格和最佳实践。

## Vue 3 组合式 API 示例

### 基础组件结构

```vue
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

// Props 定义
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
})

// Emits 定义
const emit = defineEmits<{
  (e: 'update', value: number): void
  (e: 'click'): void
}>()

// 响应式状态
const localCount = ref(props.count)

// 计算属性
const doubleCount = computed(() => localCount.value * 2)

// 方法
function increment(): void {
  localCount.value++
  emit('update', localCount.value)
}

// 监听器
watch(() => props.count, (newVal) => {
  localCount.value = newVal
})

// 生命周期
onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <p>Count: {{ localCount }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">
      Increment
    </button>
  </div>
</template>
```

## Pinia Store 示例

### 基础 Store 结构

```typescript
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // State
  const items = ref<string[]>([])
  const loading = ref(false)

  // Getters (使用 computed)
  const itemCount = computed(() => items.value.length)
  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  function addItem(item: string): void {
    items.value.push(item)
  }

  function removeItem(index: number): void {
    items.value.splice(index, 1)
  }

  async function fetchItems(): Promise<void> {
    loading.value = true
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      items.value = ['Item 1', 'Item 2', 'Item 3']
    }
    finally {
      loading.value = false
    }
  }

  return {
    // State
    items,
    loading,
    // Getters
    itemCount,
    isEmpty,
    // Actions
    addItem,
    removeItem,
    fetchItems,
  }
})
```

## TypeScript 类型定义示例

### 接口和类型

```typescript
// 基础类型
type Status = 'idle' | 'loading' | 'success' | 'error'

// 接口定义
interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
}

// 泛型类型
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

// 工具类型
type PartialUser = Partial<User>
type RequiredUser = Required<User>
type UserWithoutId = Omit<User, 'id'>

// 函数类型
type ValidatorFn = (value: string) => boolean
type AsyncHandler<T> = () => Promise<T>
```

## UnoCSS 样式示例

### 常用原子类

```vue
<template>
  <!-- Flexbox 布局 -->
  <div flex items-center justify-between gap-4>
    <span>Left</span>
    <span>Right</span>
  </div>

  <!-- Grid 布局 -->
  <div grid grid-cols-3 gap-2>
    <div>1</div>
    <div>2</div>
    <div>3</div>
  </div>

  <!-- 间距和尺寸 -->
  <div p-4 m-2 w-full h-10>
    Padding, Margin, Width, Height
  </div>

  <!-- 颜色和背景 -->
  <div bg-blue-500 text-white hover:bg-blue-600>
    Blue background
  </div>

  <!-- 暗色模式 -->
  <div bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100>
    Supports dark mode
  </div>

  <!-- 响应式 -->
  <div text-sm md:text-base lg:text-lg>
    Responsive text
  </div>

  <!-- 过渡动画 -->
  <button transition-colors duration-200 hover:bg-gray-100>
    Smooth hover
  </button>

  <!-- 圆角和阴影 -->
  <div rounded-lg shadow-md>
    Card style
  </div>
</template>
```

## 表单验证示例

### 验证逻辑

```typescript
interface ValidationResult {
  valid: boolean
  message?: string
}

// 验证函数
function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email) {
    return { valid: false, message: 'Email is required' }
  }

  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' }
  }

  return { valid: true }
}

function validateRange(
  value: number,
  min: number,
  max: number,
): ValidationResult {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return { valid: false, message: 'Must be a number' }
  }

  if (value < min) {
    return { valid: false, message: `Minimum value is ${min}` }
  }

  if (value > max) {
    return { valid: false, message: `Maximum value is ${max}` }
  }

  return { valid: true }
}

// 在组件中使用
const errors = reactive<Record<string, string>>({})

function validateForm(): boolean {
  // 清除之前的错误
  Object.keys(errors).forEach(key => delete errors[key])

  // 验证各字段
  const emailResult = validateEmail(formData.email)
  if (!emailResult.valid) {
    errors.email = emailResult.message!
  }

  const ageResult = validateRange(formData.age, 18, 100)
  if (!ageResult.valid) {
    errors.age = ageResult.message!
  }

  return Object.keys(errors).length === 0
}
```

## 本地存储示例

### 持久化数据

```typescript
const STORAGE_KEY = 'app_settings'

interface Settings {
  theme: 'light' | 'dark'
  language: string
}

// 保存到本地存储
function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }
  catch (error) {
    console.error('Failed to save settings:', error)
  }
}

// 从本地存储加载
function loadSettings(): Settings | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved) as Settings
    }
  }
  catch (error) {
    console.error('Failed to load settings:', error)
  }
  return null
}

// 带默认值的加载
function loadSettingsWithDefaults(defaults: Settings): Settings {
  const saved = loadSettings()
  return saved ? { ...defaults, ...saved } : defaults
}
```

## 异步操作示例

### Promise 和 async/await

```typescript
// 模拟 API 调用
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// 带超时的 Promise
function withTimeout<T>(
  promise: Promise<T>,
  timeout: number,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout),
    ),
  ])
}

// 在组件中使用
const data = ref<Data | null>(null)
const error = ref<string | null>(null)
const loading = ref(false)

async function loadData(): Promise<void> {
  loading.value = true
  error.value = null

  try {
    data.value = await withTimeout(
      fetchData<Data>('/api/data'),
      5000,
    )
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  }
  finally {
    loading.value = false
  }
}
```

## 事件处理示例

### 键盘和鼠标事件

```vue
<script setup lang="ts">
// 键盘事件处理
function handleKeydown(event: KeyboardEvent): void {
  // Enter 发送，Shift+Enter 换行
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }

  // Escape 取消
  if (event.key === 'Escape') {
    cancel()
  }

  // Ctrl/Cmd + S 保存
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault()
    save()
  }
}

// 点击外部关闭
function handleClickOutside(event: MouseEvent): void {
  const target = event.target as HTMLElement
  if (!containerRef.value?.contains(target)) {
    close()
  }
}
</script>

<template>
  <textarea
    @keydown="handleKeydown"
    placeholder="Type here..."
  />
</template>
```

## 动画示例

### CSS 过渡

```vue
<template>
  <!-- Vue Transition -->
  <Transition name="fade">
    <div v-if="show">
      Content
    </div>
  </Transition>

  <!-- TransitionGroup 列表动画 -->
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </TransitionGroup>
</template>

<style scoped>
/* Fade 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 列表动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-move {
  transition: transform 0.3s ease;
}

/* 脉冲动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
</style>
```

---

以上示例展示了项目中常用的代码模式。在实现测试任务时，可以参考这些示例来保持代码风格的一致性。

如有疑问，请查阅 Vue 3、TypeScript 和 UnoCSS 官方文档。
