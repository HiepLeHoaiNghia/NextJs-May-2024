import { type Locale } from 'date-fns'

import { type LanguageConfig } from '~/components/BigCalendar/types'

export const getLocalesLanguageConfig = (languageConfig: LanguageConfig) =>
  Object.entries(languageConfig).reduce((acc: Record<string, Locale>, [lang, config]) => {
    return {
      ...acc,
      [lang]: config.locale
    }
  }, {})

export const convertEnumToArray = (numberEnum: Record<string, string | number>, type: 'number' | 'string') => {
  return Object.values(numberEnum).filter((value) => {
    return typeof value === type
  })
}

export const convertEnumToObject = (enumObj: Record<string, string | number>) => {
  return Object.keys(enumObj)
    .filter((key) => !Number.isNaN(Number(key))) // Chỉ lấy các keys là số
    .map((numericKey) => {
      const stringKey = enumObj[numericKey] // Lấy chuỗi từ giá trị số
      return {
        key: numericKey, // Giữ giá trị số làm key
        value: stringKey // Giữ chuỗi làm value
      }
    })
}
