<template>
  <div class="game-container">
    <canvas ref="canvas" width="300" height="600"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { GameState } from '../types'

const props = defineProps<{
  gameState: GameState | null
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const CELL_SIZE = 30
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

const draw = () => {
  if (!canvas.value || !props.gameState) return
  
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  
  // 清空画布
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
  
  // 绘制网格
  ctx.strokeStyle = '#2a2a3e'
  ctx.lineWidth = 1
  for (let x = 0; x <= BOARD_WIDTH; x++) {
    ctx.beginPath()
    ctx.moveTo(x * CELL_SIZE, 0)
    ctx.lineTo(x * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE)
    ctx.stroke()
  }
  for (let y = 0; y <= BOARD_HEIGHT; y++) {
    ctx.beginPath()
    ctx.moveTo(0, y * CELL_SIZE)
    ctx.lineTo(BOARD_WIDTH * CELL_SIZE, y * CELL_SIZE)
    ctx.stroke()
  }
  
  // 绘制已固定的方块
  props.gameState.board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        drawBlock(ctx, x, y, cell)
      }
    })
  })
  
  // 绘制当前方块
  if (props.gameState.currentTetromino) {
    const { shape, position, color } = props.gameState.currentTetromino
    shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          drawBlock(ctx, position.x + x, position.y + y, color)
        }
      })
    })
  }
}

const drawBlock = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
  const padding = 1
  ctx.fillStyle = color
  ctx.fillRect(
    x * CELL_SIZE + padding,
    y * CELL_SIZE + padding,
    CELL_SIZE - padding * 2,
    CELL_SIZE - padding * 2
  )
  
  // 添加高光效果
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.fillRect(
    x * CELL_SIZE + padding,
    y * CELL_SIZE + padding,
    CELL_SIZE - padding * 2,
    (CELL_SIZE - padding * 2) / 3
  )
}

watch(() => props.gameState, draw, { deep: true })
onMounted(draw)
</script>

<style scoped>
.game-container {
  border: 4px solid #4a4a6a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}
canvas {
  display: block;
}
</style>
