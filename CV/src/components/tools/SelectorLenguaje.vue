<!-- src/components/LanguageSelector.vue -->
<template>
  <div class="language-selector">
    <button @click="toggleDropdown" class="language-button" :class="{ active: isOpen }">
      <span class="flag">{{ currentLocaleInfo?.flag }}</span>
      <span class="name">{{ currentLocaleInfo?.name }}</span>
      <span class="arrow" :class="{ rotated: isOpen }">▼</span>
    </button>

    <div v-if="isOpen" class="dropdown" @click.stop>
      <button
        v-for="localeOption in availableLocales"
        :key="localeOption.code"
        @click="selectLanguage(localeOption.code)"
        class="dropdown-item"
        :class="{ active: localeOption.code === locale }"
      >
        <span class="flag">{{ localeOption.flag }}</span>
        <span class="name">{{ localeOption.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLocale } from '@/composables/useLocale'

const { locale, availableLocales, currentLocaleInfo, changeLocale } = useLocale()

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLanguage = async (localeCode: string) => {
  await changeLocale(localeCode)
  isOpen.value = false
}

const closeDropdown = (event: Event) => {
  if (!(event.target as Element)?.closest('.language-selector')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.language-selector {
  position: relative;
  display: inline-block;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  border: unset;
}

.arrow {
  transition: transform 0.2s;
  font-size: 12px;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: transparent;
  border: unset;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 4px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background: var(--selection-background-2);
}

.dropdown-item.active {
  background: var(--selection-background-2);
  font-weight: 500;
}

.flag {
  font-size: 16px;
}

.name {
  flex: 1;
  text-align: left;
}
</style>
