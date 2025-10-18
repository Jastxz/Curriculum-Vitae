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
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Player = 'X' | 'O'
type Cell = Player | null

const emit = defineEmits<{
  back: []
}>()

const board = ref<Cell[]>(Array(9).fill(null))
const currentPlayer = ref<Player>('X')
const winner = ref<Player | 'Empate' | null>(null)
const winningLine = ref<number[] | null>(null)

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
  }
}

const resetGame = (): void => {
  board.value = Array(9).fill(null)
  currentPlayer.value = 'X'
  winner.value = null
  winningLine.value = null
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
</style>