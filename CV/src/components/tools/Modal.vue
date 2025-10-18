<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" :class="[`size-${size}`, { 'full-screen': fullScreen }]">
          <!-- Header del Modal -->
          <div class="modal-header">
            <div class="modal-title-section">
              <h2 v-if="title" class="modal-title">{{ title }}</h2>
              <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
            </div>
            <button @click="closeModal" class="close-button" :aria-label="$t('modal.close')">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Contenido del Modal -->
          <div class="modal-content" :class="{ 'with-footer': $slots.footer }">
            <slot></slot>
          </div>

          <!-- Footer opcional -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, nextTick } from 'vue'

interface Props {
  isOpen: boolean
  title?: string
  subtitle?: string
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  fullScreen?: boolean
  closeOnOverlay?: boolean
  preventScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'large',
  fullScreen: false,
  closeOnOverlay: true,
  preventScroll: true,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'open'): void
}>()

// Manejar click en overlay
const handleOverlayClick = (event: MouseEvent) => {
  if (props.closeOnOverlay && event.target === event.currentTarget) {
    closeModal()
  }
}

// Cerrar modal
const closeModal = () => {
  emit('close')
}

// Manejar scroll del body
const toggleBodyScroll = (disable: boolean) => {
  if (props.preventScroll) {
    document.body.style.overflow = disable ? 'hidden' : ''
  }
}

// Manejar tecla Escape
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

// Watchers
watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      emit('open')
      await nextTick()
      toggleBodyScroll(true)
      document.addEventListener('keydown', handleKeyDown)
    } else {
      toggleBodyScroll(false)
      document.removeEventListener('keydown', handleKeyDown)
    }
  },
)

// Cleanup al desmontar
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
  toggleBodyScroll(false)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background: var(--color-background);
  border-radius: 12px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  width: 100%;
  position: relative;
}

/* Tamaños del modal */
.size-small {
  max-width: 400px;
}

.size-medium {
  max-width: 600px;
}

.size-large {
  max-width: 900px;
}

.size-xlarge {
  max-width: 1200px;
}

.full-screen {
  max-width: 95vw !important;
  max-height: 95vh !important;
  width: 95vw;
  height: 95vh;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 2rem 0;
  border-bottom: 1px solid var(--bordeado-palido);
  margin-bottom: 0;
  flex-shrink: 0;
}

.modal-title-section {
  flex: 1;
  padding-right: 1rem;
}

.modal-title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1.3;
}

.modal-subtitle {
  margin: 0;
  color: var(--color-text-weak);
  font-size: 1rem;
  line-height: 1.4;
}

.close-button {
  background: none;
  border: none;
  color: var(--color-text-weak);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: var(--bordeado-palido);
  color: var(--color-text);
}

/* Contenido */
.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
  color: var(--color-text);
}

.modal-content.with-footer {
  padding-bottom: 1rem;
}

/* Footer */
.modal-footer {
  flex-shrink: 0;
  padding: 1rem 2rem 1.5rem;
  border-top: 1px solid var(--bordeado-palido);
  background: var(--gris-palido);
  border-radius: 0 0 12px 12px;
}

/* Transiciones */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-50px);
}

/* Scrollbar personalizada */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: var(--bordeado-palido);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--color-secondary);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-container {
    max-height: 95vh;
    border-radius: 8px;
  }

  .size-small,
  .size-medium,
  .size-large,
  .size-xlarge {
    max-width: 100%;
  }

  .modal-header {
    padding: 1rem 1.5rem 0;
  }

  .modal-content {
    padding: 1rem 1.5rem;
  }

  .modal-footer {
    padding: 1rem 1.5rem 1rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-subtitle {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-container {
    max-height: 100vh;
    border-radius: 0;
  }

  .full-screen {
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
  }
}
</style>
