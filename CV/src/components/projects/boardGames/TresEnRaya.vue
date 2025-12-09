<template>
  <div class="game">
    <h1>{{ $t('games.ticTacToe') }}</h1>
    
    <div class="board">
      <button
        v-for="(cell, index) in board"
        :key="index"
        class="cell"
        :class="{ winner: winningLine?.includes(index) }"
        @click="makeMove(index)"
        :disabled="cell !== null || winner !== null"
      >
        {{ cell }}
      </button>
      <span v-if="isLoading" class="loading-spinner">{{ $t('games.calculating') }}</span>
    </div>

    <div class="info">
      <p v-if="winner" class="status">
        {{ winner === 'Empate' ? $t('games.draw') : $t('games.winner') + `: ${winner}` }}
      </p>
      <p v-else class="status">{{ $t('games.turn') }}: {{ currentPlayer }}</p>
      
      <div class="buttons">
        <button class="reset" @click="resetGame">{{ $t('games.newGame') }}</button>
        <button class="back" @click="emit('back')">{{ $t('games.back') }}</button>
      </div>
    </div>
  </div>
  <!-- Error -->
  <div v-if="error" class="error-message">
    <h3>{{ $t('connectionError.error') }}</h3>
    <p>{{ error }}</p>
    <button @click="closeError" class="close-btn">×</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

type Player = 'X' | 'O'
type Cell = Player | null

const props = defineProps({
  dificultad: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  back: []
}>()

const board = ref<Cell[]>(Array(9).fill(null))
const memoryIndex = ref<number>(0)
const currentPlayer = ref<Player>('X')
const winner = ref<Player | 'Empate' | null>(null)
const winningLine = ref<number[] | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const timeout = ref<number | null>(null)

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
  [0, 4, 8], [2, 4, 6]             // diagonales
]

const checkWinner = (): void => {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern
    if (board.value[a] && 
        board.value[a] === board.value[b] && 
        board.value[a] === board.value[c]) {
      winner.value = board.value[a]
      winningLine.value = pattern
      return
    }
  }
  
  if (board.value.every(cell => cell !== null)) {
    winner.value = 'Empate'
  }
}

const makeMove = (index: number): void => {
  if (board.value[index] || winner.value) return
  
  board.value[index] = currentPlayer.value
  checkWinner()
  
  if (!winner.value) {
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
    memoryIndex.value = index
    calculateAImove()
  }
}

// Llamada a la API de cálculo de movimiento
const calculateAImove = async () => {
  
  isLoading.value = true
  error.value = null
  const indices = indexTo2D(memoryIndex.value, 3)
  const mundoRequest = { 
        data: to2D(board.value.map(cell => {
          if (cell === 'X') return 1
          if (cell === 'O') return 2
          return 0
        }), 3),
        posicionFila: indices[0],
        posicionColumna: indices[1],
        marca: currentPlayer.value === 'X' ? 2 : 1,
        turno: 2,
        dificultad: props.dificultad,
        profundidad: props.dificultad > 1 ? 9 : 1,
      }

  try {
    // API base URL - ajustada según configuración
    const actualURL = window.location.href
    const endpoint = actualURL.includes('localhost') ? 'http://localhost:8080/v0/tresenraya' : 'https://microadversarial.javig.org/v0/tresenraya'
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mundoRequest),
    })

    if (!response.ok) {
      // Crear errores específicos según el status
      const errorData = await response.json().catch(() => ({}))
      // Limpia timeout anterior si existe
      if (timeout.value) {timeout.value = null}
      
      timeout.value = setTimeout(() => {
        error.value = null
      }, 5000)

      switch (response.status) {
        case 400:
          throw new Error(errorData.message || t('connectionError.badRequest'))
        case 429:
          throw new Error(t('connectionError.tooManyRequests'))
        case 500:
          throw new Error(t('connectionError.serverError'))
        case 503:
          throw new Error(t('connectionError.serviceUnavailable'))
        default:
          throw new Error(`${t('connectionError.httpError')} ${response.status}`)
      }
    }

    const tableroResponse = await response.json()

    board.value = to1D<number | null>(tableroResponse.data).map((cell: number | null) => {
      if (cell === 1) return 'X'
      if (cell === 2) return 'O'
      return null
    })
    memoryIndex.value = coordsTo1D(
      tableroResponse.fila,
      tableroResponse.columna,
      3
    )
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
    checkWinner()
    
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      error.value = t('connectionError.connectionError')
    } else if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = t('connectionError.unknownError')
    }
  } finally {
    isLoading.value = false
  }
}

const resetGame = (): void => {
  board.value = Array(9).fill(null)
  currentPlayer.value = 'X'
  winner.value = null
  winningLine.value = null
}

// 1D a 2D
const to2D = <T>(arr: T[], cols: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / cols) }, (_, row) =>
    arr.slice(row * cols, row * cols + cols)
  )
}

// 2D a 1D
const to1D = <T>(arr: T[][]): T[] => arr.flat()

// Índice 1D a coordenadas 2D
const indexTo2D = (index: number, cols: number): [number, number] => {
  return [Math.floor(index / cols), index % cols]
}

// Coordenadas 2D a índice 1D
const coordsTo1D = (row: number, col: number, cols: number): number => {
  return row * cols + col
}

const closeError = () => {
  error.value = null
  if (timeout.value) {timeout.value = null}
}
</script>

<style scoped>
.game {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.cell {
  aspect-ratio: 1;
  font-size: 2rem;
  font-weight: bold;
  background: #f0f0f0;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.cell:hover:not(:disabled) {
  background: #e0e0e0;
  transform: scale(1.05);
}

.cell:disabled {
  cursor: not-allowed;
}

.cell.winner {
  background: #4caf50;
  color: white;
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.buttons {
  display: flex;
  gap: 10px;
}

.status {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.reset, .back {
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

.error-message {
  color: #dc3545;
  text-align: center;
}

.close-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
  color: #c00;
}
</style>