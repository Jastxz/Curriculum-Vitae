<template>
  <div class="table-container" :class="{ bordered: bordered, striped: striped }">
    <!-- Header opcional -->
    <div v-if="title || $slots.header" class="table-header">
      <h3 v-if="title" class="table-title">{{ title }}</h3>
      <slot name="header"></slot>
    </div>

    <!-- Búsqueda opcional -->
    <div v-if="searchable" class="table-search">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="searchPlaceholder"
        class="search-input"
      />
    </div>

    <!-- Tabla -->
    <div class="table-wrapper" :class="{ 'max-height': maxHeight }">
      <table class="data-table">
        <!-- Cabeceras -->
        <thead>
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              :class="[`align-${column.align || 'left'}`, { sortable: column.sortable }]"
              @click="column.sortable ? sort(column.key) : null"
            >
              <div class="header-content">
                <span>{{ column.label }}</span>
                <span v-if="column.sortable" class="sort-icon" :class="getSortClass(column.key)">
                  ↕️
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <!-- Cuerpo de la tabla -->
        <tbody>
          <tr v-if="filteredAndSortedData.length === 0">
            <td :colspan="columns.length" class="empty-message">
              {{ emptyMessage }}
            </td>
          </tr>
          <tr
            v-else
            v-for="(row, rowIndex) in paginatedData"
            :key="getRowKey(row, rowIndex)"
            :class="{ 'row-hover': hoverable }"
            @click="handleRowClick(row, rowIndex)"
          >
            <td
              v-for="(column, colIndex) in columns"
              :key="colIndex"
              :class="`align-${column.align || 'left'}`"
            >
              <!-- Slot personalizado para la celda -->
              <slot
                :name="`cell-${column.key}`"
                :value="getCellValue(row, column)"
                :row="row"
                :column="column"
                :rowIndex="rowIndex"
              >
                <!-- Contenido por defecto -->
                <span :class="column.cellClass">
                  {{ formatCellValue(getCellValue(row, column), column) }}
                </span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="paginated && totalPages > 1" class="pagination">
      <button @click="currentPage = 1" :disabled="currentPage === 1" class="page-button">⏮️</button>
      <button @click="currentPage--" :disabled="currentPage === 1" class="page-button">◀️</button>

      <span class="page-info">
        {{ currentPage }} de {{ totalPages }}
        <small>({{ filteredAndSortedData.length }} {{ $t('table.items') }})</small>
      </span>

      <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-button">
        ▶️
      </button>
      <button
        @click="currentPage = totalPages"
        :disabled="currentPage === totalPages"
        class="page-button"
      >
        ⏭️
      </button>
    </div>

    <!-- Footer opcional -->
    <div v-if="$slots.footer" class="table-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Column {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  formatter?: (value: any) => string
  cellClass?: string
}

interface Props {
  data: any[]
  columns: Column[]
  title?: string
  bordered?: boolean
  striped?: boolean
  hoverable?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  paginated?: boolean
  pageSize?: number
  maxHeight?: boolean
  keyField?: string
}

const props = withDefaults(defineProps<Props>(), {
  bordered: true,
  striped: true,
  hoverable: true,
  searchable: false,
  searchPlaceholder: 'Buscar...',
  emptyMessage: 'No hay datos',
  paginated: false,
  pageSize: 10,
  maxHeight: false,
  keyField: 'id',
})

const emit = defineEmits<{
  (e: 'row-click', row: any, index: number): void
}>()

// Estado
const searchQuery = ref('')
const currentPage = ref(1)
const sortField = ref<string>('')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Obtener valor de celda
const getCellValue = (row: any, column: Column) => {
  const keys = column.key.split('.')
  let value = row
  for (const key of keys) {
    value = value?.[key]
  }
  return value
}

// Formatear valor de celda
const formatCellValue = (value: any, column: Column) => {
  if (column.formatter) {
    return column.formatter(value)
  }
  if (value === null || value === undefined) {
    return '-'
  }
  return String(value)
}

