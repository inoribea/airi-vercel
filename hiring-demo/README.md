# 前端开发能力测试项目

## 项目概述

这是一个用于测试前端开发者能力的半完成项目，基于现有的 `stage-web` 代码骨架，包含已完成和待实现的功能。

## 技术栈

- **Vue 3** - 组合式API、响应式系统
- **TypeScript** - 类型安全、接口定义
- **Vite** - 快速构建、开发服务器
- **Pinia** - 状态管理
- **UnoCSS** - 原子化CSS样式框架

## 项目结构

```
hiring-demo/
├── apps/
│   └── stage-web/                    # 主要Web应用
│       ├── src/
│       │   ├── components/           # 可复用组件
│       │   │   ├── ChatInterface.vue     # 聊天界面 ⭐
│       │   │   ├── InputControls.vue     # 多模态输入 ⭐
│       │   │   └── StatusIndicator.vue   # 状态指示器 ⭐
│       │   ├── pages/                # 页面组件
│       │   │   ├── test.vue              # 测试整合页面
│       │   │   └── settings/
│       │   │       └── memory/
│       │   │           └── index.vue     # 记忆配置 ⭐
│       │   ├── stores/               # Pinia状态管理
│       │   │   ├── chat.ts               # 聊天Store
│       │   │   └── settings.ts           # 设置Store ⭐
│       │   ├── types/                # TypeScript类型定义
│       │   │   └── index.ts
│       │   └── utils/                # 工具函数
│       └── package.json
├── packages/                         # 共享包
│   ├── ui/                           # UI组件库
│   └── server-sdk/                   # 服务端SDK
├── TEST_SPEC.md                      # 详细测试说明
├── HIRING_EXAMPLES.md                # 参考示例
└── README.md                         # 本文件
```

**⭐ 标记的文件为主要测试目标**

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

### 3. 访问应用

- 主页面：http://localhost:5173
- 测试页面：http://localhost:5173/test
- 记忆设置：http://localhost:5173/settings/memory

## 测试任务（自选，可用自助工具）

- 面试总时长 60 分钟，可使用你熟悉的工具完成。
- 选择规则：从下方任务池中自选 1 个高星（★★★★☆/★★★★★）或若干中低星（★★★☆ 以下）的任务（建议总计 ≥4 星），完成度与代码质量并重。
- 难度标识：★☆☆☆☆（入门）~ ★★★★★（最高）。
- 详细功能要求见 `TEST_SPEC.md`，下方仅列核心点位与入口。

### 任务池（拆分子项可自由组合）

- 选择策略：用 60 分钟完成 1 个高星子项或若干低星子项（建议总计 ≥4 星），可自由跨任务组合。
- 评分重点：完成度 > 难度，代码质量/可读性/可维护性同等重要。

#### 聊天与多模态（Chat & Input）
- ★★★★★ 多模态输入整合（全链路）：语音触发 + 图片上传预览 + 输入态切换与状态指示；入口 `apps/stage-web/src/components/InputControls.vue`
- ★★★★☆ 消息流体验：发送/接收气泡 + 表情选择 + 自动滚动保持最新；入口 `apps/stage-web/src/components/ChatInterface.vue`
- ★★★☆☆ 输入状态指示：发送中/上传中/录音中状态可视化，含颜色与动画；入口 `apps/stage-web/src/components/StatusIndicator.vue`
- ★★☆☆☆ 表情插入与文本发送：表情面板接入、基础文本发送链路；入口 `apps/stage-web/src/components/ChatInterface.vue`

#### 配置与偏好（Settings）
- ★★★★☆ 记忆配置可靠性：参数验证（范围/格式）、错误提示、保存与加载逻辑；入口 `apps/stage-web/src/pages/settings/memory/index.vue`
- ★★★☆☆ 用户偏好持久化：主题切换、本地存储同步、设置变化实时响应；入口 `apps/stage-web/src/stores/settings.ts`、`apps/stage-web/src/pages/test.vue`
- ★★☆☆☆ 配置表单可用性：表单分组、提示文案、基础校验反馈；入口 `apps/stage-web/src/pages/settings/memory/index.vue`

#### 状态可视化（Status）
- ★★★☆☆ 助手状态展示：在线/思考/响应/离线的颜色编码、过渡动画；入口 `apps/stage-web/src/components/StatusIndicator.vue`
- ★★☆☆☆ 状态数据接入：从现有 store/composable 读取状态并驱动 UI；入口 `apps/stage-web/src/components/StatusIndicator.vue`

## 开发要求

### 代码质量
- 使用TypeScript进行类型安全编程
- 组件结构清晰，职责单一
- 合理使用组合式API
- 遵循Vue 3最佳实践

### UI/UX要求
- 响应式设计，适配移动设备
- 一致的视觉风格
- 平滑的过渡动画
- 良好的可访问性

### 技术要求
- 使用UnoCSS进行样式开发
- 正确使用Pinia进行状态管理
- 合理的数据流设计
- 错误处理机制

## 评估参考（无分值，仅供面试官参考）
- 功能完成度：是否达成自选子项的目标和边界处理。
- 代码质量：类型与校验、职责拆分、命名与可读性、重复与死代码控制。
- 体验：交互反馈、动画/状态可视化、移动端适配、基础可访问性。
- 工程习惯：最小验证步骤、自检与报错提示、遵循现有样式和状态管理约定。

## 运行 / 调试 / 调用
- 安装：`pnpm install`
- 开发：`pnpm dev`（默认端口 `5173`），测试页 `/test`，记忆页 `/settings/memory`
- 类型检查：`pnpm -F @proj-airi/stage-web typecheck`
- Lint：`pnpm -F @proj-airi/stage-web lint`
- 构建预览：`pnpm -F @proj-airi/stage-web build && pnpm -F @proj-airi/stage-web preview`
- API 约定：当前无真实后端调用，前端逻辑均在本地 store/composable 内模拟；如需对接自定义接口，可在 `api/` 目录增加 Vercel Serverless 函数（`vercel.json` 已允许 `/api/*`），或在 `apps/stage-web/src/stores/chat.ts` / `settings.ts` 等处添加 fetch/mock。

## 提示

- 代码中已标注 `TODO` 的地方是需要完成或优化的部分
- 可以自由添加新的组件和工具函数
- 鼓励使用现有的UI组件库
- 遇到问题可以查阅文档

## 提交要求

1. 完成所有功能任务
2. 代码提交到本地仓库
3. 确保项目可正常运行
4. 代码注释清晰（中英文均可）

---

祝你测试顺利！ 🚀
