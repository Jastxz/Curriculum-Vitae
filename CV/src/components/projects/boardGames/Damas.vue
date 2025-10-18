<template>
  <div class="game">
    <h1>{{ $t('games.checkers') }}</h1>

    <div>
      <p class="status">{{ $t('games.turn') }}: {{ currentPlayer === 'red' ? $t('games.red') : $t('games.black') }}</p>
      <p v-if="winner" class="winner-text">{{ winner + ' ' + $t('games.win')}}</p>
    </div>

    <div class="board">
      <div
        v-for="(cell, index) in board"
        :key="index"
        class="cell"
        :class="{
          dark: isDarkCell(index),
          selected: selectedPiece === index,
          valid: validMoves.includes(index),
        }"
        @click="handleClick(index)"
      >
        <div v-if="cell" class="piece" :class="{ [cell.color]: true, king: cell.isKing }">
          <span v-if="cell.isKing">♔</span>
        </div>
      </div>
    </div>

    <div class="buttons">
      <button class="reset" @click="resetGame">{{ $t('games.newGame') }}</button>
      <button class="back" @click="emit('back')">{{ $t('games.back') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Color = 'red' | 'black'

interface Piece {
  color: Color
  isKing: boolean
}

type Cell = Piece | null

const emit = defineEmits<{
  back: []
}>()

const board = ref<Cell[]>([])
const currentPlayer = ref<Color>('red')
const selectedPiece = ref<number | null>(null)
const validMoves = ref<number[]>([])
const winner = ref<string | null>(null)
const mustCapture = ref<number[]>([])

const isDarkCell = (index: number): boolean => {
  const row = Math.floor(index / 8)
  const col = index % 8
  return (row + col) % 2 === 1
}

const initBoard = (): void => {
  board.value = Array(64).fill(null)

  for (let i = 0; i < 24; i++) {
    const row = i < 12 ? Math.floor(i / 4) : 5 + Math.floor((i - 12) / 4)
    const col = (row % 2 === 0 ? 0 : 1) + (i % 4) * 2
    board.value[row * 8 + col] = {
      color: i < 12 ? 'black' : 'red',
      isKing: false,
    }
  }
}

const getRow = (index: number): number => Math.floor(index / 8)
const getCol = (index: number): number => index % 8

const isValidPosition = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8
}

const getCaptureMoves = (index: number): number[] => {
  const piece = board.value[index]
  if (!piece) return []

  const moves: number[] = []
  const row = getRow(index)
  const col = getCol(index)
  const directions = piece.isKing
    ? [
        [-2, -2],
        [-2, 2],
        [2, -2],
        [2, 2],
      ]
    : piece.color === 'red'
      ? [
          [-2, -2],
          [-2, 2],
        ]
      : [
          [2, -2],
          [2, 2],
        ]

  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow
    const newCol = col + dCol
    const middleRow = row + dRow / 2
    const middleCol = col + dCol / 2

    if (isValidPosition(newRow, newCol) && isValidPosition(middleRow, middleCol)) {
      const targetIndex = newRow * 8 + newCol
      const middleIndex = middleRow * 8 + middleCol
      const middlePiece = board.value[middleIndex]

      if (!board.value[targetIndex] && middlePiece && middlePiece.color !== piece.color) {
        moves.push(targetIndex)
      }
    }
  }

  return moves
}

const getValidMoves = (index: number): number[] => {
  const piece = board.value[index]
  if (!piece || piece.color !== currentPlayer.value) return []

  const captures = getCaptureMoves(index)
  if (mustCapture.value.length > 0 && !mustCapture.value.includes(index)) return []
  if (captures.length > 0) return captures
  if (mustCapture.value.length > 0) return []

  const moves: number[] = []
  const row = getRow(index)
  const col = getCol(index)
  const directions = piece.isKing
    ? [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]
    : piece.color === 'red'
      ? [
          [-1, -1],
          [-1, 1],
        ]
      : [
          [1, -1],
          [1, 1],
        ]

  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow
    const newCol = col + dCol

    if (isValidPosition(newRow, newCol)) {
      const targetIndex = newRow * 8 + newCol
      if (!board.value[targetIndex]) {
        moves.push(targetIndex)
      }
    }
  }

  return moves
}

