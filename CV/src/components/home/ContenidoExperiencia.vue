<template>
  <Tarjeta :title="trabajoActual" :subtitle="tiempoLugarActual">{{ descripciónActual }}</Tarjeta>
  <Tarjeta :title="fullLeap" :subtitle="tiempoLugarLeap">{{ descripciónLeap }}</Tarjeta>
  <Tarjeta :title="becaLeap" :subtitle="tiempoLugarLeapBeca">{{ descripciónLeapBeca }}</Tarjeta>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Tarjeta from '../tools/Tarjeta.vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// Títulos
const trabajoActual = computed(() => t('experience.actual'))
const fullLeap = computed(() => t('experience.fullL'))
const becaLeap = computed(() => t('experience.becL'))

// Subtítulos
const tiempoLugarActual = computed(() => t('experience.tiempoA'))
const tiempoLugarLeap = computed(() => t('experience.tiempoL'))
const tiempoLugarLeapBeca = computed(() => t('experience.tiempoLB'))

// Textos de los párrafos
const descripciónActual = computed(() => t('experience.descA'))
const descripciónLeap = computed(() => t('experience.descL'))
const descripciónLeapBeca = computed(() => t('experience.descLB'))
</script>

<style></style>
