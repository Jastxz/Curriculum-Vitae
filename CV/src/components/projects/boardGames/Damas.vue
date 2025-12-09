<template>
  <div class="game">
    <h1>{{ $t('games.checkers') }}</h1>

    <div>
      <p class="status">
        {{ $t('games.turn') }}: {{ currentPlayer === 'red' ? $t('games.red') : $t('games.black') }}
      </p>
      <p v-if="winner" class="winner-text">{{ winner + ' ' + $t('games.win') }}</p>

      <div class="controls" v-if="!winner">
        <label>{{ $t('games.chooseSide') }}: </label>
        <select v-model="userColor" @change="resetGame" :disabled="isLoading">
          <option value="red">{{ $t('games.red') }}</option>
          <option value="black">{{ $t('games.black') }}</option>
        </select>
      </div>
    </div>

    <div class="board">
      <!-- Cells grid for background and interaction -->
      <div
        v-for="(cell, index) in 64"
        :key="index"
        class="cell"
        :class="{
          dark: isDarkCell(index),
          selected: selectedPiece === index,
          valid: validMoves.includes(index),
        }"
        @click="handleClick(index)"
      >
        <!-- Coordinates debugging triggers could go here -->
      </div>

      <!-- Pieces Overlay -->
      <div
        v-for="piece in pieces"
        :key="piece.key"
        class="piece-container"
        :style="getPieceStyle(piece.index)"
      >
        <div class="piece" :class="{ [piece.color]: true, king: piece.isKing }">
          <span v-if="piece.isKing">♔</span>
        </div>
      </div>

      <div v-if="isLoading" class="loading-overlay">
        <span class="loading-spinner">{{ $t('games.calculating') }}</span>
      </div>
    </div>

    <div class="buttons">
      <button class="reset" @click="resetGame" :disabled="isLoading">
        {{ $t('games.newGame') }}
      </button>
      <button class="back" @click="emit('back')">{{ $t('games.back') }}</button>
    </div>
  </div>

  <!-- Error -->
  <div v-if="error" class="error-message">
    <h3>{{ $t('connectionError.error') }}</h3>
    <p>{{ error }}</p>
    <div v-if="currentPlayer !== userColor" class="error-actions">
      <button @click="retryAImove" class="retry-btn">{{ $t('connectionError.retry') }}</button>
    </div>
    <button @click="closeError" class="close-btn">×</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type Color = 'red' | 'black'

interface Piece {
  color: Color
  isKing: boolean
  id: number
  key: string
}

type Cell = Piece | null

// IDs from FuncionesDamas.java
const whiteIDs = [51, 53, 55, 57, 60, 62, 64, 66, 71, 73, 75, 77]
const blackIDs = [1, 2, 4, 6, 11, 13, 15, 17, 20, 22, 24, 26]

