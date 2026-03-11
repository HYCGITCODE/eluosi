# Tetris Web - 技术架构设计

## 1. 技术选型

### 核心栈
| 技术 | 版本 | 说明 |
|------|------|------|
| **TypeScript** | ^5.0.0 | 类型安全的 JavaScript 超集 |
| **Vue 3** | ^3.4.0 | 渐进式前端框架（Composition API） |
| **Canvas API** | Native | HTML5 原生 2D 渲染 |
| **Vite** | ^5.0.0 | 快速构建工具 |

### 选型理由
- **TypeScript**: 提供类型检查，减少运行时错误，提升代码可维护性
- **Vue 3**: Composition API 更适合游戏状态管理，响应式系统高效
- **Canvas**: 性能优异，适合 2D 游戏渲染，无需额外依赖
- **Vite**: 开发服务器启动快，HMR 热更新体验好

---

## 2. 项目结构

```
tetris-web/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.ts              # 应用入口
│   ├── App.vue              # 根组件
│   ├── components/
│   │   ├── GameBoard.vue    # 游戏主画布组件
│   │   ├── NextPiece.vue    # 下一个方块预览
│   │   ├── ScoreBoard.vue   # 分数显示
│   │   └── Controls.vue     # 控制按钮（移动端）
│   ├── engine/
│   │   ├── TetrisEngine.ts  # 核心游戏引擎
│   │   ├── Piece.ts         # 方块定义
│   │   ├── Board.ts         # 游戏板逻辑
│   │   └── Collision.ts     # 碰撞检测
│   ├── renderer/
│   │   └── CanvasRenderer.ts # Canvas 渲染器
│   ├── state/
│   │   └── gameState.ts     # 响应式状态管理
│   ├── styles/
│   │   └── main.css         # 全局样式
│   └── types/
│       └── index.ts         # TypeScript 类型定义
├── docs/
│   ├── architecture.md      # 本文档
│   └── dev-guide.md         # 开发规范
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── render.yaml              # Render 部署配置
```

---

## 3. 游戏引擎设计

### 核心类图

```
┌─────────────────┐
│ TetrisEngine    │  ← 主控制器
├─────────────────┤
│ - board: Board  │
│ - currentPiece  │
│ - nextPiece     │
│ - score: number │
│ - level: number │
├─────────────────┤
│ + start()       │
│ + pause()       │
│ + resume()      │
│ + gameOver()    │
│ + moveLeft()    │
│ + moveRight()   │
│ + rotate()      │
│ + drop()        │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│     Board       │  ← 游戏板状态
├─────────────────┤
│ - width: 10     │
│ - height: 20    │
│ - grid: Cell[][]│
├─────────────────┤
│ + isValid()     │
│ + mergePiece()  │
│ + clearLines()  │
│ + isGameOver()  │
└─────────────────┘
```

### 游戏循环

```typescript
// 使用 requestAnimationFrame 实现游戏循环
function gameLoop(timestamp: number) {
  if (!gameState.isPaused && !gameState.isGameOver) {
    const elapsed = timestamp - lastDropTime;
    if (elapsed > dropInterval) {
      engine.drop();  // 自动下落
      lastDropTime = timestamp;
    }
  }
  renderer.draw();  // 每帧渲染
  requestAnimationFrame(gameLoop);
}
```

### 方块定义

7 种标准方块（I, J, L, O, S, T, Z），每种有 4 个旋转状态：

```typescript
interface Piece {
  type: 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';
  color: string;
  shape: number[][];      // 当前旋转状态
  rotations: number[][][]; // 所有旋转状态
  x: number;              // 游戏板上的 x 坐标
  y: number;              // 游戏板上的 y 坐标
}
```

---

## 4. 渲染层设计

### CanvasRenderer 职责

```typescript
class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number = 30;  // 每个方格的像素大小

  constructor(canvas: HTMLCanvasElement);
  
  // 渲染整个游戏画面
  draw(board: Board, currentPiece: Piece, nextPiece: Piece): void;
  
  // 渲染单个方块
  drawPiece(piece: Piece, offsetX: number, offsetY: number): void;
  
  // 渲染游戏板网格
  drawBoard(board: Board): void;
  
  // 渲染特效（消除行时的闪光）
  drawLineClearEffect(lines: number[]): void;
}
```

### 渲染优化策略

1. **分层渲染**: 背景、网格、方块、UI 分层绘制
2. **脏矩形更新**: 只重绘变化区域（可选优化）
3. **离屏 Canvas**: 预渲染静态元素（网格线、背景）
4. **60 FPS 目标**: 使用 `requestAnimationFrame` 同步刷新率

### 视觉设计

| 元素 | 尺寸 | 颜色 |
|------|------|------|
| 游戏板 | 10×20 格 | 深色背景 (#1a1a2e) |
| 方块 | 30×30px/格 | 按方块类型区分 |
| 网格线 | 1px | 半透明灰色 |
| 下一个方块预览 | 4×4 格 | 同方块颜色 |

---

## 5. 状态管理

使用 Vue 3 的 `reactive` 和 `ref` 管理游戏状态：

```typescript
// src/state/gameState.ts
import { reactive, ref } from 'vue';

export const gameState = reactive({
  score: 0,
  level: 1,
  lines: 0,
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
});

export const highScore = ref<number>(0);
```

---

## 6. 输入处理

### 键盘控制
| 按键 | 动作 |
|------|------|
| ← / A | 左移 |
| → / D | 右移 |
| ↓ / S | 加速下落 |
| ↑ / W | 旋转 |
| Space | 硬下落（直接到底） |
| P | 暂停/继续 |

### 触摸控制（移动端）
- 滑动左/右：移动方块
- 滑动上：旋转
- 滑动下：加速下落
- 点击：硬下落

---

## 7. 扩展性设计

### 未来可扩展模块
- 🎵 音效系统（Web Audio API）
- 🏆 在线排行榜（后端集成）
- 🎨 主题切换
- 📊 游戏统计（最长存活、最多消除等）
- 🤖 AI 自动游玩

---

## 8. 性能指标目标

| 指标 | 目标值 |
|------|--------|
| 首屏加载 | < 2s |
| 帧率 | 60 FPS |
| Bundle 大小 | < 200KB (gzip) |
| 内存占用 | < 50MB |

---

*文档版本：v1.0*  
*创建时间：2026-03-11*
