<template>
  <div class="container">
    <div class="game-card">
      <!-- Menú Principal -->
      <div v-if="currentGame === 'menu'" class="menu">
        <h1 class="title">{{ $t('games.titleSimple') }}</h1>
        <div class="menu-buttons">
          <div class="difficulty-selector">
            <button
              v-for="level in niveles"
              :key="level.value"
              @click="dificultad = level.value"
              :class="{ active: dificultad === level.value }"
            >
              {{ level.label }}
            </button>
          </div>
          <button @click="currentGame = 'tictactoe'" class="menu-btn blue">
            {{ $t('games.ticTacToe') }}
          </button>
          <button @click="currentGame = 'cats'" class="menu-btn green">
            {{ $t('games.cats') }}
          </button>
          <button @click="currentGame = 'checkers'" class="menu-btn red">
            {{ $t('games.checkers') }}
          </button>
        </div>
      </div>

      <!-- 3 en Raya -->
      <div v-if="currentGame === 'tictactoe'">
        <TresEnRaya :dificultad="dificultad" @back="currentGame = 'menu'" />
      </div>

      <!-- Gatos -->
      <div v-if="currentGame === 'cats'">
        <Gatos :dificultad="dificultad" @back="currentGame = 'menu'" />
      </div>

      <!-- Damas -->
      <div v-if="currentGame === 'checkers'">
        <Damas :dificultad="dificultad" @back="currentGame = 'menu'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TresEnRaya from './boardGames/TresEnRaya.vue'
import Gatos from './boardGames/Gatos.vue'
import Damas from './boardGames/Damas.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type Game = 'menu' | 'tictactoe' | 'cats' | 'checkers'

// Estado general
const currentGame = ref<Game>('menu')
const dificultad = ref<number>(0)

//  Definición de niveles de dificultad
const niveles = [
  { value: 4, label: computed(() => t('games.random')) },
  { value: 0, label: computed(() => t('games.veryEasy')) },
  { value: 1, label: computed(() => t('games.easy')) },
  { value: 2, label: computed(() => t('games.medium')) },
  { value: 3, label: computed(() => t('games.hard')) },
  { value: -1, label: computed(() => t('games.neuralModel')) },
]
</script>

<style scoped>
.container {
  min-height: 25vh;
  max-height: 75vh;
  background: linear-gradient(135deg, #312e81 0%, #7e22ce 50%, #be185d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.game-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  padding: 1.2rem;
  max-width: 42rem;
  width: 100%;
  max-height: 71vh;
}

/* Menú */
.menu {
  text-align: center;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
}

.menu-buttons {
  display: grid;
  gap: 1rem;
}

.menu-btn {
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-btn:hover {
  transform: scale(1.05);
}

.menu-btn.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.menu-btn.blue:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.menu-btn.green {
  background: linear-gradient(135deg, #22c55d 0%, #16a34a 100%);
}

.menu-btn.green:hover {
  background: linear-gradient(135deg, #16a34a 0%, #16a34a 100%);
}

.menu-btn.red {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.menu-btn.red:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

.difficulty-selector {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.difficulty-selector button {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid #ccc;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.difficulty-selector button:hover {
  border-color: #666;
}

.difficulty-selector button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
</style>
