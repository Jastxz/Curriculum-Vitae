<!-- ListComponent.vue -->
<template>
  <div class="list-container">
    <!-- Header con título y acciones -->
    <div class="list-header" v-if="title || $slots.header">
      <h3 v-if="title" class="list-title">{{ title }}</h3>
      <slot name="header"></slot>
    </div>

    <!-- Búsqueda opcional -->
    <div class="list-search" v-if="searchable">
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="searchPlaceholder"
        class="search-input"
        @input="handleSearch"
      />
    </div>

    <!-- Cuerpo de la lista -->
    <div
      class="list-body"
      :class="{
        empty: filteredItems.length === 0,
        bordered: bordered,
        'with-divider': withDivider,
      }"
    >
      <template v-if="filteredItems.length">
        <div
          v-for="(item, index) in filteredItems"
          :key="getItemKey(item, index)"
          class="list-item"
          :class="{ 'with-divider': withDivider && index !== filteredItems.length - 1 }"
          @click="handleItemClick(item)"
        >
          <slot name="item" :item="item" :index="index">
            {{ getItemText(item) }}
          </slot>
        </div>
      </template>
      <div v-else class="list-empty">
        <slot name="empty">
          {{ emptyText }}
        </slot>
      </div>
    </div>

    <!-- Footer -->
    <div class="list-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'

// Definición de tipos
type KeyFn<T> = (item: T) => string | number
type TextFn<T> = (item: T) => string

// Props
const props = defineProps({
  // Datos de la lista
  items: {
    type: Array as PropType<any[]>,
    required: true,
  },
  // Función para obtener la clave única para cada ítem
  keyFn: {
    type: Function as PropType<KeyFn<any>>,
    default: null,
  },
  // Función para obtener el texto a mostrar para cada ítem
  textFn: {
    type: Function as PropType<TextFn<any>>,
    default: null,
  },
  // Propiedad para usar como clave única (alternativa a keyFn)
  keyProp: {
    type: String,
    default: 'id',
  },
  // Propiedad para usar como texto a mostrar (alternativa a textFn)
  textProp: {
    type: String,
    default: 'name',
  },
  // Título de la lista
  title: {
    type: String,
    default: '',
  },
  // Habilitar búsqueda
  searchable: {
    type: Boolean,
    default: false,
  },
  // Placeholder del input de búsqueda
  searchPlaceholder: {
    type: String,
    default: 'Buscar...',
  },
  // Texto cuando la lista está vacía
  emptyText: {
    type: String,
    default: 'No hay elementos',
  },
  // Añadir bordes a la lista
  bordered: {
    type: Boolean,
    default: false,
  },
  // Añadir divisores entre elementos
  withDivider: {
    type: Boolean,
    default: false,
  },
})

// Eventos
const emit = defineEmits<{
  (e: 'item-click', item: any): void
  (e: 'search', query: string): void
}>()

// Estado
const searchQuery = ref('')

// Manejar click en un ítem
const handleItemClick = (item: any) => {
  emit('item-click', item)
}

// Manejar eventos de búsqueda
const handleSearch = () => {
  emit('search', searchQuery.value)
}

// Obtener la clave única para un ítem
const getItemKey = (item: any, index: number): string | number => {
  if (props.keyFn) {
    return props.keyFn(item)
  } else if (item[props.keyProp] !== undefined) {
    return item[props.keyProp]
  }
  return index
}

// Obtener el texto a mostrar para un ítem
const getItemText = (item: any): string => {
  if (props.textFn) {
    return props.textFn(item)
  } else if (typeof item === 'string' || typeof item === 'number') {
    return String(item)
  } else if (item[props.textProp] !== undefined) {
    return String(item[props.textProp])
  }
  return JSON.stringify(item)
}

// Filtrar elementos basados en la búsqueda
const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return props.items
  }

  const query = searchQuery.value.toLowerCase()

  return props.items.filter((item) => {
    const text = getItemText(item).toLowerCase()
    return text.includes(query)
  })
})
</script>

<style scoped>
.list-container {
  width: 100%;
  font-family: var(
    --font-family,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif
  );
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.list-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
}

.list-search {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--bordeado-palido);
  border-radius: 4px;
  font-size: 0.875rem;
}

.list-body {
  width: 100%;
}

.list-body.bordered {
  border: 1px solid var(--color-secondary);
  border-radius: 4px;
}

.list-item {
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--color-text);
}

.list-item:hover {
  background-color: var(--bordeado-palido);
}

.list-item.with-divider {
  border-bottom: 1px solid var(--bordeado-palido);
}

.list-empty {
  padding: 1.5rem;
  text-align: center;
  color: var(--empty-text-color, #999);
  font-style: italic;
}

.list-footer {
  margin-top: 1rem;
  color: var(--color-text);
}
</style>
