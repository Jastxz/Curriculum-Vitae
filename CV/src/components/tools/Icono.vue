<template>
  <div
    class="icon-feature"
    :class="{
      [`layout-${layout}`]: true,
      [`size-${size}`]: true,
      'with-hover': hover,
      'with-border': border,
      'with-background': background,
    }"
  >
    <div class="icon-wrapper" :style="{ color: iconColor, backgroundColor: iconBackground }">
      <slot name="icon">
        <span v-if="iconUrl" class="custom-icon">
          <img :src="iconUrl" :alt="`Icono - ${title}`" />
        </span>
        <span v-else class="default-icon" v-html="svgIcon"></span>
      </slot>
    </div>

    <div class="content">
      <h3 v-if="title" class="title">{{ title }}</h3>
      <p v-if="description" class="description">{{ description }}</p>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Iconos SVG predefinidos
const icons = {
  work: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
  education: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`,
  skill: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  project: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  location: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  contact: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  code: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
}

const props = defineProps({
  // Título del elemento
  title: {
    type: String,
    default: '',
  },
  // Descripción
  description: {
    type: String,
    default: '',
  },
  // Tipo de icono predefinido
  iconType: {
    type: String,
    default: '',
    validator: (value: string) => ['', ...Object.keys(icons)].includes(value),
  },
  // URL de imagen para icono personalizado
  iconUrl: {
    type: String,
    default: '',
  },
  // Color del icono
  iconColor: {
    type: String,
    default: 'currentColor',
  },
  // Color de fondo del icono
  iconBackground: {
    type: String,
    default: 'transparent',
  },
  // Disposición: 'horizontal', 'vertical'
  layout: {
    type: String,
    default: 'horizontal',
    validator: (value: string) => ['horizontal', 'vertical'].includes(value),
  },
  // Tamaño del componente: 'small', 'medium', 'large'
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value),
  },
  // Si debe tener efecto hover
  hover: {
    type: Boolean,
    default: false,
  },
  // Si debe tener borde
  border: {
    type: Boolean,
    default: false,
  },
  // Si debe tener fondo
  background: {
    type: Boolean,
    default: false,
  },
})

// Obtener el icono SVG basado en el tipo
const svgIcon = computed(() => icons[props.iconType as keyof typeof icons] || '')
</script>

<style scoped>
.icon-feature {
  display: flex;
  margin: 1rem 0;
}

/* Disposiciones */
.layout-horizontal {
  flex-direction: row;
  align-items: flex-start;
}

.layout-vertical {
  flex-direction: column;
  align-items: flex-start;
}

/* Tamaños */
.size-small {
  font-size: 0.9rem;
}

.size-small .icon-wrapper {
  width: 40px;
  height: 40px;
}

.size-medium {
  font-size: 1rem;
}

.size-medium .icon-wrapper {
  width: 50px;
  height: 50px;
}

.size-large {
  font-size: 1.1rem;
}

.size-large .icon-wrapper {
  width: 64px;
  height: 64px;
}

/* Contenedor del icono */
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 8px;
  margin-right: 1rem;
  transition: all 0.3s ease;
}

.layout-vertical .icon-wrapper {
  margin-right: 0;
  margin-bottom: 1rem;
}

/* Estilos de iconos */
.custom-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.default-icon {
  width: 60%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Contenido */
.content {
  flex: 1;
}

.title {
  margin: 0 0 0.5rem;
  font-weight: 600;
  color: #3498db;
  font-size: 1.1em;
}

.description {
  margin: 0;
  color: #4b5563;
  line-height: 1.5;
}

/* Variantes */
.with-background {
  padding: 1.25rem;
  background-color: #f9fafb;
  border-radius: 8px;
}

.with-border {
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.with-hover {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.with-hover:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.with-background .icon-wrapper,
.with-border .icon-wrapper {
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* Responsividad */
@media (max-width: 768px) {
  .layout-horizontal {
    flex-direction: column;
  }

  .layout-horizontal .icon-wrapper {
    margin-right: 0;
    margin-bottom: 1rem;
  }
}
</style>
