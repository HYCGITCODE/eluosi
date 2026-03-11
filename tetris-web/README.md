# Tetris Web - 网页版俄罗斯方块

基于 TypeScript + Vue 3 + Canvas 的经典俄罗斯方块游戏。

## 🎮 核心功能

- ✅ 方块下落
- ✅ 方块旋转
- ✅ 方块移动（左右）
- ✅ 消行计分
- ✅ 游戏结束检测
- ✅ 重新开始
- ✅ 暂停/继续
- ✅ 下一个方块预览
- ✅ 等级系统（速度递增）

## 🚀 技术栈

- **TypeScript** - 类型安全
- **Vue 3** - 响应式框架
- **Canvas** - 高性能渲染
- **Vite** - 快速构建工具

## 📦 安装与运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 🎯 操作说明

| 按键 | 功能 |
|------|------|
| ← → | 左右移动 |
| ↑ | 旋转方块 |
| ↓ | 加速下落 |
| Space | 直接落下 |
| P | 暂停/继续 |
| R | 重新开始 |

## 🏗️ 项目结构

```
tetris-web/
├── src/
│   ├── core/
│   │   └── GameEngine.ts    # 游戏核心逻辑
│   ├── components/
│   │   ├── GameCanvas.vue   # Canvas 渲染组件
│   │   └── GameUI.vue       # UI 界面组件
│   ├── types/
│   │   └── index.ts         # TypeScript 类型定义
│   ├── App.vue              # 主应用组件
│   └── main.ts              # 入口文件
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 游戏特性

- **7 种经典方块**: I, O, T, S, Z, J, L
- **计分系统**: 
  - 1 行：100 分
  - 2 行：300 分
  - 3 行：500 分
  - 4 行：800 分
- **等级系统**: 每消除 10 行升一级，下落速度加快
- **下一个方块预览**: 提前规划策略

## 📝 开发日志

- 项目初始化完成
- 游戏引擎核心逻辑实现
- Canvas 渲染系统实现
- UI 界面组件实现
- 键盘控制系统实现
- 游戏循环与动画实现

---

**开发时间**: 1.5 小时  
**开发者**: OCA Subagent
