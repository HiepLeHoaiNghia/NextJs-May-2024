import { endOfMonth, isWithinInterval, startOfMonth } from 'date-fns'

import { type CalendarEvent } from '~/components/BigCalendar/types'

export const getVisibleEventsInCurrentMonth = (
  events: CalendarEvent[] | undefined,
  currentDateOfView: Date,
  showOutsideDays?: boolean
): CalendarEvent[] | undefined => {
  if (!showOutsideDays) {
    const startOfCurrentMonth = startOfMonth(currentDateOfView)
    const endOfCurrentMonth = endOfMonth(currentDateOfView)
    if (!events) return []
    return events.filter(
      (event) =>
        event.start && isWithinInterval(new Date(event.start), { start: startOfCurrentMonth, end: endOfCurrentMonth })
    )
  }
  return events
}
