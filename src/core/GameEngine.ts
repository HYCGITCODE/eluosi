import type { Tetromino, Position, Board, GameState, TetrominoType } from '../types'

// 方块形状定义
const TETROMINOES: Record<TetrominoType, { shape: number[][]; color: string }> = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f5ff' },
  O: { shape: [[1, 1], [1, 1]], color: '#ffeb3b' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#9c27b0' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#4caf50' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f44336' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#2196f3' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#ff9800' }
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

export class GameEngine {
  private board: Board
  private currentTetromino: Tetromino | null = null
  private nextTetromino: Tetromino | null = null
  private score: number = 0
  private lines: number = 0
  private level: number = 1
  private gameOver: boolean = false
  private isPaused: boolean = false
  private dropInterval: number = 1000

  constructor() {
    this.board = this.createBoard()
  }

  private createBoard(): Board {
    return Array.from({ length: BOARD_HEIGHT }, () => 
      Array(BOARD_WIDTH).fill(null)
    )
  }

  private createTetromino(type?: TetrominoType): Tetromino {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
    const selectedType = type || types[Math.floor(Math.random() * types.length)]
    const { shape, color } = TETROMINOES[selectedType]
    
    return {
      type: selectedType,
      shape: shape.map(row => [...row]),
      position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2), y: 0 },
      color
    }
  }

  public start(): GameState {
    this.board = this.createBoard()
    this.score = 0
    this.lines = 0
    this.level = 1
    this.gameOver = false
    this.isPaused = false
    this.dropInterval = 1000
    this.currentTetromino = this.createTetromino()
    this.nextTetromino = this.createTetromino()
    return this.getState()
  }

  public getState(): GameState {
    return {
      board: this.board.map(row => [...row]),
      currentTetromino: this.currentTetromino ? {
        ...this.currentTetromino,
        shape: this.currentTetromino.shape.map(row => [...row]),
        position: { ...this.currentTetromino.position }
      } : null,
      nextTetromino: this.nextTetromino ? {
        ...this.nextTetromino,
        shape: this.nextTetromino.shape.map(row => [...row]),
        position: { ...this.nextTetromino.position }
      } : null,
      score: this.score,
      lines: this.lines,
      level: this.level,
      gameOver: this.gameOver,
      isPaused: this.isPaused
    }
  }

  public moveLeft(): boolean {
    if (!this.currentTetromino || this.gameOver || this.isPaused) return false
    
    const newPos = { ...this.currentTetromino.position, x: this.currentTetromino.position.x - 1 }
    if (!this.checkCollision(this.currentTetromino.shape, newPos)) {
      this.currentTetromino.position = newPos
      return true
    }
    return false
  }

  public moveRight(): boolean {
    if (!this.currentTetromino || this.gameOver || this.isPaused) return false
    
    const newPos = { ...this.currentTetromino.position, x: this.currentTetromino.position.x + 1 }
    if (!this.checkCollision(this.currentTetromino.shape, newPos)) {
      this.currentTetromino.position = newPos
      return true
    }
    return false
  }

  public moveDown(): boolean {
    if (!this.currentTetromino || this.gameOver || this.isPaused) return false
    
    const newPos = { ...this.currentTetromino.position, y: this.currentTetromino.position.y + 1 }
    if (!this.checkCollision(this.currentTetromino.shape, newPos)) {
      this.currentTetromino.position = newPos
      return true
    }
    return false
  }

  public rotate(): boolean {
    if (!this.currentTetromino || this.gameOver || this.isPaused) return false
    
    const rotated = this.currentTetromino.shape[0].map((_, i) =>
      this.currentTetromino!.shape.map(row => row[i]).reverse()
    )
    
    if (!this.checkCollision(rotated, this.currentTetromino.position)) {
      this.currentTetromino.shape = rotated
      return true
    }
    return false
  }

  public drop(): void {
    if (!this.currentTetromino || this.gameOver || this.isPaused) return
    
    while (this.moveDown()) {
      // Keep moving down
    }
    this.lockTetromino()
  }

  private checkCollision(shape: number[][], position: Position): boolean {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = position.x + x
          const newY = position.y + y
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true
          }
          
          if (newY >= 0 && this.board[newY][newX]) {
            return true
          }
        }
      }
    }
    return false
  }

  private lockTetromino(): void {
    if (!this.currentTetromino) return
    
    const { shape, position, color } = this.currentTetromino
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardY = position.y + y
          const boardX = position.x + x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            this.board[boardY][boardX] = color
          }
        }
      }
    }
    
    this.clearLines()
    this.spawnNewTetromino()
  }

  private clearLines(): void {
    let linesCleared = 0
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (this.board[y].every(cell => cell !== null)) {
        this.board.splice(y, 1)
        this.board.unshift(Array(BOARD_WIDTH).fill(null))
        linesCleared++
        y++
      }
    }
    
    if (linesCleared > 0) {
      const points = [0, 100, 300, 500, 800]
      this.score += points[linesCleared] * this.level
      this.lines += linesCleared
      this.level = Math.floor(this.lines / 10) + 1
      this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100)
    }
  }

  private spawnNewTetromino(): void {
    this.currentTetromino = this.nextTetromino
    this.nextTetromino = this.createTetromino()
    
    if (this.checkCollision(this.currentTetromino.shape, this.currentTetromino.position)) {
      this.gameOver = true
    }
  }

  public tick(): GameState {
    if (this.gameOver || this.isPaused) return this.getState()
    
    if (!this.moveDown()) {
      this.lockTetromino()
    }
    
    return this.getState()
  }

  public togglePause(): GameState {
    if (this.gameOver) return this.getState()
    this.isPaused = !this.isPaused
    return this.getState()
  }

  public restart(): GameState {
    return this.start()
  }
}
