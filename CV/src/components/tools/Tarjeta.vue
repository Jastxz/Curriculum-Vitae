<template>
  <div
    class="visual-card"
    :class="{
      [`layout-${layout}`]: true,
      'with-hover': hover,
      [`theme-${theme}`]: true,
    }"
  >
    <div
      v-if="$slots.media || imageSrc"
      class="card-media"
      :class="{ 'full-bleed': fullBleedImage }"
    >
      <slot name="media">
        <img v-if="imageSrc" :src="imageSrc" :alt="imageAlt" class="card-image" />
      </slot>
      <div v-if="$slots.badge || badge" class="card-badge">
        <slot name="badge">
          <span class="badge-text">{{ badge }}</span>
        </slot>
      </div>
    </div>

    <div class="card-content">
      <div v-if="$slots.icon" class="card-icon">
        <slot name="icon"></slot>
      </div>

      <div v-if="$slots.header || title || subtitle" class="card-header">
        <slot name="header">
          <h3 v-if="title" class="card-title">{{ title }}</h3>
          <h4 v-if="subtitle" class="card-subtitle">{{ subtitle }}</h4>
        </slot>
      </div>

      <div class="card-body">
        <slot></slot>
      </div>

      <div v-if="$slots.footer" class="card-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  // Título de la tarjeta
  title: {
    type: String,
    default: '',
  },
  // Subtítulo de la tarjeta
  subtitle: {
    type: String,
    default: '',
  },
  // URL de la imagen
  imageSrc: {
    type: String,
    default: '',
  },
  // Texto alternativo para la imagen
  imageAlt: {
    type: String,
    default: 'Imagen de tarjeta',
  },
  // Texto de la insignia
  badge: {
    type: String,
    default: '',
  },
  // Diseño: 'vertical', 'horizontal'
  layout: {
    type: String,
    default: 'vertical',
    validator: (value: string) => ['vertical', 'horizontal'].includes(value),
  },
  // Si la imagen debe ocupar el ancho completo
  fullBleedImage: {
    type: Boolean,
    default: false,
  },
  // Si debe tener efecto hover
  hover: {
    type: Boolean,
    default: false,
  },
  // Tema de color: 'default', 'primary', 'secondary', 'accent'
  theme: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'primary', 'secondary', 'accent'].includes(value),
  },
})
</script>

<style scoped>
.visual-card {
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 1.5rem 0;
}

/* Layouts */
.layout-vertical {
  flex-direction: column;
}

.layout-horizontal {
  flex-direction: row;
}

.layout-horizontal .card-media {
  width: 33%;
  min-width: 150px;
}

.layout-horizontal .card-content {
  width: 67%;
}

/* Media */
.card-media {
  position: relative;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.with-hover:hover .card-image {
  transform: scale(1.05);
}

.layout-vertical .card-media:not(.full-bleed) {
  padding: 1rem 1rem 0;
}

.layout-vertical .card-media:not(.full-bleed) .card-image {
  border-radius: 8px;
}

/* Contenido */
.card-content {
  padding: 1.5rem;
}

/* Header */
.card-header {
  margin-bottom: 1rem;
}

.card-title {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.3;
}

.card-subtitle {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 400;
  color: #6b7280;
}

/* Icono */
.card-icon {
  margin-bottom: 1rem;
}

/* Badge */
.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.badge-text {
  white-space: nowrap;
}

/* Body */
.card-body {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #4b5563;
}

/* Footer */
.card-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

/* Temas */
.theme-default {
  border: 1px solid #e5e7eb;
}

.theme-primary {
  border-top: 4px solid #4b6cb7;
}

.theme-secondary {
  border-left: 4px solid #4b6cb7;
}

.theme-accent {
  background: linear-gradient(to bottom right, #ffffff, #f3f4f6);
  border: 1px solid #e5e7eb;
}

/* Hover effect */
.with-hover {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.with-hover:hover {
  transform: translateY(-5px);
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Responsive */
@media (max-width: 768px) {
  .layout-horizontal {
    flex-direction: column;
  }

  .layout-horizontal .card-media,
  .layout-horizontal .card-content {
    width: 100%;
  }
}
</style>
