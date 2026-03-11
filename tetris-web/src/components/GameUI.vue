<template>
  <div class="ui-panel">
    <div class="info-section">
      <h3>下一个</h3>
      <div class="next-piece">
        <canvas ref="nextCanvas" width="120" height="90"></canvas>
      </div>
    </div>
    
    <div class="stats-section">
      <div class="stat-item">
        <span class="label">分数</span>
        <span class="value">{{ gameState?.score || 0 }}</span>
      </div>
      <div class="stat-item">
        <span class="label">消行</span>
        <span class="value">{{ gameState?.lines || 0 }}</span>
      </div>
      <div class="stat-item">
        <span class="label">等级</span>
        <span class="value">{{ gameState?.level || 1 }}</span>
      </div>
    </div>
    
    <div class="controls-section">
      <button @click="$emit('rotate')" class="control-btn">旋转 ↑</button>
      <button @click="$emit('left')" class="control-btn">左移 ←</button>
      <button @click="$emit('down')" class="control-btn">下落 ↓</button>
      <button @click="$emit('right')" class="control-btn">右移 →</button>
      <button @click="$emit('drop')" class="control-btn primary">直接落下 Space</button>
      <button @click="$emit('pause')" class="control-btn">{{ gameState?.isPaused ? '继续 P' : '暂停 P' }}</button>
      <button @click="$emit('restart')" class="control-btn danger">重新开始 R</button>
    </div>
    
    <div v-if="gameState?.gameOver" class="game-over">
      <h2>游戏结束!</h2>
      <p>最终分数：{{ gameState.score }}</p>
      <button @click="$emit('restart')" class="restart-btn">再来一局</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { GameState } from '../types'

defineProps<{
  gameState: GameState | null
}>()

defineEmits<{
  (e: 'rotate'): void
  (e: 'left'): void
  (e: 'right'): void
  (e: 'down'): void
  (e: 'drop'): void
  (e: 'pause'): void
  (e: 'restart'): void
}>()

const nextCanvas = ref<HTMLCanvasElement | null>(null)

const drawNextPiece = () => {
  if (!nextCanvas.value || !props.gameState?.nextTetromino) return
  
  const ctx = nextCanvas.value.getContext('2d')
  if (!ctx) return
  
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, nextCanvas.value.width, nextCanvas.value.height)
  
  const { shape, color } = props.gameState.nextTetromino
  const cellSize = 25
  const offsetX = (nextCanvas.value.width - shape[0].length * cellSize) / 2
  const offsetY = (nextCanvas.value.height - shape.length * cellSize) / 2
  
  shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        ctx.fillStyle = color
        ctx.fillRect(
          offsetX + x * cellSize + 1,
          offsetY + y * cellSize + 1,
          cellSize - 2,
          cellSize - 2
        )
      }
    })
  })
}

watch(() => props.gameState?.nextTetromino, drawNextPiece, { deep: true })
onMounted(drawNextPiece)
</script>

<style scoped>
.ui-panel {
  background: rgba(26, 26, 46, 0.9);
  padding: 20px;
  border-radius: 8px;
  color: #fff;
  min-width: 200px;
}

.info-section {
  margin-bottom: 20px;
}

.info-section h3 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #aaa;
}

.next-piece {
  background: #1a1a2e;
  border: 2px solid #4a4a6a;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stats-section {
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #3a3a5a;
}

.stat-item .label {
  color: #aaa;
}

.stat-item .value {
  font-weight: bold;
  color: #4fc3f7;
}

.controls-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-btn {
  padding: 10px;
  background: #3a3a5a;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.control-btn:hover {
  background: #4a4a6a;
  transform: translateY(-2px);
}

.control-btn.primary {
  background: #4caf50;
}

.control-btn.primary:hover {
  background: #45a049;
}

.control-btn.danger {
  background: #f44336;
}

.control-btn.danger:hover {
  background: #da190b;
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #f44336;
}

.game-over h2 {
  color: #f44336;
  margin-bottom: 15px;
}

.restart-btn {
  margin-top: 15px;
  padding: 12px 30px;
  background: #4caf50;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.restart-btn:hover {
  background: #45a049;
}
</style>
