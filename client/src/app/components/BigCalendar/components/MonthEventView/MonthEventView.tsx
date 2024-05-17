'use client'

import { type ComponentType } from 'react'
import { type EventProps } from 'react-big-calendar'
import { endOfMonth, isWithinInterval, startOfMonth } from 'date-fns'

import { type CalendarEvent } from '~/app/components/BigCalendar/types'

export type MonthEventViewProps = Partial<EventProps<CalendarEvent>> & {
  event: CalendarEvent
  currentDateOfView?: Date
  showOutsideDays?: boolean
}

const MonthEventView: ComponentType<MonthEventViewProps> = ({ currentDateOfView, showOutsideDays, event }) => {
  if (currentDateOfView && !showOutsideDays) {
    const startOfCurrentMonth = startOfMonth(currentDateOfView)
    const endOfCurrentMonth = endOfMonth(currentDateOfView)
    if (
      event.start !== undefined &&
      !isWithinInterval(event.start, { start: startOfCurrentMonth, end: endOfCurrentMonth })
    ) {
      return null
    }
  }

  return <div>{event.title}</div>
}

export { MonthEventView }
