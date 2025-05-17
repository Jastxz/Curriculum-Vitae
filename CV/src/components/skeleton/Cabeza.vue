<template>
  <header class="header">
    <div class="header-content">
      <h1 class="name">Javier Gil Blázquez</h1>
      <h2 class="role">Desarrollador Backend</h2>
      <h3 class="motivation">'Con el tiempo suficiente, refactorizo cualquier sistema'</h3>
    </div>
    <CambiarTema></CambiarTema>
  </header>
</template>

<script setup lang="ts">
import CambiarTema from '../tools/CambiarTema.vue'
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

<style scoped>
.header {
  display: inline-flex;
  width: 100%;
  padding: 2rem 0;
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.name {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 1px;
}

.role {
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0.5rem 0 0;
  opacity: 0.9;
}

.motivation {
  font-size: 1rem;
  font-weight: 300;
  font-style: italic;
  margin: 0.5rem 0 0;
  opacity: 0.9;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .name {
    font-size: 2.2rem;
  }

  .role {
    font-size: 1.2rem;
  }
}
</style>
