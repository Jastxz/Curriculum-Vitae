<template>
  <div class="game">
    <h1>{{ $t('games.checkers') }}</h1>

    <div class="controls-line">
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
        <div class="piece" :class="{ [piece.color]: true }">
          <!-- Cats vs Mouse has no Kings -->
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
  id: number
  key: string
}

type Cell = Piece | null

const props = defineProps({
  dificultad: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  back: []
}>()

// State
const board = ref<Cell[]>([])
const currentPlayer = ref<Color>('red') // Red = Mouse, Black = Cats
const selectedPiece = ref<number | null>(null)
const validMoves = ref<number[]>([])
const winner = ref<string | null>(null)
const userColor = ref<Color>('red')
const isLoading = ref(false)
const error = ref<string | null>(null)
const retryCount = ref(0)
const maxRetries = 3
const timeout = ref<number | null>(null)
const lastMoveTo = ref<number | null>(null)

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
      return 4 // Easy
    case 2:
      return 6 // Medium
    case 3:
      return 8 // Hard
    default:
      return 1
  }
}

const getRow = (index: number): number => Math.floor(index / 8)
const getCol = (index: number): number => index % 8

const isValidPosition = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8
}

const isWhiteCell = (index: number): boolean => {
  const row = Math.floor(index / 8)
  const col = index % 8
  return (row + col) % 2 === 0
}

const isDarkCell = (index: number): boolean => {
  return !isWhiteCell(index)
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

// Logic
const pieces = computed(() => {
  return board.value
    .map((cell, index) => {
      if (cell) return { ...cell, index }
      return null
    })
    .filter((p): p is Piece & { index: number } => p !== null)
})

const calculatePossibleMoves = (index: number): number[] => {
  const piece = board.value[index]
  if (!piece) return []

  const moves: number[] = []
  const row = getRow(index)
  const col = getCol(index)

  let directions: number[][] = []

  if (piece.color === 'red') {
    // Mouse: All diagonal directions
    directions = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ]
  } else {
    // Cats: Only forward (UP now, since they start at bottom)
    directions = [
      [-1, -1],
      [-1, 1],
    ]
  }

  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow
    const newCol = col + dCol

    if (isValidPosition(newRow, newCol)) {
      const targetIndex = newRow * 8 + newCol
      // Must be empty
      if (!board.value[targetIndex]) {
        moves.push(targetIndex)
      }
    }
  }

  return moves
}

const getValidMoves = (index: number): number[] => {
  const piece = board.value[index]
  if (!piece || piece.color !== currentPlayer.value) return []
  return calculatePossibleMoves(index)
}

const checkWinner = (): void => {
  // 1. Mouse (Red) wins if it reaches row 7 (Bottom)
  const mouseIndex = board.value.findIndex((p) => p && p.color === 'red')

  if (mouseIndex !== -1) {
    const mouseRow = getRow(mouseIndex)

    if (mouseRow === 7) {
      winner.value = 'Ratón (Rojas)'
      return
    }

    // 2. Mouse wins if it passes or reaches the same row as the LOWEST cat (highest row index)
    // Actually, "Passes" means Mouse is BELOW the Cats (higher row index).
    // Cats are moving UP (decreasing row). Mouse is moving DOWN (increasing row).
    // Mouse wins if mouseRow >= maxCatRow (Cats are above/behind Mouse).
    const catsRows = board.value
      .map((p, i) => (p && p.color === 'black' ? getRow(i) : -1))
      .filter((r) => r !== -1)

    if (catsRows.length > 0) {
      const maxCatRow = Math.max(...catsRows)
      if (mouseRow >= maxCatRow) {
        winner.value = 'Ratón (Rojas)'
        return
      }
    }

    // 3. Cats win if Mouse has NO moves
    if (calculatePossibleMoves(mouseIndex).length === 0) {
      winner.value = 'Gatos (Negras)'
      return
    }
  } else {
    // Should not happen
  }
}

