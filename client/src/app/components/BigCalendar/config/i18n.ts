import { initReactI18next } from 'react-i18next'
import { enUS as en, ja, vi } from 'date-fns/locale'
import i18n from 'i18next'

import { enTranslate, jaTranslate, viTranslate } from '~/app/components/BigCalendar/config/locales'
import { type LanguageConfig } from '~/app/components/BigCalendar/types'

export const resources: LanguageConfig = {
  en: {
    translation: enTranslate,
    locale: en
  },
  vi: {
    translation: viTranslate,
    locale: vi
  },
  ja: {
    translation: jaTranslate,
    locale: ja
  }
} as const

await i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
