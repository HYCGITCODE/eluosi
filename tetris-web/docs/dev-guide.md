# Tetris Web - 开发规范

## 1. TypeScript 配置

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "exclude": ["node_modules", "dist"]
}
```

### 类型定义规范

```typescript
// src/types/index.ts

// 方块类型
export type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

// 游戏板单元格
export interface Cell {
  filled: boolean;
  color?: string;
}

// 方块接口
export interface Piece {
  type: PieceType;
  color: string;
  shape: number[][];
  rotations: number[][][];
  x: number;
  y: number;
}

// 游戏状态
export interface GameState {
  score: number;
  level: number;
  lines: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
}

// 事件类型
export type GameEvent = 
  | { type: 'PIECE_DROP'; piece: Piece }
  | { type: 'LINES_CLEAR'; count: number }
  | { type: 'GAME_OVER' }
  | { type: 'LEVEL_UP'; newLevel: number };
```

---

## 2. 代码规范

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | camelCase | `currentPiece`, `calculateScore()` |
| 类/组件 | PascalCase | `TetrisEngine`, `GameBoard` |
| 常量 | UPPER_SNAKE_CASE | `MAX_LEVEL`, `DEFAULT_SPEED` |
| 类型/接口 | PascalCase | `Piece`, `GameState` |
| 私有成员 | 前缀 `_` | `_canvas`, `_render()` |
| Vue 组件文件 | PascalCase | `GameBoard.vue`, `NextPiece.vue` |

### 代码风格

```typescript
// ✅ 推荐：使用 Composition API
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { TetrisEngine } from '@/engine/TetrisEngine';

const score = ref(0);
const isPlaying = ref(false);

const displayScore = computed(() => `Score: ${score.value}`);

function handleStart() {
  isPlaying.value = true;
}
</script>

// ❌ 避免：Options API（除非必要）
```

```typescript
// ✅ 推荐：明确的类型注解
function movePiece(piece: Piece, dx: number, dy: number): boolean {
  // ...
}

// ❌ 避免：隐式 any
function movePiece(piece, dx, dy) { ... }
```

```typescript
// ✅ 推荐：使用 const 而非 let
const MAX_LEVEL = 10;
const colors: Record<PieceType, string> = { ... };

// ❌ 避免：不必要的 var
var score = 0;
```

### Vue 组件规范

```vue
<script setup lang="ts">
// 1. imports
import { ref, onMounted } from 'vue';
import { gameState } from '@/state/gameState';

// 2. 类型定义
interface Props {
  cellSize?: number;
}

// 3. props/emit
const props = withDefaults(defineProps<Props>(), {
  cellSize: 30,
});

const emit = defineEmits<{
  (e: 'gameOver', score: number): void;
}>();

// 4. 响应式状态
const canvasRef = ref<HTMLCanvasElement | null>(null);

// 5. 生命周期
onMounted(() => {
  initGame();
});

// 6. 方法
function initGame() {
  // ...
}
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped>
/* 组件样式 */
</style>
```

### 注释规范

```typescript
/**
 * 计算方块下落速度
 * @param level 当前等级 (1-10)
 * @returns 下落间隔（毫秒）
 */
function calculateDropInterval(level: number): number {
  // 每升一级，速度加快 10%
  const baseSpeed = 1000;
  return Math.max(100, baseSpeed * Math.pow(0.9, level - 1));
}

// ✅ 好的注释：解释"为什么"
// 使用 10x20 的标准俄罗斯方块游戏板尺寸
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// ❌ 冗余注释：重复代码已表达的内容
// 将分数加 1
score.value++;
```

---

## 3. 提交规范

### Commit Message 格式

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构（非新功能、非 bug 修复） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具配置 |

### 示例

```bash
# 新功能
git commit -m "feat(engine): 添加硬下落功能"

# Bug 修复
git commit -m "fix(renderer): 修复方块旋转时的边界问题"

# 文档更新
git commit -m "docs: 更新架构设计文档"

# 带详细描述的提交
git commit -m "feat(game): 添加下一个方块预览

- 在右上角显示即将出现的方块
- 使用 4x4 网格预览
- 支持移动端适配

Closes #12"
```

### Git Hook（推荐）

使用 Husky + lint-staged 实现提交前检查：

```json
// package.json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint src --ext .ts,.vue",
    "type-check": "vue-tsc --noEmit"
  },
  "lint-staged": {
    "*.{ts,vue}": ["eslint --fix", "git add"]
  }
}
```

```bash
# .husky/pre-commit
#!/bin/sh
npm run lint-staged
npm run type-check
```

---

## 4. 目录规范

### 文件组织原则

1. **功能内聚**: 相关代码放在同一目录
2. **扁平优先**: 避免过深的嵌套（不超过 4 层）
3. **索引导出**: 目录提供 `index.ts` 统一导出

```typescript
// src/engine/index.ts
export { TetrisEngine } from './TetrisEngine';
export { Piece } from './Piece';
export { Board } from './Board';
export { CollisionDetector } from './Collision';
```

### 导入路径

使用 `@` 别名指向 `src` 目录：

```typescript
// ✅ 推荐
import { TetrisEngine } from '@/engine/TetrisEngine';
import { gameState } from '@/state/gameState';

// ❌ 避免：相对路径过深
import { TetrisEngine } from '../../engine/TetrisEngine';
```

---

## 5. 测试规范

### 单元测试（Vitest）

```typescript
// src/engine/__tests__/TetrisEngine.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { TetrisEngine } from '../TetrisEngine';

describe('TetrisEngine', () => {
  let engine: TetrisEngine;

  beforeEach(() => {
    engine = new TetrisEngine();
  });

  it('should initialize with empty board', () => {
    expect(engine.board.isEmpty()).toBe(true);
  });

  it('should spawn a new piece on start', () => {
    engine.start();
    expect(engine.currentPiece).toBeDefined();
  });

  it('should detect game over when piece cannot spawn', () => {
    // 测试逻辑
  });
});
```

### 测试覆盖率目标

| 模块 | 覆盖率目标 |
|------|-----------|
| 游戏引擎 | 90%+ |
| 碰撞检测 | 100% |
| 渲染器 | 70%+ |
| 状态管理 | 80%+ |

---

## 6. 性能检查清单

开发过程中定期检查：

- [ ] 避免在渲染循环中创建新对象
- [ ] 使用 `requestAnimationFrame` 而非 `setInterval`
- [ ] Canvas 状态变化时调用 `ctx.save()`/`ctx.restore()`
- [ ] 移除不再使用的事件监听器
- [ ] 使用 Chrome DevTools Performance 面板分析

---

## 7. 调试技巧

### 开发模式功能

```typescript
// 启用调试模式
const DEBUG = import.meta.env.DEV;

if (DEBUG) {
  // 显示碰撞盒
  renderer.showCollisionBoxes = true;
  
  // 打印游戏状态日志
  engine.on('PIECE_DROP', (piece) => {
    console.log('[DEBUG] Piece dropped:', piece);
  });
}
```

### 浏览器 DevTools

- **Elements**: 检查 Canvas 尺寸和样式
- **Console**: 查看游戏事件日志
- **Performance**: 分析帧率和性能瓶颈
- **Memory**: 检测内存泄漏

---

*文档版本：v1.0*  
*创建时间：2026-03-11*
