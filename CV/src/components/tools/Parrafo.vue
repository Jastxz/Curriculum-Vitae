<template>
  <div
    class="paragraph-container"
    :class="{
      'with-highlight': highlight,
      'with-divider': showDivider,
      centered: centered,
      'full-width': fullWidth,
      [`size-${size}`]: true,
    }"
  >
    <p v-if="title" class="paragraph-title">{{ title }}</p>
    <div class="paragraph-content">
      <slot></slot>
    </div>
    <div v-if="showDivider" class="paragraph-divider"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  // Título opcional para el párrafo
  title: {
    type: String,
    default: '',
  },
  // Si debe tener un fondo destacado
  highlight: {
    type: Boolean,
    default: false,
  },
  // Si debe mostrar un divisor al final
  showDivider: {
    type: Boolean,
    default: false,
  },
  // Si el texto debe estar centrado
  centered: {
    type: Boolean,
    default: false,
  },
  // Si debe ocupar todo el ancho disponible
  fullWidth: {
    type: Boolean,
    default: false,
  },
  // Tamaño de texto: small, medium, large
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value),
  },
})
</script>

<style scoped>
.paragraph-container {
  font-family: inherit;
  line-height: 1.7;
  margin: 1.5rem 0;
  color: var(--color-text);
  max-width: 750px;
}

.paragraph-container.full-width {
  max-width: 100%;
}

.paragraph-container.with-highlight {
  padding: 1.5rem;
  background-color: #1abc9c28;
  border-left: 4px solid var(--color-primary);
  border-radius: 4px;
}

.paragraph-container.centered {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.paragraph-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: var(--color-primary);
}

.paragraph-content {
  margin: 0;
}

.paragraph-content ::v-deep(p) {
  margin-bottom: 1rem;
}

.paragraph-content ::v-deep(p:last-child) {
  margin-bottom: 0;
}

.paragraph-content ::v-deep(a) {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.paragraph-content ::v-deep(a:hover) {
  border-bottom-color: var(--color-primary);
}

.paragraph-content ::v-deep(strong) {
  font-weight: 600;
  color: var(--color-secundary);
}

.paragraph-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #1abc9c52, transparent);
  margin-top: 1.5rem;
}

/* Variantes de tamaño */
.size-small {
  font-size: 0.9rem;
}

.size-medium {
  font-size: 1rem;
}

.size-large {
  font-size: 1.15rem;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .paragraph-container {
    margin: 1rem 0;
  }

  .paragraph-container.with-highlight {
    padding: 1rem;
  }
}
</style>
