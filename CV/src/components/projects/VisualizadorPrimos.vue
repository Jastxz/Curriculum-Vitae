<template>
  <div class="visualizador-container">
    <!-- Tabs para alternar entre funcionalidades -->
    <div class="tabs-container">
      <button
        @click="chooseTab('polar')"
        :class="['tab-button', { active: activeTab === 'polar' }]"
      >
        {{ $t('primeTools.polarTab') }}
      </button>
      <button @click="chooseTab('diff')" :class="['tab-button', { active: activeTab === 'diff' }]">
        {{ $t('primeTools.diffTab') }}
      </button>
    </div>

    <!-- Contenido principal -->
    <div class="main-content">
      <!-- Input section -->
      <div class="input-section">
        <label for="numberInput" class="input-label">
          {{
            activeTab === 'polar'
              ? $t('primeTools.polarInputLabel')
              : $t('primeTools.diffInputLabel')
          }}
        </label>
        <div class="input-group">
          <input
            id="numberInput"
            v-model.number="inputNumber"
            type="number"
            min="1"
            max="10000"
            :placeholder="$t('primeTools.inputPlaceholder')"
            class="number-input"
            @keyup.enter="calculateResults"
          />
          <button
            @click="calculateResults"
            :disabled="isLoading || !inputNumber || inputNumber <= 0"
            class="calculate-button"
          >
            <span v-if="!isLoading">{{ $t('primeTools.calculate') }}</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </div>
      </div>

      <!-- Resultados -->
      <div v-if="results || error" class="results-section">
        <!-- Error -->
        <div v-if="error" class="error-message">
          <h3>{{ $t('primeTools.error') }}</h3>
          <p>{{ error }}</p>
          <button @click="clearResults" class="clear-button">
            {{ $t('primeTools.clear') }}
          </button>
        </div>

        <!-- Resultados de coordenadas polares -->
        <div v-else-if="results && activeTab === 'polar'" class="polar-results">
          <h3>{{ $t('primeTools.polarResults') }}</h3>

          <!-- Controles del gráfico -->
          <div class="chart-controls">
            <div class="control-group">
              <span class="control-label">{{ $t('primeTools.controls') }}:</span>
              <div class="control-items">
                <span class="control-item">🔍 {{ $t('primeTools.wheelZoom') }}</span>
                <span class="control-item">⬆️⬇️ {{ $t('primeTools.arrowsGrid') }}</span>
                <span class="control-item">R {{ $t('primeTools.reset') }}</span>
              </div>
            </div>
            <div class="chart-info">
              <span>{{ $t('primeTools.zoom') }}: {{ chartState.zoom.toFixed(1) }}x</span>
              <span>{{ $t('primeTools.gridSize') }}: {{ chartState.mapSize }}</span>
            </div>
          </div>

          <div class="chart-container">
            <canvas ref="polarChart" class="interactive-chart"></canvas>
          </div>

          <div class="data-preview">
            <h4>
              {{ $t('primeTools.dataPreview') }} ({{ results.length }}
              {{ $t('primeTools.points') }}):
            </h4>
            <div class="coordinates-list">
              <div v-for="(point, index) in calcPoints" :key="index" class="coordinate-item">
                ({{ point.axisX.toFixed(3) }}, {{ point.axisY.toFixed(3) }})
              </div>
              <div v-if="results.length > 10" class="more-items">
                ...{{ $t('primeTools.andMore', { count: results.length - 10 }) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Resultados de diferencias -->
        <div v-else-if="results && activeTab === 'diff'" class="diff-results">
          <h3>{{ $t('primeTools.primes') }}</h3>
          <p class="result-message">{{ primosMessage }}</p>

          <!-- Tabla de datos -->
          <Tabla
            :data="tableData"
            :columns="tableColumns"
            :bordered="true"
            :striped="true"
            :hoverable="true"
            :searchable="true"
            :search-placeholder="$t('primeTools.searchPlaceholder')"
            :paginated="true"
            :page-size="15"
            :max-height="true"
            key-field="index"
          >
            <template #cell-prime="{ value }">
              <span class="prime-number">{{ value }}</span>
            </template>
            <template #cell-difference="{ value }">
              <span class="diff-number">{{ value === null ? '-' : value }}</span>
            </template>
          </Tabla>
        </div>

        <button @click="clearResults" class="clear-button">
          {{ $t('primeTools.clear') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import Tabla from '../tools/Tabla.vue'

const { t } = useI18n()

// Estado
let activeTab = ref<string>('polar')
const inputNumber = ref<number | null>(null)
const isLoading = ref(false)
const results = ref<any>(null)
const error = ref<string | null>(null)
const polarChart = ref<HTMLCanvasElement | null>(null)

// API base URL - ajustada según configuración
const actualURL = window.location.href
const API_BASE_URL = actualURL === 'http://localhost:5173/' ? 'http://localhost:8080' : 'https://microprime.javig.org'

// Variable para guardar la función cleanup
let canvasCleanup: (() => void) | undefined = undefined

// Registrar el lifecycle hook sincrónamente
onBeforeUnmount(() => {
  canvasCleanup?.()
})

const chooseTab = (tab: string) => {
  activeTab.value = tab
  calculateResults()
}

// Configuración de tabla para diferencias
const tableColumns = computed(() => [
  {
    key: 'difference',
    label: t('primeTools.difference'),
    align: 'right' as const,
    sortable: true,
    cellClass: 'diff-number',
  },
  {
    key: 'repetition',
    label: t('primeTools.repetitions'),
    align: 'right' as const,
    sortable: true,
    cellClass: 'prime-number',
  },
])

const tableData = computed(() => {
  if (!results.value || activeTab.value !== 'diff') return []

  const data = []
  const nums = results.value.mensaje.split(';').filter((x: string) => x)

  for (let i = 0; i < nums.length; i++) {
    const actualDiff = nums[i].split(':')
    data.push({
      difference: Number(actualDiff[0]),
      repetition: Number(actualDiff[1]),
    })
  }

  return data
})

const primosMessage = computed(() => {
  if (!results.value || activeTab.value !== 'diff') return []

  let message = ''
  const primes = results.value.primos

  for (let i = 0; i < primes.length; i++) {
    if (i === primes.length - 1) {
      message += primes[i]
    } else {
      message += primes[i] + ', '
    }
  }
  return message
})

const calcPoints = computed(() => {
  if (!results.value || activeTab.value !== 'polar') return []
  let puntos = results.value
  return puntos.slice(0, 10)
})

// Función para realizar cálculos
const calculateResults = async () => {
  if (!inputNumber.value || inputNumber.value <= 0) return

  isLoading.value = true
  error.value = null
  results.value = null

  try {
    const endpoint = activeTab.value === 'polar' ? '/v0/polar' : '/v0/diff'
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ number: inputNumber.value }),
    })

    if (!response.ok) {
      // Crear errores específicos según el status
      const errorData = await response.json().catch(() => ({}))

      switch (response.status) {
        case 400:
          throw new Error(errorData.message || t('primeTools.badRequest'))
        case 429:
          throw new Error(t('primeTools.tooManyRequests'))
        case 500:
          throw new Error(t('primeTools.serverError'))
        case 503:
          throw new Error(t('primeTools.serviceUnavailable'))
        default:
          throw new Error(`${t('primeTools.httpError')} ${response.status}`)
      }
    }

    const data = await response.json()

    // Si es polar, dibujar el gráfico
    if (activeTab.value === 'polar') {
      const points = cartesianPoints(data.puntos)
      results.value = points
      await nextTick()
      drawPolarChart(points)
      // Configurar eventos solo una vez
      if (!polarChart.value?.hasAttribute('data-events-setup')) {
        canvasCleanup = setupCanvasEvents()
        polarChart.value?.setAttribute('data-events-setup', 'true')
      }
    } else {
      results.value = data
    }
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      error.value = t('primeTools.connectionError')
    } else if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = t('primeTools.unknownError')
    }
  } finally {
    isLoading.value = false
  }
}

