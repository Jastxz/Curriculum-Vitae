<template>
  <div class="app-container">
    <BarraLateral></BarraLateral>
    <div class="main-content">
      <Cabeza></Cabeza>

      <main>
        <!-- Sección Inicio -->
        <section id="home" class="section">
          <h2>Inicio</h2>
          <!-- Contenido de la sección -->
        </section>

        <!-- Sección Sobre mí -->
        <section id="about" class="section">
          <h2>Sobre mí</h2>
          <!-- Contenido de la sección -->
        </section>

        <!-- Sección Experiencia -->
        <section id="experience" class="section">
          <h2>Experiencia</h2>
          <!-- Contenido de la sección -->
        </section>

        <!-- Sección Proyectos -->
        <section id="projects" class="section">
          <h2>Proyectos</h2>
          <!-- Contenido de la sección -->
        </section>

        <!-- Sección Habilidades -->
        <section id="skills" class="section">
          <h2>Habilidades</h2>
          <!-- Contenido de la sección -->
        </section>
      </main>

      <Pie></Pie>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cabeza from './components/Cabeza.vue'
import Pie from './components/Pie.vue'
import BarraLateral from './components/BarraLateral.vue'
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

main {
  min-height: calc(100vh - 200px); /* Ajustar según la altura del header y footer */
  padding: 2rem;
}

.section {
  min-height: 100vh;
  padding: 4rem 2rem;
  scroll-margin-top: 4rem; /* Para el desplazamiento suave */
}

.section h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  position: relative;
}

.section h2::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.75rem;
  width: 4rem;
  height: 3px;
  background: linear-gradient(to right, #2c3e50, #4b6cb7);
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .section {
    padding: 3rem 1rem;
  }
}
</style>
