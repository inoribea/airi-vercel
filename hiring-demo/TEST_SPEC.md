# 前端开发测试说明

本说明用于 60 分钟面试，候选人可跨子项自选实现。可使用任意自助工具，最终以可运行代码和完成度为准。

## 测试模式与选题
- 时间：60 分钟。
- 选题：完成 1 个高星（★★★★☆/★★★★★）或若干中低星子项（总星级 ≥ 4），可跨主题组合。
- 提交：确保能运行，说明已完成子项，必要时附最小验证步骤。

## 考察维度（无固定分值）
- 功能完成度：达成子项目标并覆盖关键边界。
- 代码质量：类型/校验、职责拆分、命名与可读性、避免重复和死代码。
- 体验：交互反馈、动画与状态可视化、移动端适配、基础可访问性。
- 工程习惯：最小自测步骤、错误提示、符合现有样式与状态管理约定。

## 任务子项清单与达成定义

### 聊天与多模态（Chat & Input）
- ★★★★★ 多模态输入整合（`apps/stage-web/src/components/InputControls.vue`）
  - 达成：语音触发流程（启动/结束/错误提示）、图片上传与预览、输入模式切换，状态指示同步。
  - 验收：按钮状态与异常提示可见，图片预览无刷新，移动端触控可用。
- ★★★★☆ 消息流体验（`apps/stage-web/src/components/ChatInterface.vue`）
  - 达成：发送/接收气泡样式、表情插入、发送后自动滚动最新。
  - 验收：气泡对齐与头像/时间清晰，表情能插入文本，长列表保持滚动定位。
- ★★★☆☆ 输入状态指示（`apps/stage-web/src/components/StatusIndicator.vue`）
  - 达成：发送中/上传中/录音中等状态的颜色/动效展示，可与输入/上传逻辑联动。
  - 验收：状态切换平滑，无闪烁或长时间卡死态。
- ★★☆☆☆ 表情插入与文本发送（`apps/stage-web/src/components/ChatInterface.vue`）
  - 达成：表情面板选择并写入输入框，基础文本发送链路。
  - 验收：表情正确插入，发送后清空/重置可用态。

### 配置与偏好（Settings）
- ★★★★☆ 记忆配置可靠性（`apps/stage-web/src/pages/settings/memory/index.vue`）
  - 达成：参数范围/格式校验，错误提示清晰；保存/加载流程可复用；边界回退策略。
  - 验收：输入非法值有即时提示；保存后刷新仍能加载；移动端表单可操作。
- ★★★☆☆ 用户偏好持久化（`apps/stage-web/src/stores/settings.ts`, `apps/stage-web/src/pages/test.vue`）
  - 达成：主题切换、本地存储同步加载、设置变化实时响应 UI。
  - 验收：刷新后仍保留主题；切换无明显闪屏；多标签页可同步（可模拟）。
- ★★☆☆☆ 配置表单可用性（`apps/stage-web/src/pages/settings/memory/index.vue`）
  - 达成：表单分组、提示文案、基础必填/格式校验，提交/重置流程清晰。
  - 验收：错误态提示位置合理，键盘/触控可用。

### 状态可视化（Status）
- ★★★☆☆ 助手状态展示（`apps/stage-web/src/components/StatusIndicator.vue`）
  - 达成：在线/思考/响应/离线颜色编码，过渡动画与可读标签。
  - 验收：状态切换时动画平滑且含文字提示，可适配暗色。
- ★★☆☆☆ 状态数据接入（`apps/stage-web/src/components/StatusIndicator.vue`）
  - 达成：从现有 store/composable 读取状态并驱动 UI，含空态/错误态保护。
  - 验收：无数据时有兜底，状态切换不抛异常。

## 路由与入口（已存在页面树）
```
/
├─ /test                         -> apps/stage-web/src/pages/test.vue
├─ /settings
│  ├─ /settings/memory           -> apps/stage-web/src/pages/settings/memory/index.vue
│  └─ /settings/system           -> apps/stage-web/src/pages/settings/system/index.vue
│      └─ /settings/system/developer -> apps/stage-web/src/pages/settings/system/developer.vue
├─ /devtools
│  ├─ /devtools/background-removal           -> apps/stage-web/src/pages/devtools/background-removal.vue
│  ├─ /devtools/use-magic-keys              -> apps/stage-web/src/pages/devtools/use-magic-keys.vue
│  ├─ /devtools/audio-record                -> apps/stage-web/src/pages/devtools/audio-record.vue
│  ├─ /devtools/background-gradient-blending-> apps/stage-web/src/pages/devtools/background-gradient-blending.vue
│  ├─ /devtools/gesture-circle              -> apps/stage-web/src/pages/devtools/gesture-circle.vue
│  └─ /devtools/polaroid                    -> apps/stage-web/src/pages/devtools/polaroid.vue
└─ /* (fallback)                 -> apps/stage-web/src/pages/[...all].vue
```

组件入口（无独立路由）：`apps/stage-web/src/components/ChatInterface.vue`、`InputControls.vue`、`StatusIndicator.vue`。可在 `/test` 页面或自行挂载验证。