// Estado para el gráfico
const chartState = ref({
  scale: 20.0,
  mapSize: 20,
  offsetX: 0,
  offsetY: 0,
  zoom: 1.0,
  isDragging: false,
  lastMouseX: 0,
  lastMouseY: 0,
})

// Puntos cartesianos
const cartesianPoints = (data: Array<{ axisX: number; axisY: number }>) => {
  let points = []

  for (let i = 0; i < data.length; i++) {
    points.push(toCartesian(data[i]))
  }
  return points
}

// Función para dibujar el gráfico polar mejorado
const drawPolarChart = (data: Array<{ axisX: number; axisY: number }>) => {
  if (!polarChart.value) return

  const canvas = polarChart.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Configurar canvas para alta resolución
  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  // Limpiar canvas
  ctx.clearRect(0, 0, rect.width, rect.height)

  // Actualizar offsets para centrar
  chartState.value.offsetX = centerX
  chartState.value.offsetY = centerY

  // Calcular tamaño efectivo de celda
  const cellSize = chartState.value.scale * chartState.value.zoom

  // Dibujar la cuadrícula
  drawGrid(ctx, rect.width, rect.height, cellSize)

  // Dibujar ejes principales
  drawMainAxes(ctx, rect.width, rect.height, cellSize)

  // Dibujar los puntos
  drawPoints(ctx, data, cellSize)
}

