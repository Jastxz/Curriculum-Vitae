<template>
    <main>
        <!-- Sección Inicio -->
        <section id="home" class="section">
          <h2>Inicio</h2>
          <ContenidoInicio></ContenidoInicio>
        </section>

        <!-- Sección Experiencia -->
        <section id="experience" class="section">
          <h2>Experiencia</h2>
          <ContenidoExperiencia></ContenidoExperiencia>
        </section>

        <!-- Sección Proyectos -->
        <section id="projects" class="section">
          <h2>Proyectos</h2>
          <!-- Contenido de la sección -->
        </section>

        <!-- Sección Habilidades -->
        <section id="skills" class="section">
          <h2>Habilidades</h2>
          <ContenidoHabilidades></ContenidoHabilidades>
        </section>
      </main>
</template>

<script setup lang="ts">
import ContenidoInicio from '../home/ContenidoInicio.vue';
import ContenidoExperiencia from '../home/ContenidoExperiencia.vue';
import ContenidoHabilidades from '../home/ContenidoHabilidades.vue';
</script>

<style>
main {
  min-height: calc(100vh - 200px); /* Ajustar según la altura del header y footer */
  padding: 2rem;
  background-color: var(--color-background);
}

.section {
  min-height: 100vh;
  padding: 4rem 2rem;
  scroll-margin-top: 4rem; /* Para el desplazamiento suave */
}

.section h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--color-primary);
  position: relative;
}

.section h2::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.75rem;
  width: 4rem;
  height: 3px;
  background: linear-gradient(to right, var(--color-secondary), var(--color-background));
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .section {
    padding: 3rem 1rem;
  }
}
</style>