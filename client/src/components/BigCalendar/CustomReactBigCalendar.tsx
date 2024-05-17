'use client'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import './styles/BigCalendar.scss'

import { useCallback, useMemo } from 'react'
import {
  Calendar,
  type CalendarProps,
  type Components,
  dateFnsLocalizer,
  type Event,
  type EventPropGetter,
  type SlotInfo,
  type View
} from 'react-big-calendar'
import { useTranslation } from 'react-i18next'
import {
  endOfDay,
  endOfMonth,
  format,
  getDay,
  isWithinInterval,
  parse,
  startOfDay,
  startOfMonth,
  startOfWeek
} from 'date-fns'

import { Button } from '~/@shadcn/components/ui/button'
import { cn } from '~/@shadcn/utils'
import {
  CalendarDialog,
  type CalendarDialogProps
} from '~/components/BigCalendar/components/CalendarDialog/CalendarDialog'
import {
  CommonEventView,
  type CommonEventViewProps
} from '~/components/BigCalendar/components/CommonEventView/CommonEventView'
import { CustomToolBar, type CustomToolBarProps } from '~/components/BigCalendar/components/CustomToolBar/CustomToolBar'
import {
  type CustomDateCellHeaderProps,
  DateCellHeader
} from '~/components/BigCalendar/components/DateCellHeader/DateCellHeader'
import {
  type CustomDateCellWrapperProps,
  DateCellWrapper
} from '~/components/BigCalendar/components/DateCellWrapper/DateCellWrapper'
import {
  EventWrapperView,
  type EventWrapperViewProps
} from '~/components/BigCalendar/components/EventWrapperView/EventWrapperView'
import { LanguageSelector } from '~/components/BigCalendar/components/LanguageSelector/LanguageSelector'
import {
  MonthEventView,
  type MonthEventViewProps
} from '~/components/BigCalendar/components/MonthEventView/MonthEventView'
import { resources } from '~/components/BigCalendar/config/i18n'
import { useCalendarContext } from '~/components/BigCalendar/context/BigCalendarContext'
import {
  type CalendarEvent,
  DialogAction,
  DialogType,
  type EventColorClassSettings
} from '~/components/BigCalendar/types'
import { getLocalesLanguageConfig } from '~/components/BigCalendar/utils'
import { RequestStatus, type RequestType } from '~/core/enums'

export type CustomReactBigCalendarProps = Partial<CalendarProps<CalendarEvent>> & {
  views?: View[]
  bigCalendarClassName?: string
  CalendarDialogComponent?: React.ComponentType<CalendarDialogProps>
  components?: Components<CalendarEvent>
  eventPropGetter?: EventPropGetter<CalendarEvent>
  eventColorClassSettings?: EventColorClassSettings<RequestType>
}

