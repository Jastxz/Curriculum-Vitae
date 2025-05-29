<template>
  <Lista :items="blandas" :title="tituloB" :bordered="true" :with-divider="true"></Lista>
  <br />
  <Lista :items="duras" :title="tituloD" :bordered="true" :with-divider="true"></Lista>
</template>

<script setup lang="ts">
import Lista from '../tools/Lista.vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t, locale } = useI18n()

// Títulos
const tituloB = computed(() => t('skills.tituloB'))
const tituloD = computed(() => t('skills.tituloD'))

// Lista de habilidades blandas
const blandasS = computed(() => t('skills.blandasS'))
const blandasP = computed(() => t('skills.blandasP'))
const blandasT = computed(() => t('skills.blandasT'))
const blandasF = computed(() => t('skills.blandasF'))
const blandasB = computed(() => t('skills.blandasB'))
const blandasI = computed(() => t('skills.blandasI'))
const blandas: string[] = [
  blandasS.value,
  blandasP.value,
  blandasT.value,
  blandasF.value,
  blandasB.value,
  blandasI.value,
]

// Lista de habilidades duras
const durasL = computed(() => t('skills.durasL'))
const durasF = computed(() => t('skills.durasF'))
const durasB = computed(() => t('skills.durasB'))
const durasS = computed(() => t('skills.durasS'))
const durasAu = computed(() => t('skills.durasAu'))
const durasAP = computed(() => t('skills.durasAP'))
const durasD = computed(() => t('skills.durasD'))
const durasH = computed(() => t('skills.durasH'))
const duras: string[] = [
  durasL.value,
  durasF.value,
  durasB.value,
  durasS.value,
  durasAu.value,
  durasAP.value,
  durasD.value,
  durasH.value,
]
</script>

<style></style>
