<template>
  <div
    class="image-container"
    :class="{
      [`align-${align}`]: true,
      [`shape-${shape}`]: true,
      'with-shadow': shadow,
      'with-border': border,
      'with-caption': caption,
    }"
    :style="{ maxWidth: width }"
  >
    <div class="image-wrapper">
      <img :src="src" :alt="alt" class="image" :class="{ 'hover-zoom': zoom }" loading="lazy" />
      <div v-if="overlay" class="image-overlay">
        <slot name="overlay">
          <div class="overlay-content">
            {{ overlayText }}
          </div>
        </slot>
      </div>
    </div>
    <p v-if="caption" class="image-caption">{{ caption }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  // URL de la imagen
  src: {
    type: String,
    required: true,
  },
  // Texto alternativo para accesibilidad
  alt: {
    type: String,
    default: 'Imagen',
  },
  // Ancho máximo de la imagen (con unidades CSS)
  width: {
    type: String,
    default: '100%',
  },
  // Alineación: 'left', 'center', 'right'
  align: {
    type: String,
    default: 'center',
    validator: (value: string) => ['origin', 'left', 'center', 'right'].includes(value),
  },
  // Forma: 'rectangle', 'rounded', 'circle'
  shape: {
    type: String,
    default: 'rounded',
    validator: (value: string) => ['rectangle', 'rounded', 'circle'].includes(value),
  },
  // Si debe tener sombra
  shadow: {
    type: Boolean,
    default: false,
  },
  // Si debe tener borde
  border: {
    type: Boolean,
    default: false,
  },
  // Leyenda bajo la imagen
  caption: {
    type: String,
    default: '',
  },
  // Si debe tener efecto zoom al pasar el ratón
  zoom: {
    type: Boolean,
    default: false,
  },
  // Si debe mostrar un overlay al pasar el ratón
  overlay: {
    type: Boolean,
    default: false,
  },
  // Texto en el overlay
  overlayText: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.image-container {
  margin: 1.5rem 0;
  overflow: hidden;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
}

.image {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.3s ease;
}

.image.hover-zoom:hover {
  transform: scale(1.05);
}

/* Alineaciones */
.align-left {
  margin-right: auto;
}

.align-center {
  margin-left: auto;
  margin-right: auto;
}

.align-right {
  margin-left: auto;
}

.align-top {
  margin-bottom: auto;
}

.align-middle {
  margin-top: auto;
  margin-bottom: auto;
}

.align-bottom {
  margin-top: auto;
}

.align-origin {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;
}

/* Formas */
.shape-rectangle .image {
  border-radius: 0;
}

.shape-rounded .image {
  border-radius: 8px;
}

.shape-circle .image-wrapper {
  border-radius: 50%;
  overflow: hidden;
  aspect-ratio: 1/1;
}

/* Efectos adicionales */
.with-shadow {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.with-border .image {
  border: 2px solid #e5e7eb;
}

.image-caption {
  margin-top: 0.75rem;
  text-align: center;
  font-size: 0.9rem;
  color: #6b7280;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(44, 62, 80, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-wrapper:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  color: white;
  padding: 1rem;
  text-align: center;
  font-weight: 500;
}

/* Responsividad */
@media (max-width: 768px) {
  .image-container {
    margin: 1rem 0;
  }
}
</style>