// Función para dibujar la cuadrícula
const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize: number,
) => {
  ctx.strokeStyle = 'rgba(100, 100, 100, 0.4)'
  ctx.lineWidth = 1

  const mapSize = chartState.value.mapSize
  const offsetX = chartState.value.offsetX
  const offsetY = chartState.value.offsetY

  // Líneas verticales y horizontales
  for (let i = -mapSize; i <= mapSize; i++) {
    const pos = i * cellSize

    // Líneas verticales
    ctx.beginPath()
    ctx.moveTo(pos + offsetX, offsetY - mapSize * cellSize)
    ctx.lineTo(pos + offsetX, offsetY + mapSize * cellSize)
    ctx.stroke()

    // Líneas horizontales
    ctx.beginPath()
    ctx.moveTo(offsetX - mapSize * cellSize, -pos + offsetY)
    ctx.lineTo(offsetX + mapSize * cellSize, -pos + offsetY)
    ctx.stroke()
  }
}

// Función para dibujar los ejes principales
const drawMainAxes = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize: number,
) => {
  ctx.strokeStyle = 'rgba(200, 200, 200, 1)'
  ctx.lineWidth = 2

  const mapSize = chartState.value.mapSize
  const offsetX = chartState.value.offsetX
  const offsetY = chartState.value.offsetY

  // Eje X
  ctx.beginPath()
  ctx.moveTo(offsetX - mapSize * cellSize, offsetY)
  ctx.lineTo(offsetX + mapSize * cellSize, offsetY)
  ctx.stroke()

  // Eje Y
  ctx.beginPath()
  ctx.moveTo(offsetX, offsetY - mapSize * cellSize)
  ctx.lineTo(offsetX, offsetY + mapSize * cellSize)
  ctx.stroke()

  // Etiquetas de los ejes
  ctx.fillStyle = 'rgba(150, 150, 150, 1)'
  ctx.font = '12px monospace'
  ctx.textAlign = 'center'

  // Números en eje X
  for (let i = -mapSize; i <= mapSize; i += 5) {
    if (i === 0) continue
    const x = i * cellSize + offsetX
    ctx.fillText(i.toString(), x, offsetY + 15)
  }

  // Números en eje Y
  ctx.textAlign = 'right'
  for (let i = -mapSize; i <= mapSize; i += 5) {
    if (i === 0) continue
    const y = -i * cellSize + offsetY
    ctx.fillText(i.toString(), offsetX - 10, y + 4)
  }

  // Origen
  ctx.textAlign = 'center'
  ctx.fillText('0', offsetX - 15, offsetY + 15)
}

// Función para dibujar los puntos
const drawPoints = (
  ctx: CanvasRenderingContext2D,
  data: Array<{ axisX: number; axisY: number }>,
  cellSize: number,
) => {
  ctx.fillStyle = 'rgba(255, 0, 0, 1)'
  const offsetX = chartState.value.offsetX
  const offsetY = chartState.value.offsetY
  const pointSize = Math.max(3, 8 * chartState.value.zoom)

  for (let i = 0; i < data.length; i++) {
    const point = data[i]
    const x = point.axisX * cellSize + offsetX
    const y = -point.axisY * cellSize + offsetY // Invertir Y para que crezca hacia arriba

    ctx.beginPath()
    ctx.arc(x, y, pointSize, 0, 2 * Math.PI)
    ctx.fill()
  }
}

const toCartesian = (p: { axisX: number; axisY: number }) => {
  const x = p.axisX * Math.cos(p.axisY)
  const y = p.axisX * Math.sin(p.axisY)
  const point = {
    axisX: x,
    axisY: y,
  }
  return point
}

