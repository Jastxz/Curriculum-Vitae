<template>
  <div class="app-container">
    <BarraLateral></BarraLateral>
    <div class="main-content">
      <Cabeza></Cabeza>
      <Main></Main>
      <Pie></Pie>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cabeza from './components/skeleton/Cabeza.vue'
import Pie from './components/skeleton/Pie.vue'
import BarraLateral from './components/skeleton/BarraLateral.vue'
import Main from './components/skeleton/Main.vue'
</script>

<style>
/* Estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    'Inter',
    'Roboto',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Arial,
    sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

.app-container {
  display: flex;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
</style>
