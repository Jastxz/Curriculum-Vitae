import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Estado
  const isDarkMode = ref<boolean>(false)

  // Getter
  const currentTheme = computed(() => (isDarkMode.value ? 'dark' : 'light'))

  // Acciones
  function initTheme(): void {
    // Detectar preferencia guardada o sistema
    const savedTheme = localStorage.getItem('darkMode')
    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

    isDarkMode.value = savedTheme === 'true' || (savedTheme === null && prefersDark)

    applyTheme()

    // Escuchar cambios en preferencias del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem('darkMode') === null) {
        isDarkMode.value = e.matches
      }
    })
  }

  function toggleTheme(): void {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value.toString())
  }

  function applyTheme(): void {
    document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
  }

  // Observar cambios en isDarkMode y aplicar tema
  watch(isDarkMode, () => {
    applyTheme()
  })

  return {
    isDarkMode,
    currentTheme,
    toggleTheme,
    initTheme,
  }
})
