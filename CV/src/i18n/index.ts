// src/i18n/index.ts
import { createI18n } from 'vue-i18n'

// Importar archivos de traducción
import es from './locales/es.json'
import en from './locales/en.json'

const messages = {
  es,
  en,
}

// Detectar idioma del navegador o usar español por defecto
const getDefaultLocale = (): string => {
  const stored = localStorage.getItem('locale')
  if (stored) return stored

  const browserLocale = navigator.language.split('-')[0]
  return messages[browserLocale as keyof typeof messages] ? browserLocale : 'es'
}

const i18n = createI18n({
  legacy: false, // Usar Composition API
  locale: getDefaultLocale(),
  fallbackLocale: 'es',
  messages: messages as any,
  globalInjection: true, // Para usar $t en templates
})

export default i18n

// Función helper para cambiar idioma
export const setLocale = (locale: string) => {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.setAttribute('lang', locale)
}