// Configurar eventos del canvas
const setupCanvasEvents = () => {
  if (!polarChart.value) {
    return
  }
  
  const canvas = polarChart.value

  // Evento de rueda para zoom
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()

    const zoomFactor = 1.1
    if (e.deltaY > 0) {
      chartState.value.mapSize = Math.max(chartState.value.mapSize - 1, 5)
      chartState.value.zoom = Math.max(chartState.value.zoom / zoomFactor, 0.00001)
    } else {
      chartState.value.mapSize = Math.min(chartState.value.mapSize + 1, 50)
      chartState.value.zoom = Math.min(chartState.value.zoom * zoomFactor, 1.0)
    }

    // Redibujar
    if (results.value && activeTab.value === 'polar') {
      drawPolarChart(results.value)
    }
  }

  // Eventos de teclado para ajustar el tamaño del mapa
  const handleKeyDown = (e: KeyboardEvent) => {
    let needsRedraw = false

    const zoomFactor = 1.1
    if (e.key === 'ArrowUp' || e.key === '+') {
      chartState.value.mapSize = Math.min(chartState.value.mapSize + 1, 50)
      chartState.value.zoom = Math.min(chartState.value.zoom * zoomFactor, 1.0)
      needsRedraw = true
    } else if (e.key === 'ArrowDown' || e.key === '-') {
      chartState.value.mapSize = Math.max(chartState.value.mapSize - 1, 5)
      chartState.value.zoom = Math.max(chartState.value.zoom / zoomFactor, 0.00001)
      needsRedraw = true
    } else if (e.key === 'r' || e.key === 'R') {
      // Reset zoom y mapSize
      chartState.value.zoom = 1.0
      chartState.value.mapSize = 20
      needsRedraw = true
    }

    if (needsRedraw && results.value && activeTab.value === 'polar') {
      drawPolarChart(results.value)
    }
  }

  // Agregar event listeners
  canvas.addEventListener('wheel', handleWheel, { passive: false })
  document.addEventListener('keydown', handleKeyDown)

  // Cleanup function
  return () => {
    canvas.removeEventListener('wheel', handleWheel)
    document.removeEventListener('keydown', handleKeyDown)
  }
}

// Limpiar resultados
const clearResults = () => {
  results.value = null
  error.value = null
}
</script>

<style scoped>
.visualizador-container {
  color: var(--color-text);
}

.header-section {
  margin-bottom: 2rem;
}

.close-button {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: var(--color-secondary);
}

.project-title {
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.project-description {
  color: var(--color-text-weak);
  font-size: 1.1rem;
}

.tabs-container {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--bordeado-palido);
}

.tab-button {
  background: none;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  color: var(--color-text-weak);
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: var(--color-text);
}

.tab-button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.input-section {
  margin-bottom: 2rem;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-text);
}

.input-group {
  display: flex;
  gap: 1rem;
}

.number-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid var(--bordeado-palido);
  border-radius: 4px;
  font-size: 1rem;
  background: var(--color-background);
  color: var(--color-text);
}

.number-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.calculate-button {
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-width: 120px;
}

.calculate-button:hover:not(:disabled) {
  background: var(--color-secondary);
}

.calculate-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.results-section {
  border: 2px solid var(--bordeado-palido);
  border-radius: 8px;
  padding: 1.5rem;
}

.error-message {
  color: #dc3545;
  text-align: center;
}

.chart-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 2px solid var(--bordeado-palido);
}

.interactive-chart {
  border: 1px solid var(--bordeado-palido);
  border-radius: 4px;
  cursor: crosshair;
  width: 600px;
  height: 600px;
  max-width: 100%;
  max-height: 60vh;
}

.chart-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
  border-style: groove;
  border-color: var(--color-text);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-label {
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.9rem;
}

.control-items {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.control-item {
  font-size: 0.8rem;
  color: var(--color-text-weak);
  background: var(--color-background);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
}

.chart-info {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--color-text-weak);
  font-family: monospace;
}

.chart-info span {
  background: var(--color-background);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.data-preview,
.data-sections {
  margin-top: 1.5rem;
}

.data-section {
  margin-bottom: 1.5rem;
}

.coordinates-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.coordinate-item {
  background: var(--color-background);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
}

.prime-number {
  color: var(--color-text);
  font-weight: 600;
}

.diff-number {
  color: var(--color-text);
  font-weight: 500;
}

.position-number {
  color: var(--color-text-weak);
  font-size: 0.9rem;
}

.more-items {
  color: var(--color-text-weak);
  font-style: italic;
}

.result-message {
  background: var(--color-background);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid var(--color-primary);
}

.clear-button {
  background: var(--color-secondary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.clear-button:hover {
  background: var(--naranja-suave);
}

/* Responsive */
@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
  }

  .tabs-container {
    flex-direction: column;
  }

  .tab-button {
    padding: 0.75rem 1rem;
  }

  .chart-container canvas {
    max-width: 100%;
    height: auto;
  }
}
</style>
