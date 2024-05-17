import type React from 'react'
import { type ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { resources } from '~/app/components/BigCalendar/config/i18n'
import dumpEvents from '~/app/components/BigCalendar/resource/events/dumpEvents'
import {
  type CalendarEvent,
  type DatePickerShape,
  DialogAction,
  type DialogState,
  type DisabledDatePickerSettings,
  type LanguageConfig,
  type LocaleCode,
  type TimeManagementSettings,
  type WeekStartsOn
} from '~/app/components/BigCalendar/types'
import { convertEnumToArray } from '~/app/components/BigCalendar/utils'
import { getVisibleEventsInCurrentMonth } from '~/app/components/BigCalendar/utils/getEvents'
import { RequestType } from '~/app/core/enums'

interface InternalBigCalendarContextType {
  currentLanguage: LocaleCode
  setCurrentLanguage: (newLanguage: LocaleCode) => void
  selectedEvent: CalendarEvent | null
  setSelectedEvent: (event: CalendarEvent | null) => void
  dialogState: DialogState
  setDialogState: (state: DialogState) => void
  isValidRequestType: boolean
  currentDateOfView: Date
  setCurrentDateOfView: (date: Date) => void
}

export interface ExternalBigCalendarContextType {
  monthYearSelector?: 'default' | 'select'
  disabledDatePickerSettings?: DisabledDatePickerSettings<RequestType>
  timeManagementSettings?: TimeManagementSettings<RequestType>
  createEventButton?: boolean
  datePickerShape?: DatePickerShape
  events?: CalendarEvent[]
  getCurrentLanguageToStorage?: () => LocaleCode
  saveCurrentLanguageToStorage?: (language: LocaleCode) => void
  languageConfig?: LanguageConfig
  weekStartsOn?: WeekStartsOn
  dateTimePickerHourStep?: number
  dateTimePickerMinuteStep?: number
  dateTimePickerSecondStep?: number
  dateTimePickerShowMinutes?: boolean
  dateTimePickerShowSeconds?: boolean
  dateTimePicker12HoursFormat?: boolean
  showOutsideDays?: boolean
  onGetEvents?: () => Promise<CalendarEvent[]>
  onCreateEvent?: (event: CalendarEvent) => Promise<CalendarEvent>
  onEditEvent?: (event: CalendarEvent) => Promise<CalendarEvent>
  onDeleteEvent?: (eventId: string | number) => Promise<void>
  languageSelector?: boolean
}

export type BigCalendarContextType = InternalBigCalendarContextType & ExternalBigCalendarContextType

const defaultContextValues = {
  currentLanguage: 'en' as LocaleCode,
  setCurrentLanguage: () => {},
  selectedEvent: null,
  setSelectedEvent: () => {},
  dialogState: { dialogMode: DialogAction.close, dialogType: null },
  setDialogState: () => {},
  isValidRequestType: false,
  currentDateOfView: new Date(),
  setCurrentDateOfView: () => {}
}

const CalendarContext = createContext<BigCalendarContextType>(defaultContextValues)

export const useCalendarContext: () => BigCalendarContextType = () => useContext(CalendarContext)

interface BigCalendarProviderProps extends Partial<BigCalendarContextType> {
  children: ReactNode
}

export const CalendarProvider: React.FC<BigCalendarProviderProps> = ({
  children,
  languageConfig = resources,
  getCurrentLanguageToStorage,
  saveCurrentLanguageToStorage,
  onGetEvents,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  ...props
}) => {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState<LocaleCode>('en')
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [dialogState, setDialogState] = useState<DialogState>({ dialogMode: DialogAction.close, dialogType: null })
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentDateOfView, setCurrentDateOfView] = useState(new Date())

  const visibleEvents = useMemo(() => {
    return getVisibleEventsInCurrentMonth(events, currentDateOfView, props.showOutsideDays)
  }, [events, currentDateOfView, props.showOutsideDays])

  const handleLanguageChange = useCallback(
    (newLanguage: LocaleCode) => {
      setCurrentLanguage(newLanguage)
      i18n.changeLanguage(newLanguage).catch((error: unknown) => console.error(String(error)))
      if (saveCurrentLanguageToStorage) {
        saveCurrentLanguageToStorage(newLanguage)
      } else {
        localStorage.setItem('language', newLanguage)
      }
    },
    [i18n, saveCurrentLanguageToStorage]
  )

  const handleGetCurrentLanguage = useCallback(() => {
    if (getCurrentLanguageToStorage) {
      return getCurrentLanguageToStorage()
    }
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && Object.keys(languageConfig).includes(savedLanguage)) {
      return savedLanguage as LocaleCode
    }
    // If the localStorage language is null or not found, set it to 'en' as default
    localStorage.setItem('language', 'en')
    return 'en'
  }, [getCurrentLanguageToStorage, languageConfig])

  useEffect(() => {
    // Check if the language is already set in the local storage, if not use default
    const savedLanguage = handleGetCurrentLanguage()

    if (savedLanguage !== currentLanguage) {
      handleLanguageChange(savedLanguage)
    }
  }, [handleLanguageChange, currentLanguage, handleGetCurrentLanguage])

  useEffect(() => {
    if (onGetEvents && onCreateEvent && onEditEvent && onDeleteEvent) {
      onGetEvents()
        .then(setEvents)
        .catch((error: unknown) => console.error(String(error)))
    } else {
      setEvents(dumpEvents)
    }
  }, [onGetEvents, onCreateEvent, onEditEvent, onDeleteEvent])

  const handleCreateEvent = useCallback(
    async (event: CalendarEvent): Promise<CalendarEvent> => {
      if (onCreateEvent) {
        const newEvent = await onCreateEvent(event)
        setEvents((prevEvents) => [...prevEvents, newEvent])
        return newEvent
      }
      const createdEvent = { ...event, id: Math.random() }
      setEvents((prevEvents) => [...prevEvents, createdEvent])
      return createdEvent
    },
    [onCreateEvent]
  )

  const handleUpdateEvent = useCallback(
    async (event: CalendarEvent): Promise<CalendarEvent> => {
      if (onEditEvent) {
        const updatedEvent = await onEditEvent(event)
        setEvents((prevEvents) => prevEvents.map((e) => (e.id === event.id ? updatedEvent : e)))
      } else {
        setEvents((prevEvents) => prevEvents.map((e) => (e.id === event.id ? event : e)))
      }
      return event
    },
    [onEditEvent]
  )

  const handleDeleteEvent = useCallback(
    async (eventId: string | number) => {
      if (onDeleteEvent) {
        await onDeleteEvent(eventId)
        setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId))
      } else {
        setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId))
      }
    },
    [onDeleteEvent]
  )

  const validRequestType = convertEnumToArray(RequestType, 'number')

  const isValidRequestType: boolean = useMemo(() => {
    return selectedEvent?.requestType !== undefined && validRequestType.includes(selectedEvent.requestType)
  }, [selectedEvent, validRequestType])

  const contextValue = useMemo(
    () => ({
      ...defaultContextValues,
      ...props,
      monthYearSelector: props.monthYearSelector || 'select',
      isValidRequestType,
      currentLanguage,
      setCurrentLanguage: handleLanguageChange,
      selectedEvent,
      setSelectedEvent,
      dialogState,
      setDialogState,
      currentDateOfView,
      setCurrentDateOfView,
      disabledDatePickerSettings: props.disabledDatePickerSettings || {
        [RequestType.editTimeSheet]: [],
        [RequestType.paidLeave]: [{ before: new Date() }],
        [RequestType.unpaidLeave]: [{ before: new Date() }],
        [RequestType.remoteWork]: [{ before: new Date() }],
        [RequestType.overtime]: [{ before: new Date() }]
      },
      weekStartsOn: props.weekStartsOn || 1,
      languageConfig,
      dateTimePickerHourStep: props.dateTimePickerHourStep || 1,
      dateTimePickerMinuteStep: props.dateTimePickerMinuteStep || 30,
      dateTimePickerSecondStep: props.dateTimePickerSecondStep || 60,
      dateTimePickerShowMinutes: props.dateTimePickerShowMinutes ?? true,
      dateTimePickerShowSeconds: props.dateTimePickerShowSeconds ?? false,
      dateTimePicker12HoursFormat: props.dateTimePicker12HoursFormat ?? false,
      showOutsideDays: props.showOutsideDays,
      createEventButton: props.createEventButton ?? true,
      languageSelector: props.languageSelector ?? true,
      events: visibleEvents,
      onGetEvents,
      onCreateEvent: handleCreateEvent,
      onEditEvent: handleUpdateEvent,
      onDeleteEvent: handleDeleteEvent
    }),
    [
      props,
      isValidRequestType,
      currentLanguage,
      handleLanguageChange,
      selectedEvent,
      dialogState,
      currentDateOfView,
      languageConfig,
      visibleEvents,
      onGetEvents,
      handleCreateEvent,
      handleUpdateEvent,
      handleDeleteEvent
    ]
  )

  return <CalendarContext.Provider value={contextValue}>{children}</CalendarContext.Provider>
}
