import { type Locale } from 'date-fns/locale'

export type LocaleCode = 'en' | 'vi' | 'ja'

export interface CalendarMessages {
  date: string
  time: string
  event: string
  allDay: string
  week: string
  work_week: string
  day: string
  month: string
  previous: string
  next: string
  yesterday: string
  tomorrow: string
  today: string
  agenda: string
  showMore: string
  noEventsInRange: string
}

export interface LanguageSelectItem {
  localeCode: string
  label: string
  icon?: JSX.Element
}

export interface LanguageSelector {
  selectorPlaceholder?: string
  languageSelectorMenu: LanguageSelectItem[]
}

export interface CalendarDialog {
  saveBtn: string
  cancelBtn: string
  deleteBtn: string
  enableEditModeBtn: string
  editEventTitle: string
  createEventTitle: string
  editEventDescription: string
  createEventDescription: string
}

export interface CalendarForm {
  requestType: {
    label: string
    placeholder: string
    selectItems: Record<string, string>
  }
  requestStatus: {
    label: string
    placeholder: string
    selectItems: Record<string, string>
  }
  title: {
    label: string
    placeholder: string
  }
  description: {
    label: string
    placeholder: string
  }
  startDate: {
    label?: string
    placeholder?: string
  }
  endDate: {
    label?: string
    placeholder?: string
  }
  timeSelect: {
    label?: string
  }
  [key: string]: Record<string, unknown>
}

export interface CommonTranslations {
  createEventButton: string
  timePicker: {
    periodSelectorItems: PeriodSelectorItem[]
  }
}

export interface TranslateMessages {
  calendarMessages: CalendarMessages
  languageSelector: LanguageSelector
  calendarDialog: CalendarDialog
  calendarForm: CalendarForm
  common: CommonTranslations
}

export interface PeriodSelectorItem {
  value: string
  label: string
}

export type LanguageConfig = {
  [Key in LocaleCode]: {
    translation: TranslateMessages
    locale: Locale
  }
}