const checkForCaptures = (): void => {
  const captures: number[] = []
  board.value.forEach((piece, index) => {
    if (piece && piece.color === currentPlayer.value) {
      if (getCaptureMoves(index).length > 0) {
        captures.push(index)
      }
    }
  })
  mustCapture.value = captures
}

const movePiece = (from: number, to: number): void => {
  const piece = board.value[from]
  if (!piece) return

  board.value[to] = { ...piece }
  board.value[from] = null

  // Promover a rey
  const toRow = getRow(to)
  if ((piece.color === 'red' && toRow === 0) || (piece.color === 'black' && toRow === 7)) {
    board.value[to]!.isKing = true
  }

  // Captura
  const fromRow = getRow(from)
  const fromCol = getCol(from)
  const toRow2 = getRow(to)
  const toCol = getCol(to)

  if (Math.abs(toRow2 - fromRow) === 2) {
    const middleRow = (fromRow + toRow2) / 2
    const middleCol = (fromCol + toCol) / 2
    board.value[middleRow * 8 + middleCol] = null

    // Comprobar si puede seguir capturando
    const morCaptures = getCaptureMoves(to)
    if (morCaptures.length > 0) {
      selectedPiece.value = to
      validMoves.value = morCaptures
      mustCapture.value = [to]
      return
    }
  }

  checkWinner()
  currentPlayer.value = currentPlayer.value === 'red' ? 'black' : 'red'
  checkForCaptures()
  selectedPiece.value = null
  validMoves.value = []
}

const handleClick = (index: number): void => {
  if (winner.value) return

  if (selectedPiece.value === null) {
    const piece = board.value[index]
    if (piece && piece.color === currentPlayer.value) {
      const moves = getValidMoves(index)
      if (moves.length > 0) {
        selectedPiece.value = index
        validMoves.value = moves
      }
    }
  } else {
    if (validMoves.value.includes(index)) {
      movePiece(selectedPiece.value, index)
    } else {
      selectedPiece.value = null
      validMoves.value = []
    }
  }
}

const checkWinner = (): void => {
  const redPieces = board.value.filter((p) => p && p.color === 'red').length
  const blackPieces = board.value.filter((p) => p && p.color === 'black').length

  if (redPieces === 0) winner.value = 'Negras'
  if (blackPieces === 0) winner.value = 'Rojas'
}

const resetGame = (): void => {
  initBoard()
  currentPlayer.value = 'red'
  selectedPiece.value = null
  validMoves.value = []
  winner.value = null
  mustCapture.value = []
  checkForCaptures()
}

initBoard()
checkForCaptures()
</script>

<style scoped>
.game {
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  color: #333;
}

.status {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 5px 0;
}

.winner-text {
  font-size: 1.4rem;
  font-weight: bold;
  color: #4caf50;
  margin: 5px 0;
}

.board {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0;
  border: 2px solid #333;
  margin: 0 auto 2vh auto;
  aspect-ratio: 1;
  max-height: 50vh;
}

.cell {
  aspect-ratio: 1;
  background: #f0d9b5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.cell.dark {
  background: #b58863;
}

.cell.selected {
  background: #7fc97f;
  box-shadow: inset 0 0 0 3px #4caf50;
}

.cell.valid {
  background: #9fd6ff;
  cursor: pointer;
}

.cell.valid:hover {
  background: #6eb8f0;
}

.piece {
  width: 70%;
  height: 70%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(0, 0, 0, 0.2);
}

.piece.red {
  background: radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a);
}

.piece.black {
  background: radial-gradient(circle at 30% 30%, #495057, #212529);
  color: #ffd700;
}

.piece.king {
  border: 3px solid #ffd700;
}

.buttons {
  display: flex;
  gap: 10px;
}

.reset,
.back {
  flex: 1;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.reset {
  background: #2196f3;
}

.reset:hover {
  background: #1976d2;
}

.back {
  background: #757575;
}

.back:hover {
  background: #616161;
}
</style>