const calculateAImove = async (isRetry = false) => {
  if (isLoading.value && !isRetry) return // Prevent multiple calls if already loading
  if (winner.value) return

  isLoading.value = true
  error.value = null
  if (!isRetry) {
    retryCount.value = 0
  }

  // 9 = Mouse (Red), 1 = Cats (Black)
  // Hay que enviar la marca y el turno invertidos ya que el API espera el turno de la IA y la marca del jugador
  const marca = currentPlayer.value === 'red' ? 1 : 9
  const turno = currentPlayer.value === 'red' ? 2 : 1

  const mousePiece = board.value.find((p) => p && p.color === 'red')
  const mouseIndex = mousePiece ? board.value.indexOf(mousePiece) : -1
  const indices = mouseIndex !== -1 ? [getRow(mouseIndex), getCol(mouseIndex)] : [0, 0]

  const mundoRequest = {
    data: to2D(
      board.value.map((cell, index) => {
        if (cell) return cell.id
        // In Gatos, played on WHITE cells. Dark cells are invalid (-1).
        return isDarkCell(index) ? -1 : 0
      }),
      8,
    ),
    posicionFila: indices[0],
    posicionColumna: indices[1],
    marca: marca,
    turno: turno,
    juego: 'gatos',
    dificultad: props.dificultad,
    profundidad: getDepth(props.dificultad),
  }

  try {
    const actualURL = window.location.href
    const endpoint = actualURL.includes('localhost')
      ? 'http://localhost:8080/v0/gatos'
      : 'https://microadversarial.javig.org/v0/gatos'

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
        idToKeyMap.set(p.id, p.key)
      }
    })

    board.value = to1D<number | null>(tableroResponse.data).map(
      (cell: number | null, index: number) => {
        if (!cell || cell === 0 || cell === -1) return null

        // Determine color based on ID
        // Cats: 1, 3, 5, 7
        // Mouse: 9
        let color: Color = 'black'
        if (cell === 9) {
          color = 'red'
        } else {
          color = 'black'
        }

        const key = idToKeyMap.get(cell) || `piece-ai-${index}-${Date.now()}`

        return { color, id: cell, key }
      },
    )

    lastMoveTo.value = tableroResponse.fila * 8 + tableroResponse.columna

    checkWinner()
    if (!winner.value) {
      currentPlayer.value = currentPlayer.value === 'red' ? 'black' : 'red'
    }

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
      clearTimeout(timeout.value)
      timeout.value = null
    }
    timeout.value = setTimeout(() => {
      error.value = null
    }, 5000)
  }
}

const movePiece = (from: number, to: number): void => {
  const piece = board.value[from]
  if (!piece) return

  board.value[to] = { ...piece }
  board.value[from] = null

  checkWinner()
  if (!winner.value) {
    currentPlayer.value = currentPlayer.value === 'red' ? 'black' : 'red'
  }

  selectedPiece.value = null
  validMoves.value = []
}

const handleClick = (index: number): void => {
  if (winner.value || isLoading.value) {
    return
  }

  if (currentPlayer.value !== userColor.value) {
    // It's AI's turn, do not allow human input
    return
  }

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
      if (!winner.value && currentPlayer.value !== userColor.value) {
        // If it's now AI's turn, trigger AI move
        calculateAImove()
      }
    } else {
      // Check if clicking another own piece
      const piece = board.value[index]
      if (piece && piece.color === currentPlayer.value) {
        const moves = getValidMoves(index)
        if (moves.length > 0) {
          selectedPiece.value = index
          validMoves.value = moves
          return
        }
      }

      selectedPiece.value = null
      validMoves.value = []
    }
  }
}

const initBoard = (): void => {
  board.value = Array(64).fill(null)

  // Invert Setup:
  // Cats (Black) - Start at Bottom (Row 7). Move UP.
  // Valid White indices in Row 7 (56-63): 57, 59, 61, 63 (Odd indices)
  const catIndices = [57, 59, 61, 63]
  catIndices.forEach((idx, i) => {
    board.value[idx] = {
      color: 'black',
      id: i * 2 + 1,
      key: `cat-${i}`,
    }
  })

  // Mouse (Red) - Start at Top (Row 0). Moves ALL.
  // Valid White indices in Row 0 (0-7): 0, 2, 4, 6 (Even indices)
  board.value[2] = {
    color: 'red',
    id: 9,
    key: `mouse-1`,
  }
}

const resetGame = (): void => {
  initBoard()
  currentPlayer.value = 'red'
  selectedPiece.value = null
  validMoves.value = []
  winner.value = null
  lastMoveTo.value = null
  isLoading.value = false
  error.value = null
  retryCount.value = 0
  if (timeout.value) {
    clearTimeout(timeout.value)
    timeout.value = null
  }

  if (userColor.value === 'black') {
    calculateAImove()
  }
}

const retryAImove = () => {
  calculateAImove(true)
}

const closeError = () => {
  error.value = null
  if (timeout.value) {
    clearTimeout(timeout.value)
    timeout.value = null
  }
}

// Initialize
initBoard()
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

.controls-line {
  display: inline-flex;
}

.controls {
  margin: 10px 0;
}

.controls select {
  padding: 1px;
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
