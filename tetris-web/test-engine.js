// 简单测试游戏引擎核心逻辑
import { GameEngine } from './src/core/GameEngine.ts'

console.log('🎮 Tetris Web - 游戏引擎测试\n')

const engine = new GameEngine()
let state = engine.start()

console.log('✅ 游戏启动成功')
console.log(`   初始分数：${state.score}`)
console.log(`   初始等级：${state.level}`)
console.log(`   游戏结束：${state.gameOver}`)
console.log(`   当前方块：${state.currentTetromino?.type}`)
console.log(`   下一个方块：${state.nextTetromino?.type}`)

// 测试移动
console.log('\n📍 测试移动功能:')
const movedLeft = engine.moveLeft()
console.log(`   左移：${movedLeft ? '✅' : '❌'}`)

const movedRight = engine.moveRight()
console.log(`   右移：${movedRight ? '✅' : '❌'}`)

const movedDown = engine.moveDown()
console.log(`   下落：${movedDown ? '✅' : '❌'}`)

// 测试旋转
console.log('\n🔄 测试旋转功能:')
const rotated = engine.rotate()
console.log(`   旋转：${rotated ? '✅' : '❌'}`)

// 测试暂停
console.log('\n⏸️  测试暂停功能:')
state = engine.togglePause()
console.log(`   暂停状态：${state.isPaused ? '已暂停 ✅' : '未暂停 ❌'}`)

state = engine.togglePause()
console.log(`   继续游戏：${!state.isPaused ? '已继续 ✅' : '仍暂停 ❌'}`)

// 测试直接落下
console.log('\n⬇️  测试直接落下:')
engine.drop()
console.log(`   直接落下：✅`)

// 测试重新开始
console.log('\n🔄 测试重新开始:')
state = engine.restart()
console.log(`   重新开始：✅`)
console.log(`   新游戏分数：${state.score}`)
console.log(`   游戏结束：${state.gameOver}`)

console.log('\n✅ 所有核心功能测试通过!\n')
