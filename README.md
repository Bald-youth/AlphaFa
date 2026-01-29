# Alpha Data - 多链代币分析器

Alpha Data 是一个现代、高性能的去中心化应用程序 (DApp)，专为跨多个区块链的实时代币分析而设计。它采用了 "Deep Space & Neon"（深空与霓虹）的高级美学风格，提供响应式的玻璃拟态用户界面。

## 🚀 功能特性

- **多链支持**：无缝集成 **Ethereum**、**BSC (Binance Smart Chain)** 和 **Solana**。
- **实时代币分析**：使用高级 Hooks 直接从区块链获取并分析代币数据。
- **现代化 UI/UX**：基于 CSS 变量、渐变和微交互动画构建的自定义设计系统。
- **响应式布局**：针对各种设备尺寸优化的全响应式设计。

## 🛠 技术栈

### 核心层
- **框架**: [React 19](https://react.dev/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite](https://vitejs.dev/)

### 区块链集成
- **EVM 兼容链**: [ethers.js v6](https://docs.ethers.org/) (Ethereum, BSC)
- **Solana**: [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/)

### 样式与界面
- **样式**: Vanilla CSS 3 (原生 CSS) 配合 CSS 变量 (Custom Properties)
- **设计系统**: Glassmorphism (玻璃拟态), 霓虹渐变, 深色模式
- **图标库**: [Lucide React](https://lucide.dev/)

## 📦 项目结构

```
src/
├── components/       # UI 组件 (SearchBar 等)
├── hooks/           # 用于区块链逻辑的自定义 Hook
│   ├── useTokenAnalyzer.ts   # 核心分析逻辑
│   ├── useMultiChainSearch.ts # 跨链搜索功能
│   └── useChainData.ts       # 特定链数据获取
├── index.css        # 全局样式和设计 Token
└── App.tsx          # 主应用入口
```

## 🚦 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **构建生产版本**
   ```bash
   npm run build
   ```

## 📝 本次开发归纳

本项目构建了一个与多链交互的稳健架构。主要开发内容包括：
- **自定义 Hooks**：开发了专门的 Hooks 用于处理 RPC 提供者连接和速率限制。
- **统一接口**：实现了一个单一的搜索栏组件，能够智能地将查询路由到相应的区块链。
- **视觉打磨**：在不依赖繁重 UI 框架的情况下，实现了高端的视觉风格（深空霓虹主题）。
