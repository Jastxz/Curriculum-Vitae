<template>
  <Parrafo :centered="true" :full-width="true">{{ presentacion }}</Parrafo>
  <div class="inline-images">
    <Imagen
      :src="logoUS"
      :alt="'Logo de la Universidad de Sevilla'"
      :width="'20%'"
    ></Imagen>
    <Imagen
      :src="logoDeloitte"
      :alt="'Logo de la empresa Deloitte'"
      :align="'origin'"
      :width="'20%'"
    ></Imagen>
  </div>
  <Parrafo :centered="true" :full-width="true">{{ gustos }}</Parrafo>
  <Parrafo :centered="true" :full-width="true">{{ stacksBack }}</Parrafo>
  <Parrafo :centered="true" :full-width="true">{{ otrosStacks }}</Parrafo>
  <Parrafo :centered="true" :show-divider="true">{{ despido }}</Parrafo>
</template>

<script setup lang="ts">
import Parrafo from '../tools/Parrafo.vue'
import Imagen from '../tools/Imagen.vue'

// Textos de los párrafos
const presentacion =
  'Saludos. Soy Javier Gil Blázquez, graduado en Ingeniería Informática - Tecnologías Informáticas con mención en computación y trabajo actualmente en Deloitte.'
const gustos =
  'Me gusta aprender, jugar videojuegos, la pequeña y gran pantalla, leer y practicar deporte o aprender música siempre que puedo y me parece.'
const stacksBack =
  'Me interesan las tecnologías Backend con Java y últimamente también Golang. Me interesa también el manejo del dato en BBDD, ya sean relacionales (Postgre) o no relacionales (MongoDB).'
const otrosStacks =
  'Asimismo estoy acostumbrado a utilizar tecnologías Frontend (Angular, Vue, Typescript) para cumplir con el rol de Full Stack y tecnologías Cloud (AWS).'
const despido =
  'Si gustas de saber algo más te invito a preguntarme. Gracias por tu interés y te deseo buen día.'

// URLs de imágenes usadas
const logoUS = 'https://res.cloudinary.com/dwofrdjn5/image/upload/v1746643404/Logo_US_pvc1mc.png'
const logoDeloitte = 'https://res.cloudinary.com/dwofrdjn5/image/upload/v1746644264/DB260D6C-D7E3-47AF-AE349C22E27B795E_Wauto_H300_iwyavm.png'
</script>

<style>
.inline-images {
    display: inline-flex;
}
</style>
