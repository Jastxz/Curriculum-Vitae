<template>
  <Tarjeta :title="trabajoActual" :subtitle="tiempoLugarActual">{{ descripciónActual }}</Tarjeta>
  <Tarjeta :title="fullLeap" :subtitle="tiempoLugarLeap">{{ descripciónLeap }}</Tarjeta>
  <Tarjeta :title="becaLeap" :subtitle="tiempoLugarLeapBeca">{{ descripciónLeapBeca }}</Tarjeta>
</template>

<script setup lang="ts">
import Tarjeta from '../tools/Tarjeta.vue'

// Títulos
const trabajoActual = 'Delivery Analyst - Deloitte'
const fullLeap = 'Desarrollador full stack - EasyLeapp®'
const becaLeap = 'Becario - EasyLeapp®'

// Subtítulos
const tiempoLugarActual = '03/2023 – Actualidad | Sevilla, Andalucía, España'
const tiempoLugarLeap = '06/2022 – 10/2022 | Sevilla, Andalucía, España'
const tiempoLugarLeapBeca = '12/2021 – 06/2022 | Sevilla, Andalucía, España'

// Textos de los párrafos
const descripciónActual =
  'Como desarrollador Full Stack, en mi actual posición he destacado en liderazgo, relación con cliente, proactividad y apoyo a mis compañeros de proyecto. \
  Continúo formándome y aprendiendo del mismo, pero mi desempeño técnico ha sido completamente satisfactorio; adaptándome así, rápidamente, a un entorno \
  tecnológico tan cambiante y multidisciplinar como lo es el actual. Resumiendo brevemente, hago uso técnico de Java Spring Boot, Angular, PostgreSQL y AWS Cloud.'
const descripciónLeap =
  'Como desarrollador Full Stack, se me puso a cargo de la reestructuración de un CRM basándome en una plantilla de funcionalidades preestablecidas por \
  la directiva de la StartUp. Llevé a cabo la tarea con un resultado más que satisfactorio según la opinión de mis responsables. En el proyecto se hacía \
  uso de una arquitectura monolítica con PHP Laravel, JQuery y Vue, apoyado en una base de datos SQL básica.'
const descripciónLeapBeca =
  'Como becario se me formó en el uso de Laravel y Vue para que fuera capaz de comenzar la reestructuración del CRM de la empresa.'
</script>

<style></style>
