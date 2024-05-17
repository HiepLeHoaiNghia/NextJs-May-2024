import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt',
  ja: 'Japanese',
}

const resources = {
  // LOGIN_EN, REQUEST_EN, STATUS_MESSAGES_EN.... => LÀ GÌ?????????????????????
  // en: {
  //   login: LOGIN_EN,
  //   request: REQUEST_EN,
  //   statusMessages: STATUS_MESSAGES_EN,
  // },
  // vi: {
  //   login: LOGIN_VI,
  //   request: REQUEST_VI,
  //   statusMessages: STATUS_MESSAGES_VI,
  // },
  // ja: {
  //   login: LOGIN_JA,
  //   request: REQUEST_JA,
  //   statusMessages: STATUS_MESSAGES_JA,
  // },
}

await i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  fallbackLng: 'vi',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
})
