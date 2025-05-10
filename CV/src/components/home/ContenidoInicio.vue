<template>
  <Parrafo :full-width="true">{{ presentacion }}</Parrafo>
  <div class="inline-images">
    <Imagen :src="logoUS" :alt="'Logo de la Universidad de Sevilla'" :width="'20%'"></Imagen>
    <Imagen
      :src="logoDeloitte"
      :alt="'Logo de la empresa Deloitte'"
      :align="'origin'"
      :width="'20%'"
    ></Imagen>
  </div>
  <Parrafo :full-width="true">{{ gustos }}</Parrafo>
  <Parrafo :full-width="true">{{ stacksBack }}</Parrafo>
  <div class="inline-images">
    <Imagen :src="logoJava" :alt="'Logo del lenguaje de programación Java'" :width="'10%'"></Imagen>
    <Imagen :src="logoGolang" :alt="'Logo del lenguaje de programación Go'" :width="'20%'"></Imagen>
    <Imagen :src="logoPSQL" :alt="'Logo de la BBDD PostgreSQL'" :width="'20%'"></Imagen>
    <Imagen
      :src="logoMongo"
      :alt="'Logo de la certificación de Associate Developer de BBDD MongoDB'"
      :width="'20%'"
    ></Imagen>
  </div>
  <Parrafo :full-width="true">{{ otrosStacks }}</Parrafo>
  <Parrafo :full-width="true" :show-divider="true">{{ despido }}</Parrafo>
  <Imagen
    :src="happySun"
    :alt="'Logo de la certificación de Associate Developer de BBDD MongoDB'"
    :width="'20%'"
  ></Imagen>
</template>

<script setup lang="ts">
import Parrafo from '../tools/Parrafo.vue'
import Imagen from '../tools/Imagen.vue'

// Textos de los párrafos
const presentacion =
  'Saludos. Soy Javier Gil Blázquez, graduado en Ingeniería Informática - Tecnologías Informáticas con mención en computación por la Universidad de Sevilla. \
  Actualmente trabajo en Deloitte como FullStack Developer en un equipo de mantenimiento y desarrollo dando soporte a otra gran empresa.'
const gustos =
  'Tengo muchos y variados hobbies. Me gusta aprender y a veces investigo profundamente sobre algunos temas; destacando entre estos algunos problemas \
  matemáticos o computacionales, como pueden ser los números primos o el problema P=NP, aunque he de confesar que me gustaría dedicarles más tiempo \
  de investigación. Así mismo, también siento interés personal por la IA y su concepción fundamental. Más allá de aquello relacionado con la computación \
  y matemáticas también me gustan cosas de gente normal, como jugar videojuegos, las series o el cine. También me gusta consumir historias a través de \
  libros. Hblando del apartado más físico, me gusta practicar determinados deportes siempre que tengo tiempo libre y he podido prepararme para la sesión. \
  Finalmente, en estos últimos tiempos he comenzado a refrescar y desarrollar mis dotes musicales, ya que me gustaría ser capaz de disfrutar algunas \
  partituras o canciones de forma más activa.'
const stacksBack =
  'En el apartado de stacks tecnológicos, actualmente me interesan varias herramientas para el desarrollo backend y sé manejarme con varias tecnologías \
  frontend, cloud, devops y BBDD. Enfocándome en este párrafo más en la tecnología del backend, que es en la que tengo mayor interés web, he revisado \
  los frameworks de Java Spring Boot y también Golang y asociados. En lo que a Spring Boot se refiere, el proyecto de soporte del que formo parte usa \
  esta tecnología y me estoy encargando de llevar a cabo una migración desde Spring 2.7 a 3.3, que es actualmente nuestra mejor opción para mantener \
  nuestros microservicios actualizados. También estoy desarrollando algún proyectillo más con este framework para revisar qué tal puede servirme para \
  una idea que tengo en desarrollo. De la misma forma, con Golang tengo intenciones de hacer una réplica parecida del mismo sistema que pretendo levantar \
  con Spring Boot, pero aún tengo que darme más tiempo de aprendizaje con este lenguaje y sus frameworks. A parte de aquello relacionado con Java o Go, \
  también me siento inclinado en parte al manejo de BBDD, ya sean SQL o NoSQL. En este aspecto, trabajo con PostgreSQL y tengo la certificación oficial \
  de MongoDB.'
const otrosStacks =
  'Continuando con las tecnologías o stacks, me gustaría comentar brevemente mi perspectiva o experiencia con otras herramientas que se usan en este \
  oficio. Empezando por referenciar esta misma página web. Esta página está creada con un poco de código HTML5, CSS y componentes desarrollados con \
  Vue en su versión 3 y acompañado del lenguaje Typescript(TS); la decisión de usar TS es porque prefiero la claridad y orden que entrega en comparación \
  a su hermano mayor, o padre, Javascript(JS). También trabajo con Angular y TS en el soporte del proyecto de Deloitte. Además, y aprovecho para enlazar \
  con el resto de tecnologías, usamos Jenkins para los despliegues, GitHub para el manejo de repos y todo el proyecto está integrado con AWS, por lo que\
  no soy ajeno al uso de lambdas, Gluejobs o la propia consola de AWS.'
const despido =
  'Creo que ya he expuesto toda la información aceptablemente relevante sobre mí para el propósito de esta web. Si gustas de saber algo más, te invito \
  a preguntarme. Gracias por tu interés y te deseo buen día.'

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
