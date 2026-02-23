# nanobot-node
Ultra-Lightweight Personal AI Assistant (Node.js Version) - Part of the nanobot ecosystem, inspired by OpenClaw

## 📋 项目简介
nanobot-node 是参考 HKUDS 开发的 nanobot 项目的 TypeScript/Node.js 开源实现，作为一个轻量级的个人 AI 助手，基于 TypeScript 开发，兼容多种 LLM 提供商，包括 OpenAI 和 DeepSeek。它与 Python 版本的 nanobot 共享相同的核心概念和目标，但专注于提供更轻量、更快速的 Node.js 实现。

### 与 nanobot 的关系
- **nanobot**：由 HKUDS 开发的 Python 版本完整 AI 助手，功能丰富，支持更多插件和集成，项目地址：[https://github.com/HKUDS/nanobot](https://github.com/HKUDS/nanobot)
- **nanobot-node**：TypeScript/Node.js 轻量级版本，专注于核心功能和性能

### 与 OpenClaw 的关系
nanobot 生态系统的技能系统灵感来源于 [OpenClaw](https://github.com/openclaw/openclaw) 项目，OpenClaw 提供了一个灵活、可扩展的技能系统框架，为 AI 助手提供了丰富的功能扩展能力。

nanobot-node具有以下特点：
- 🪶 **轻量级**：核心代码简洁，易于理解和扩展
- 🔧 **功能丰富**：支持文件操作、Shell 命令执行、Web 搜索等多种工具
- 🔄 **多提供商支持**：支持 OpenAI 和 DeepSeek API
- 📱 **多通道集成**：支持命令行交互
- 🧠 **记忆系统**：具有持久化记忆功能

## 🚀 快速开始

### 1. 安装依赖

```bash
cd nanobot-node
npm install
```

### 2. 初始化配置

```bash
npm run onboard
```

### 3. 配置 API 密钥

编辑 `~/.nanobot-node/config.json` 文件，添加你的 API 密钥：

#### OpenAI 配置

```json
{
  "providers": {
    "openai": {
      "apiKey": "your-openai-api-key"
    }
  },
  "agents": {
    "defaults": {
      "model": "gpt-3.5-turbo"
    }
  }
}
```

#### DeepSeek 配置

```json
{
  "providers": {
    "deepseek": {
      "apiKey": "your-deepseek-api-key",
      "apiBase": "https://api.deepseek.com/v1"  // 可选，默认值
    }
  },
  "agents": {
    "defaults": {
      "model": "deepseek-chat"  // 可选，默认值
    }
  }
}
```

### 4. 启动代理

```bash
npm run agent
```

## 📖 使用方法

### 命令行工具

- `npm run onboard` - 初始化配置和工作区
- `npm run agent` - 启动代理聊天
- `npm run gateway` - 启动网关（用于通道集成）
- `npm run status` - 查看状态

### 示例命令

#### 1. 聊天

```bash
npm run agent -- -m "你好，我是 nanobot-node"
```

#### 2. 执行 Shell 命令

```bash
npm run agent -- -m "执行 ls -la 命令"
```

#### 3. 读取文件

```bash
npm run agent -- -m "读取 package.json 文件"
```

#### 4. Web 搜索

```bash
npm run agent -- -m "搜索最新的 Node.js 版本"
```

## 🛠️ 核心功能

### 1. 工具系统

- **文件操作**：读取、写入、编辑、列出目录
- **Shell 命令**：执行系统命令
- **Web 搜索**：使用 DuckDuckGo 搜索信息
- **Web 获取**：获取网页内容

### 2. 记忆系统

- **长期记忆**：存储在 `workspace/memory/MEMORY.md`
- **历史记录**：存储在 `workspace/memory/HISTORY.md`

### 3. 会话管理

- **会话持久化**：自动保存会话到磁盘
- **会话历史**：支持查看和管理历史会话

### 4. 多提供商支持

- **OpenAI**：支持 GPT 系列模型
- **DeepSeek**：支持 DeepSeek 系列模型

## 📁 项目结构

```
nanobot-node/
├── src/
│   ├── agent/          # 核心代理逻辑
│   │   ├── tools/      # 内置工具
│   │   ├── context.ts  # 上下文构建器
│   │   ├── loop.ts     # 代理循环
│   │   └── memory.ts   # 记忆系统
│   ├── bus/            # 消息总线
│   ├── config/         # 配置管理
│   ├── providers/      # LLM 提供商
│   ├── session/        # 会话管理
│   ├── cli/            # 命令行工具
│   └── utils/          # 工具函数
├── workspace/          # 工作区
│   └── memory/         # 记忆存储
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript 配置
└── README.md           # 项目说明
```

## 📚 技术栈

- **语言**：TypeScript
- **包管理**：npm
- **异步处理**：Async/Await
- **文件操作**：fs/path
- **网络请求**：axios
- **命令行工具**：commander
- **日志**：winston
- **配置管理**：dotenv + JSON
- **LLM 集成**：openai
- **定时任务**：cron

### 生态系统集成

- **nanobot 生态**：与 Python 版本 nanobot 共享核心概念
- **OpenClaw 灵感**：借鉴 OpenClaw 的技能系统设计理念

## 🎯 支持的 LLM 模型

### OpenAI
- gpt-3.5-turbo
- gpt-4
- gpt-4o

### DeepSeek
- deepseek-chat
- deepseek-llm-7b-chat
- deepseek-llm-16b-chat

## 🔧 配置选项

### 基础配置

```json
{
  "providers": {
    "openai": {
      "apiKey": "your-api-key",
      "apiBase": "https://api.openai.com/v1"  // 可选
    },
    "deepseek": {
      "apiKey": "your-api-key",
      "apiBase": "https://api.deepseek.com/v1"  // 可选
    }
  },
  "agents": {
    "defaults": {
      "model": "gpt-3.5-turbo",  // 默认模型
      "temperature": 0.7,         // 温度参数
      "maxTokens": 4096           // 最大 tokens
    }
  },
  "tools": {
    "restrictToWorkspace": false  // 是否限制工具操作在工作区内
  }
}
```

## 🤝 贡献

欢迎贡献代码和提出建议！如果您有任何问题或建议，请随时提交 issue 或 PR。

## 📄 许可证

MIT License

## 📞 联系我们

如有任何问题，请在 GitHub 仓库提交 issue。

---

**提示**：首次使用时，请确保正确配置 API 密钥，否则可能无法正常使用 LLM 功能。