export const CustomReactBigCalendar = ({
  views = ['month', 'week', 'day', 'agenda', 'work_week'],
  bigCalendarClassName,
  CalendarDialogComponent = CalendarDialog,
  components,
  eventPropGetter,
  eventColorClassSettings,
  ...props
}: CustomReactBigCalendarProps) => {
  const {
    currentLanguage,
    selectedEvent,
    setSelectedEvent,
    setDialogState,
    events,
    languageConfig,
    weekStartsOn,
    showOutsideDays,
    languageSelector,
    createEventButton,
    currentDateOfView,
    setCurrentDateOfView
  } = useCalendarContext()
  const { t } = useTranslation()

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // Prevent selecting past dates
    // if (isBefore(startOfDay(new Date(slotInfo.start)), startOfDay(new Date()))) {
    //   return
    // }

    if (!showOutsideDays) {
      const startOfCurrentMonth = startOfMonth(currentDateOfView)
      const endOfCurrentMonth = endOfMonth(currentDateOfView)

      if (!isWithinInterval(new Date(slotInfo.start), { start: startOfCurrentMonth, end: endOfCurrentMonth })) {
        return
      }
    }

    setDialogState({
      dialogMode: DialogAction.open,
      dialogType: DialogType.createEvent
    })

    const start = startOfDay(new Date(slotInfo.start))

    const end = endOfDay(new Date(slotInfo.end))

    setSelectedEvent({ start, end })
  }

  const handleOpenCreateDialog = () => {
    setDialogState({
      dialogMode: DialogAction.open,
      dialogType: DialogType.createEvent
    })

    const start = startOfDay(new Date())

    const end = endOfDay(new Date())

    setSelectedEvent({ start, end })
  }

  const handleSelectEvent = (event: Event) => {
    setDialogState({
      dialogMode: DialogAction.open,
      dialogType: DialogType.showEvent
    })
    setSelectedEvent(event as CalendarEvent)
  }

  const calendarMessages = useMemo(() => {
    const messages =
      languageConfig?.[currentLanguage].translation.calendarMessages ??
      resources[currentLanguage].translation.calendarMessages

    return {
      ...messages,
      showMore: (count: number) => `...${String(count)} ${t('calendarMessages.showMore')}`
    }
  }, [currentLanguage, languageConfig, t])

  const localizer = useMemo(() => {
    const locales = languageConfig ? getLocalesLanguageConfig(languageConfig) : {}
    return dateFnsLocalizer({
      format,
      parse,
      startOfWeek: () => startOfWeek(new Date(), { weekStartsOn }),
      getDay,
      locales
    })
  }, [languageConfig, weekStartsOn])

  const handleOnNavigate = (date: Date) => {
    setCurrentDateOfView(date)
  }

  const renderEventWrapperView = useMemo(() => {
    return ({ event, children }: EventWrapperViewProps) => (
      <EventWrapperView currentDateOfView={currentDateOfView} showOutsideDays={showOutsideDays} event={event}>
        {children}
      </EventWrapperView>
    )
  }, [currentDateOfView, showOutsideDays])

  const renderCellDateHeader = useMemo(() => {
    return ({ label, isOffRange, onDrillDown }: CustomDateCellHeaderProps) => (
      <DateCellHeader
        showOutsideDays={showOutsideDays}
        isOffRange={isOffRange}
        label={label}
        onDrillDown={onDrillDown}
      />
    )
  }, [showOutsideDays])

  const renderDateCellWrapper = useMemo(() => {
    return ({ value, children }: CustomDateCellWrapperProps) => (
      <DateCellWrapper currentDateOfView={currentDateOfView} showOutsideDays={showOutsideDays} value={value}>
        {children}
      </DateCellWrapper>
    )
  }, [currentDateOfView, showOutsideDays])

  const renderCommonEventView = useMemo(() => {
    return ({ event }: CommonEventViewProps) => <CommonEventView event={event as CalendarEvent} />
  }, [])

  const renderMonthEventView = useMemo(() => {
    return ({ event }: MonthEventViewProps) => (
      <MonthEventView event={event} currentDateOfView={currentDateOfView} showOutsideDays={showOutsideDays} />
    )
  }, [currentDateOfView, showOutsideDays])

  const renderCustomToolbar = useMemo(() => {
    return (toolBarProps: CustomToolBarProps) => <CustomToolBar {...toolBarProps} />
  }, [])

  const defaultComponents: Components<CalendarEvent> = useMemo(() => {
    return {
      eventWrapper: renderEventWrapperView,
      dateCellWrapper: renderDateCellWrapper,
      month: {
        dateHeader: renderCellDateHeader,
        event: renderMonthEventView
      },
      agenda: {
        event: renderCommonEventView
      },
      day: {
        event: renderCommonEventView
      },
      week: {
        event: renderCommonEventView
      },
      toolbar: renderCustomToolbar
    }
  }, [
    renderEventWrapperView,
    renderDateCellWrapper,
    renderCellDateHeader,
    renderMonthEventView,
    renderCommonEventView,
    renderCustomToolbar
  ])

  const defaultEventPropGetter = useCallback(
    (event: Event, _: Date, __: Date, isSelected: boolean) => {
      const requestStatusToColorMap: EventColorClassSettings<RequestStatus> = eventColorClassSettings ?? {
        [RequestStatus.pending]: '!bg-sky-600',
        [RequestStatus.approved]: '!bg-emerald-500',
        [RequestStatus.rejected]: '!bg-rose-600'
      }
      const { requestStatus } = event as CalendarEvent

      const colorClass = requestStatus !== undefined ? requestStatusToColorMap[requestStatus as RequestStatus] : ''

      return {
        className: cn({
          [colorClass]: true,
          '!bg-slate-400': isSelected
        })
      }
    },
    [eventColorClassSettings]
  )

  return (
    <div className='my-4 flex flex-col items-center gap-4'>
      <div className='flex w-full items-center justify-between px-4'>
        <div className='flex-1' />
        {languageSelector && <LanguageSelector className='mx-auto max-w-48 flex-1' />}
        <div className='flex flex-1 justify-end'>
          {createEventButton && <Button onClick={handleOpenCreateDialog}>{t('common.createEventButton')}</Button>}
        </div>
      </div>
      <Calendar
        className={cn('w-full px-4', bigCalendarClassName)}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onNavigate={handleOnNavigate}
        eventPropGetter={eventPropGetter || defaultEventPropGetter}
        messages={calendarMessages}
        components={components || defaultComponents}
        drilldownView='day'
        selectable
        events={events}
        views={views}
        style={{ height: 1000 }}
        {...props}
        localizer={localizer}
        culture={currentLanguage}
      />
      {selectedEvent && <CalendarDialogComponent />}
    </div>
  )
}
