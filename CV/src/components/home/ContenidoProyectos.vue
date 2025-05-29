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
        >{{ $t('projects.portable') }}</a
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
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t, locale } = useI18n()

// Títulos
const tfg = 'Adversarial-Search-Haskell'
const automatasHaskell = 'Fractals-with-celular-automatas - Haskell'
const automatasJava = 'Fractals-with-celular-automatas - Java'

// Subtítulos
const breveTfg = computed(() => t('projects.btfg'))
const breveAH = computed(() => t('projects.bah'))
const breveAJ = computed(() => t('projects.baj'))

// Textos de los párrafos
const descripciónTfg = computed(() => t('projects.dtfg'))
const descripciónAH = computed(() => t('projects.dah'))
const descripciónAJ = computed(() => t('projects.daj'))
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