// Obtener clave de fila
const getRowKey = (row: any, index: number) => {
  return row[props.keyField] || index
}

// Datos filtrados
const filteredAndSortedData = computed(() => {
  let filtered = props.data

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((row) =>
      props.columns.some((column) => {
        const value = getCellValue(row, column)
        return String(value).toLowerCase().includes(query)
      }),
    )
  }

  // Ordenar
  if (sortField.value) {
    const column = props.columns.find((col) => col.key === sortField.value)
    if (column) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = getCellValue(a, column)
        const bVal = getCellValue(b, column)

        // Comparación numérica si ambos son números
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
        }

        // Comparación de strings
        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()

        if (sortDirection.value === 'asc') {
          return aStr.localeCompare(bStr)
        } else {
          return bStr.localeCompare(aStr)
        }
      })
    }
  }

  return filtered
})

// Datos paginados
const totalPages = computed(() => {
  if (!props.paginated) return 1
  return Math.ceil(filteredAndSortedData.value.length / props.pageSize)
})

const paginatedData = computed(() => {
  if (!props.paginated) return filteredAndSortedData.value

  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return filteredAndSortedData.value.slice(start, end)
})

// Funciones de ordenamiento
const sort = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  currentPage.value = 1
}

const getSortClass = (field: string) => {
  if (sortField.value !== field) return ''
  return sortDirection.value === 'asc' ? 'sort-asc' : 'sort-desc'
}

// Handle row click
const handleRowClick = (row: any, index: number) => {
  emit('row-click', row, index)
}

// Reset page cuando cambian los datos
watch(
  () => props.data,
  () => {
    currentPage.value = 1
  },
)
</script>

<style scoped>
.table-container {
  width: 100%;
  background: var(--color-background);
  border-radius: 8px;
  overflow: hidden;
}

.table-container.bordered {
  border: 1px solid var(--bordeado-palido);
}

.table-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--bordeado-palido);
  background: var(--selection-background);
}

.table-title {
  margin: 0;
  color: var(--color-primary);
  font-size: 1.25rem;
}

.table-search {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--bordeado-palido);
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--bordeado-palido);
  border-radius: 4px;
  font-size: 0.9rem;
  background: var(--color-background);
  color: var(--color-text);
}

.table-wrapper {
  overflow-x: auto;
}

.table-wrapper.max-height {
  max-height: 400px;
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table th {
  background: var(--selection-background);
  color: var(--color-text);
  font-weight: 600;
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid var(--bordeado-palido);
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.data-table th.sortable:hover {
  background: var(--selection-background);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sort-icon {
  font-size: 0.8rem;
  opacity: 0.6;
  margin-left: 0.5rem;
}

.sort-icon.sort-asc::after {
  content: '↑';
  color: var(--color-primary);
  opacity: 1;
}

.sort-icon.sort-desc::after {
  content: '↓';
  color: var(--color-primary);
  opacity: 1;
}

.data-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--bordeado-palido);
  color: var(--color-text);
}

.data-table.striped tbody tr:nth-child(even) {
  background: var(--selection-background);
}

.data-table tbody tr.row-hover:hover {
  background: var(--selection-background);
  cursor: pointer;
}

.align-left {
  text-align: left;
}
.align-center {
  text-align: center;
}
.align-right {
  text-align: right;
}

.empty-message {
  text-align: center;
  color: var(--color-text-weak);
  font-style: italic;
  padding: 2rem;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid var(--bordeado-palido);
  background: var(--selection-background);
}

.page-button {
  background: var(--color-background);
  border: 1px solid var(--bordeado-palido);
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-button:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  margin: 0 1rem;
  color: var(--color-text);
  font-size: 0.9rem;
}

.table-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--bordeado-palido);
  background: var(--selection-background);
}

/* Responsive */
@media (max-width: 768px) {
  .data-table {
    font-size: 0.8rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.5rem;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
}
</style>
