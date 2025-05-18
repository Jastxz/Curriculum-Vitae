<template>
  <Tarjeta :title="tfg" :subtitle="breveTfg">
    <template #default>
      {{ descripciónTfg }}
    </template>
    <template #footer>
      <a
        href="https://github.com/Jastxz/Adversarial-Search-Haskell"
        target="_blank"
        class="repo-link"
        >GitHub repo</a
      >
      <br>
      <a
        target="_blank"
        class="repo-link"
        href="https://drive.google.com/file/d/1uzNimWJyKeBqCm5lWbp-cOMB7BjCebLK/view?usp=drive_link"
        >Zip con portable para Windows</a
      >
    </template>
  </Tarjeta>
  <Tarjeta :title="automatasHaskell" :subtitle="breveAH">
    <template #default>
      {{ descripciónAH }}
    </template>
    <template #footer>
      <a
        href="https://github.com/Jastxz/Fractals-with-celular-automatas-Haskell"
        target="_blank"
        class="repo-link"
        >GitHub repo</a
      >
    </template>
  </Tarjeta>
  <Tarjeta :title="automatasJava" :subtitle="breveAJ">
    <template #default>
      {{ descripciónAJ }}
    </template>
    <template #footer>
      <a
        href="https://github.com/Jastxz/Fractals-with-celular-automatas-Java"
        target="_blank"
        class="repo-link"
        >GitHub repo</a
      >
    </template>
  </Tarjeta>
</template>

<script setup lang="ts">
import Tarjeta from '../tools/Tarjeta.vue'

// Títulos
const tfg = 'Adversarial-Search-Haskell'
const automatasHaskell = 'Fractals-with-celular-automatas - Haskell'
const automatasJava = 'Fractals-with-celular-automatas - Java'

// Subtítulos
const breveTfg =
  'Búsqueda de estados en juegos con adversario implementado en Haskell y aplicado a algunos juegos.'
const breveAH =
  'Aplicación que permite visualizar la representación de los 255 autómatas celulares disponibles en dos dimensiones.'
const breveAJ =
  'Aplicación que permite visualizar la representación de algunos autómatas celulares disponibles en dos dimensiones.'

// Textos de los párrafos
const descripciónTfg =
  'Este proyecto es una aplicación con la que se puede jugar a algunos juegos clásicos contra la máquina. La gracia del proyecto era crear la interfaz \
    de usuario y el motor a mano desde cero o partiendo de lo mínimo. En el caso de la interfaz, me apoyé en una librería de dibujo de formas y letras, \
    por eso la GUI se ve tan limitada o bruta. El motor de juego está creado desde cero al 100%. Adapté el algoritmo clásico de búsqueda con adversario \
    MiniMax en su versión Negamax con algunas mejoras añadidas dependiendo del nivel de dificultad que quisiera elegir el usuario.'
const descripciónAH =
  'Esta aplicación maneja el mismo estilo que mi aplicación de juegos con búsqueda de adversario. De esta manera reaprovechaba lo que ya tenía desarrollado \
    en este sentido. En esta ocasión, el objetivo era poder visualizar cualquiera de las 255 reglas para la generación de autómatas celulares; ya fuera \
    partiendo desde un entorno aleatorio o desde un entorno controlado clásico.'
const descripciónAJ =
  'Esta aplicación es hermana de la que tiene su mismo nombre pero desarrollada con Haskell. Mi objetivo era replicar el mismo uso para hacer comparativas \
    en el diseño, implementación y potencia de computación entre ambas. Las diferencias principales se encuentran en la interfaz de usuario, que esta vez usa \
    la librería Java Swing, que a día de hoy está un poco obsoleta si no me equivoco, y que esta aplicación solo tiene implementadas algunas reglas a mano.'
</script>

<style>
.repo-link {
  color: var(--color-secondary);
  text-decoration: none;
  transition:
    color 0.2s ease,
    text-decoration 0.2s ease;
  position: relative;
}

.repo-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: -2px;
  left: 0;
  background-color: var(--color-text);
  transition: width 0.3s ease;
}

.repo-link:hover {
  color: var(--color-text);
}

.repo-link:hover::after {
  width: 100%;
}
</style>
