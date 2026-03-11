// 方块形状定义
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'

export interface Position {
  x: number
  y: number
}

export interface Tetromino {
  type: TetrominoType
  shape: number[][]
  position: Position
  color: string
}

export type Board = (string | null)[][]

export interface GameState {
  board: Board
  currentTetromino: Tetromino | null
  nextTetromino: Tetromino | null
  score: number
  lines: number
  level: number
  gameOver: boolean
  isPaused: boolean
}