const props = defineProps({
  dificultad: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  back: []
}>()

const board = ref<Cell[]>([])
const currentPlayer = ref<Color>('red')
const selectedPiece = ref<number | null>(null)
const validMoves = ref<number[]>([])
const winner = ref<string | null>(null)
const mustCapture = ref<number[]>([])
const userColor = ref<Color>('red')
const isLoading = ref(false)
const error = ref<string | null>(null)
const timeout = ref<number | null>(null)
const lastMoveTo = ref<number>(0)

const pieces = computed(() => {
  return board.value
    .map((cell, index) => {
      if (cell) return { ...cell, index }
      return null
    })
    .filter((p): p is Piece & { index: number } => p !== null)
})

const isDarkCell = (index: number): boolean => {
  const row = Math.floor(index / 8)
  const col = index % 8
  return (row + col) % 2 === 1
}

const initBoard = (): void => {
  board.value = Array(64).fill(null)

  let blackCount = 0
  let whiteCount = 0

  for (let i = 0; i < 24; i++) {
    const row = i < 12 ? Math.floor(i / 4) : 5 + Math.floor((i - 12) / 4)
    const col = (row % 2 === 0 ? 0 : 1) + (i % 4) * 2

    const isBlack = i < 12
    board.value[row * 8 + col] = {
      color: isBlack ? 'black' : 'red',
      isKing: false,
      id: isBlack ? blackIDs[blackCount++] : whiteIDs[whiteCount++],
      key: `piece-${i}`, // Unique stable key
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
    if (!piece.isKing) {
      board.value[to]!.isKing = true
      board.value[to]!.id += 100
    }
  }

  // Captura
  const fromRow = getRow(from)
  const fromCol = getCol(from)
  const toRow2 = getRow(to)
  const toCol = getCol(to)

  lastMoveTo.value = to

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

  if (!winner.value && currentPlayer.value !== userColor.value) {
    calculateAImove()
  }
}

const handleClick = (index: number): void => {
  if (winner.value || isLoading.value || currentPlayer.value !== userColor.value) return

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

  if (userColor.value === 'black') {
    calculateAImove()
  }
}

const retryCount = ref(0)
const maxRetries = 3

const calculateAImove = async (isRetry = false) => {
  if (!isRetry) {
    retryCount.value = 0
    isLoading.value = true
  }

  error.value = null

  const indices = [getRow(lastMoveTo.value), getCol(lastMoveTo.value)]

  // 1 = Blancas (Red), 2 = Negras (Black)
  const marca = currentPlayer.value === 'red' ? 2 : 1
  const turno = currentPlayer.value === 'red' ? 1 : 2

  const mundoRequest = {
    data: to2D(
      board.value.map((cell, index) => {
        if (cell) return cell.id
        return isDarkCell(index) ? -1 : 0
      }),
      8,
    ),
    posicionFila: indices[0],
    posicionColumna: indices[1],
    marca: marca,
    turno: turno,
    juego: 'damas',
    dificultad: props.dificultad,
    profundidad: getDepth(props.dificultad),
  }

  try {
    const actualURL = window.location.href
    const endpoint = actualURL.includes('localhost')
      ? 'http://localhost:8080/v0/damas'
      : 'https://microadversarial.javig.org/v0/damas'

    // Use AbortController for timeout if needed, but simple fetch is fine for now
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mundoRequest),
    })

    if (!response.ok) {
      if (response.status === 429 || response.status >= 500) {
        throw new Error('Retryable error')
      }

      const errorData = await response.json().catch(() => ({}))
      switch (response.status) {
        case 400:
          throw new Error(errorData.message || t('connectionError.badRequest'))
        default:
          throw new Error(`${t('connectionError.httpError')} ${response.status}`)
      }
    }

    const tableroResponse = await response.json()

    // Map of ID to existing Key to preserve identity
    const idToKeyMap = new Map<number, string>()
    board.value.forEach((p) => {
      if (p) {
        // Handle ID change logic if any, but since we use stable IDs from backend:
        // Or if ID changes (king), we might lose it?
        // King ID = ID + 100. Base ID = ID % 100 roughly.
        // Actually, we should map based on Base ID.
        const baseId = p.id > 100 ? p.id - 100 : p.id
        idToKeyMap.set(baseId, p.key)
      }
    })

    board.value = to1D<number | null>(tableroResponse.data).map(
      (cell: number | null, index: number) => {
        if (!cell || cell === 0 || cell === -1) return null

        const isKing = cell >= 100
        const baseId = isKing ? cell - 100 : cell

        let color: Color = 'red' // Default
        if (whiteIDs.includes(baseId)) {
          color = 'red'
        } else if (blackIDs.includes(baseId)) {
          color = 'black'
        }

        const key = idToKeyMap.get(baseId) || `piece-ai-${index}-${Date.now()}` // Fallback key

        return { color, isKing, id: cell, key }
      },
    )

    lastMoveTo.value = tableroResponse.fila * 8 + tableroResponse.columna

    currentPlayer.value = currentPlayer.value === 'red' ? 'black' : 'red'
    checkWinner()
    checkForCaptures()
    isLoading.value = false
  } catch (err) {
    // Retry logic
    if (retryCount.value < maxRetries) {
      retryCount.value++
      // Keep isLoading true
      setTimeout(() => {
        calculateAImove(true)
      }, 3000)
      return
    }

    isLoading.value = false
    if (err instanceof Error && err.message === 'Retryable error') {
      error.value = t('connectionError.tooManyRequests') // Generic message for exhausted retries
    } else if (err instanceof TypeError && err.message.includes('fetch')) {
      error.value = t('connectionError.connectionError')
    } else if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = t('connectionError.unknownError')
    }

    // Clear error after 5s
    if (timeout.value) {
      timeout.value = null
    }
    timeout.value = setTimeout(() => {
      error.value = null
    }, 5000)
  }
}

const retryAImove = () => {
  calculateAImove(true)
}

const closeError = () => {
  error.value = null
  if (timeout.value) {
    timeout.value = null
  }
}

// Helpers
const to2D = <T,>(arr: T[], cols: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / cols) }, (_, row) =>
    arr.slice(row * cols, row * cols + cols),
  )
}

const to1D = <T,>(arr: T[][]): T[] => arr.flat()

const getDepth = (difficulty: number): number => {
  switch (difficulty) {
    case 0:
      return 2 // Lowest
    case 1:
      return 3 // Easy
    case 2:
      return 4 // Medium
    case 3:
      return 5 // Hard
    default:
      return 1
  }
}

const getPieceStyle = (index: number) => {
  const row = Math.floor(index / 8)
  const col = index % 8
  return {
    top: `${row * 12.5}%`,
    left: `${col * 12.5}%`,
    width: '12.5%',
    height: '12.5%',
  }
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
  position: relative; /* Essential for absolute positioning of pieces */
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

/* Container moves the piece on the board */
.piece-container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.7s ease; /* Animation magic */
  pointer-events: none; /* Let clicks pass through to the cell */
}

/* Piece visual style */
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

.controls {
  margin: 10px 0;
}

.controls select {
  padding: 5px;
  font-size: 1rem;
  border-radius: 4px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-spinner {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2196f3;
}

.error-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 100;
  text-align: center;
  border: 1px solid #dc3545;
}

.error-message h3 {
  color: #dc3545;
  margin-top: 0;
}

.error-actions {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.retry-btn {
  background: #2196f3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.retry-btn:hover {
  background: #1976d2;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}
</style>
