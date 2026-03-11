<template>
  <div class="app">
    <h1 class="title">🎮 Tetris Web</h1>
    <div class="game-wrapper">
      <GameCanvas :game-state="gameState" />
      <GameUI 
        :game-state="gameState"
        @rotate="handleRotate"
        @left="handleLeft"
        @right="handleRight"
        @down="handleDown"
        @drop="handleDrop"
        @pause="handlePause"
        @restart="handleRestart"
      />
    </div>
    <div class="instructions">
      <p>← → 移动 | ↑ 旋转 | ↓ 加速 | Space 直接落下 | P 暂停 | R 重新开始</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { GameEngine } from './core/GameEngine'
import type { GameState } from './types'
import GameCanvas from './components/GameCanvas.vue'
import GameUI from './components/GameUI.vue'

const gameState = ref<GameState | null>(null)
const gameEngine = new GameEngine()
let gameLoop: number | null = null
let lastTime = 0
let dropCounter = 0
let dropInterval = 1000

const startGame = () => {
  gameState.value = gameEngine.start()
  dropInterval = 1000
  lastTime = 0
  dropCounter = 0
  gameLoop = requestAnimationFrame(update)
}

const update = (time: number) => {
  if (!gameState.value?.gameOver && !gameState.value?.isPaused) {
    const deltaTime = time - lastTime
    lastTime = time
    dropCounter += deltaTime
    
    if (dropCounter > dropInterval) {
      gameState.value = gameEngine.tick()
      dropInterval = gameState.value.level > 1 ? Math.max(100, 1000 - (gameState.value.level - 1) * 100) : 1000
      dropCounter = 0
    }
  }
  
  if (!gameState.value?.gameOver) {
    gameLoop = requestAnimationFrame(update)
  }
}

const handleRotate = () => {
  gameEngine.rotate()
  gameState.value = gameEngine.getState()
}

const handleLeft = () => {
  gameEngine.moveLeft()
  gameState.value = gameEngine.getState()
}

const handleRight = () => {
  gameEngine.moveRight()
  gameState.value = gameEngine.getState()
}

const handleDown = () => {
  gameEngine.moveDown()
  gameState.value = gameEngine.getState()
}

const handleDrop = () => {
  gameEngine.drop()
  gameState.value = gameEngine.getState()
}

const handlePause = () => {
  gameState.value = gameEngine.togglePause()
}

const handleRestart = () => {
  if (gameLoop) {
    cancelAnimationFrame(gameLoop)
  }
  startGame()
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (gameState.value?.gameOver) return
  
  switch (e.key) {
    case 'ArrowLeft':
      handleLeft()
      break
    case 'ArrowRight':
      handleRight()
      break
    case 'ArrowUp':
      handleRotate()
      break
    case 'ArrowDown':
      handleDown()
      break
    case ' ':
      e.preventDefault()
      handleDrop()
      break
    case 'p':
    case 'P':
      handlePause()
      break
    case 'r':
    case 'R':
      handleRestart()
      break
  }
}

onMounted(() => {
  startGame()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  if (gameLoop) {
    cancelAnimationFrame(gameLoop)
  }
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.title {
  color: #fff;
  font-size: 36px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  margin-bottom: 10px;
}

.game-wrapper {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  position: relative;
}

.instructions {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  text-align: center;
}
</style>
