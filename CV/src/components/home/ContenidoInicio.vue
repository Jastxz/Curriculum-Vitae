<template>
  <Parrafo :full-width="true">{{ presentacion }}</Parrafo>
  <div class="inline-images">
    <Imagen :src="logoUS" :alt="descripcionUS" :width="'20%'"></Imagen>
    <Imagen
      :src="logoDeloitte"
      :alt="descripcionDT"
      :align="'origin'"
      :width="'20%'"
    ></Imagen>
  </div>
  <Parrafo :full-width="true">{{ gustos }}</Parrafo>
  <Parrafo :full-width="true">{{ stacksBack }}</Parrafo>
  <div class="inline-images">
    <Imagen :src="logoJava" :alt="descripcionJ" :width="'10%'"></Imagen>
    <Imagen :src="logoGolang" :alt="descripcionGo" :width="'20%'"></Imagen>
    <Imagen :src="logoPSQL" :alt="descripcionPSQL" :width="'20%'"></Imagen>
    <Imagen
      :src="logoMongo"
      :alt="descripcionMDB"
      :width="'20%'"
    ></Imagen>
  </div>
  <Parrafo :full-width="true">{{ otrosStacks }}</Parrafo>
  <Parrafo :full-width="true" :show-divider="true">{{ despido }}</Parrafo>
  <Imagen
    :src="happySun"
    :alt="descripcionSun"
    :width="'20%'"
  ></Imagen>
</template>

<script setup lang="ts">
import Parrafo from '../tools/Parrafo.vue'
import Imagen from '../tools/Imagen.vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t, locale } = useI18n()

// Textos de los párrafos
const presentacion = computed(() => t('start.intro'))
const gustos = computed(() => t('start.hobbies'))
const stacksBack = computed(() => t('start.stacks'))
const otrosStacks = computed(() => t('start.otherStacks'))
const despido = computed(() => t('start.bye'))

// Descripciones de los logos
const descripcionUS = computed(() => t('start.descripcionUS'))
const descripcionDT = computed(() => t('start.descripcionDT'))
const descripcionJ = computed(() => t('start.descripcionJ'))
const descripcionGo = computed(() => t('start.descripcionGo'))
const descripcionPSQL = computed(() => t('start.descripcionPSQL'))
const descripcionMDB = computed(() => t('start.descripcionMDB'))
const descripcionSun = computed(() => t('start.descripcionSun'))

// URLs de imágenes usadas
const logoUS = 'https://res.cloudinary.com/dwofrdjn5/image/upload/v1746643404/Logo_US_pvc1mc.png'
const logoDeloitte =
  'https://res.cloudinary.com/dwofrdjn5/image/upload/v1746644264/DB260D6C-D7E3-47AF-AE349C22E27B795E_Wauto_H300_iwyavm.png'
const logoJava =
  'https://res.cloudinary.com/dwofrdjn5/image/upload/v1746886454/1200px-Java_programming_language_logo.svg_m1tme2.png'
const logoGolang =
  'https://res.cloudinary.com/dwofrdjn5/image/upload/v1746886479/1_i2skbfmDsHayHhqPfwt6pA_i9cxr4.png'
const logoPSQL =
  'https://res.cloudinary.com/dwofrdjn5/image/upload/v1746886493/1200px-Postgresql_elephant.svg_dc6pp3.png'
const logoMongo =
  'https://res.cloudinary.com/dwofrdjn5/image/upload/v1746886649/mongodb-associate-developer_p27k9v.png'
const happySun =
  'https://res.cloudinary.com/dwofrdjn5/image/upload/e_background_removal/f_png/v1746888064/642c1ab1618503bc1f8ebb7106612393_ljlqvw.jpg'
</script>

<style>
.inline-images {
  display: inline-flex;
}
</style>
