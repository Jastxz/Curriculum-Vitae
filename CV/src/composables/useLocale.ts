// src/composables/useLocale.ts
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'

export interface LocaleOption {
  code: string
  name: string
  flag: string
}

export const useLocale = () => {
  const { locale, t } = useI18n()

  const availableLocales: LocaleOption[] = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ]

  const currentLocale = computed(() => locale.value)

  const currentLocaleInfo = computed(() => availableLocales.find((l) => l.code === locale.value))

  const changeLocale = async (newLocale: string) => {
    if (availableLocales.some((l) => l.code === newLocale)) {
      setLocale(newLocale)

      // Opcional: Recargar datos que dependan del idioma
      // await refreshData()
    }
  }

  /* const isRTL = computed(() => {
    // Añadir idiomas RTL si es necesario
    const rtlLanguages = ['ar', 'he', 'fa']
    return rtlLanguages.includes(locale.value)
  }) */

  return {
    locale: currentLocale,
    availableLocales,
    currentLocaleInfo,
    changeLocale,
    //isRTL,
    t,
  }
}
