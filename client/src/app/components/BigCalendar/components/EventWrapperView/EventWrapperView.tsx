'use client'

import { type ComponentType, type ReactNode } from 'react'
import { type EventWrapperProps } from 'react-big-calendar'
import { endOfMonth, isWithinInterval, startOfMonth } from 'date-fns'

import { type CalendarEvent } from '~/app/components/BigCalendar/types'

export type EventWrapperViewProps = Partial<EventWrapperProps<CalendarEvent>> & {
  currentDateOfView?: Date
  showOutsideDays?: boolean
  event: CalendarEvent
  children?: ReactNode
}

const EventWrapperView: ComponentType<EventWrapperViewProps> = ({
  currentDateOfView,
  showOutsideDays,
  event,
  children
}) => {
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
  return children
}

export { EventWrapperView }
