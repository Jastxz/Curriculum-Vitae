<template>
  <Lista
    :items="blandas"
    :title="'Habilidades blandas'"
    :bordered="true"
    :with-divider="true"
  ></Lista>
  <br>
  <Lista
    :items="duras"
    :title="'Habilidades duras'"
    :bordered="true"
    :with-divider="true"
  ></Lista>
</template>

<script setup lang="ts">
import Lista from '../tools/Lista.vue'

const blandas: string[] = [
  'Solvencia: He demostrado ser capaz de resolver los problemas que presentaba el proyecto. Aún bajo presión.',
  'Proactivo: Soy responsable de mi tiempo de trabajo y sé lo que tengo que hacer. Y si no conozco mi objetivo \
  o tengo problemas con las prioridades, me apoyo en mi jefe de quipo.',
  'Tenaz: No cedo fácilmente ante los problemas que presente el proyecto y tengo gran tolerancia a la frustración, lo que me \
  permite mantener la calma en situaciones de estrés y tensión.',
  'Flexible: Soy capaz de adaptarme al proyecto y sus necesidades. Así sea que el proyecto sea en grupo o individual, tenga \
  tecnologías más antiguas o más actuales o necesite una refactorización completa, mantenimiento o simple desarrollo.',
  'Buenas prácticas: Soy conocedor de buenas prácticas desarrollando y colaborando en equipo. Procuro que mi código sea lo \
  más limpio posible de partida y luego refactorizo, o propongo refactorizar, si es necesario. He usado prácticas Ágiles \
  con Jira y ServiceNow.',
  'Idiomas: Español nativo. Inglés B2.',
]
const duras: string[] = [
    'Lenguajes de programación: Java(alto), Python(medio), Go(bajo), PHP(bajo), TypeScript/Javascript(medio).',
    'Frameworks y bibliotecas: Spring(medio), Laravel(bajo).',
    'Bases de datos: MySQL(medio), PostgreSQL(medio), MongoDB(alto).',
    'Sistemas de gestión de BBDD: Hibernate(medio).',
    'Autenticación y autorización: OAuth(bajo), JWT(bajo).',
    'APIs y microservicios: RESTful APIs(medio).',
    'Desarrollo de APIs: Swagger(medio), OpenAPI(medio).',
    'Herramientas de desarrollo: Git(medio), Kubernetes(bajo), Jenkins(bajo).'
]
</script>

<style></style>
