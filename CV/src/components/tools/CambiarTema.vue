<template>
  <button @click="themeStore.toggleTheme()" class="theme-toggle">
    <span v-html="themeStore.isDarkMode ? SUN_ICON : MOON_ICON"></span>
  </button>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

// Iconos SVG
const SUN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="5"></circle>
  <line x1="12" y1="1" x2="12" y2="3"></line>
  <line x1="12" y1="21" x2="12" y2="23"></line>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
  <line x1="1" y1="12" x2="3" y2="12"></line>
  <line x1="21" y1="12" x2="23" y2="12"></line>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
</svg>`

const MOON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
</svg>`

// Usar el store
const themeStore = useThemeStore()

// Inicializar el tema al montar el componente
onMounted(() => {
  themeStore.initTheme()
})
</script>

<style scoped>
.theme-toggle {
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  border: none;
  background: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: all 0.3s;
}

.theme-toggle:hover {
  transform: scale(1.1);
}

.theme-toggle svg {
  width: 20px;
  height: 20px;
}
</style>
