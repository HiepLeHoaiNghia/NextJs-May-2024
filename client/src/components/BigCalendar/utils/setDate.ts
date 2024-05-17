import { isAfter, isBefore, isEqual, isWithinInterval, setHours, setMinutes, startOfDay } from 'date-fns'

import { type CalendarEvent, type LimitTimeRanges, type TimeManagementSettings } from '~/components/BigCalendar/types'
import { RequestType } from '~/core/enums'

export const setWorkingTime = (time?: Date, hour = 0, minute = 0): Date | undefined => {
  if (!time) return undefined

  const adjustedTime = new Date(time)
  adjustedTime.setHours(hour, minute, 0, 0)
  return adjustedTime
}

function findLimitTimeRanges(
  time: Date,
  ranges: LimitTimeRanges[]
): { from: { hour: number; minute: number }; to: { hour: number; minute: number } } | undefined {
  return ranges.find((range) => {
    const fromTime = setWorkingTime(time, range.from.hour, range.from.minute)
    const toTime = setWorkingTime(time, range.to.hour, range.to.minute)
    return fromTime && toTime && fromTime <= time && time <= toTime
  })
}

export const clampTimeToLimitedRange = ({
  selectedDay,
  timeRange,
  pickerType,
  timeManagementSettings,
  requestType,
  step = 30
}: {
  selectedDay: Date
  timeRange: {
    from: CalendarEvent['start'] | undefined
    to: CalendarEvent['end'] | undefined
  }
  pickerType: 'from' | 'to'
  timeManagementSettings: TimeManagementSettings<RequestType>
  requestType: RequestType | undefined
  step?: number
}): { from: CalendarEvent['start']; to: CalendarEvent['end'] } => {
  const initialFrom = timeRange.from ? new Date(timeRange.from) : undefined
  const initialTo = timeRange.to ? new Date(timeRange.to) : undefined

  if (!initialFrom || !initialTo || requestType === undefined) {
    return { from: initialFrom, to: initialTo }
  }

  const applicableSettings = timeManagementSettings.find((setting) => setting.type.includes(requestType))

  if (!applicableSettings?.timeRanges) {
    return { from: initialFrom, to: initialTo }
  }

  let newFrom = pickerType === 'from' ? new Date(selectedDay) : initialFrom
  let newTo = pickerType === 'to' ? new Date(selectedDay) : initialTo

  if (applicableSettings.type.includes(RequestType.overtime)) {
    const fromRange = findLimitTimeRanges(newFrom, applicableSettings.timeRanges)

    if (!fromRange) {
      return { from: newFrom, to: newTo }
    }

    const toTime = setWorkingTime(newTo, fromRange.to.hour, fromRange.to.minute)
    const newToFromRange = setWorkingTime(newTo, fromRange.from.hour, fromRange.from.minute)

    if (!toTime || !newToFromRange) {
      return { from: newFrom, to: newTo }
    }

    if (newTo > toTime || newTo < newToFromRange) {
      newTo = toTime
    }

    const toLimitTime = setWorkingTime(newTo, fromRange.to.hour, fromRange.to.minute)

    if (toLimitTime && newTo.getTime() > toLimitTime.getTime()) {
      newTo = toLimitTime
      newFrom = new Date(newTo.getTime() - step * 60000)
    }

    if (newFrom.getTime() === newTo.getTime()) {
      newTo = new Date(newFrom.getTime() + step * 60000)
    }

    if (newFrom.getDate() !== newTo.getDate()) {
      if (pickerType === 'from') {
        newTo = new Date(newFrom)
        newTo.setHours(newFrom.getHours(), 0)
      } else {
        newFrom = new Date(newTo)
        newFrom.setHours(newTo.getHours(), 0)
      }
    }

    if (newFrom.getTime() > newTo.getTime()) {
      ;[newFrom, newTo] = [newTo, newFrom]
    }
  } else {
    if (isEqual(newFrom, newTo)) {
      const endTimeLimit = applicableSettings.timeRanges
        .map((range) => setWorkingTime(newTo, range.to.hour, range.to.minute))
        .find((limitTime) => limitTime && isEqual(newTo, limitTime))

      if (endTimeLimit) {
        newFrom = new Date(endTimeLimit.getTime() - step * 60000)
      } else {
        newTo = new Date(newFrom.getTime() + step * 60000)
      }
    }

    if (isAfter(newFrom, newTo)) {
      ;[newFrom, newTo] = [newTo, newFrom]
    }
  }

  return { from: newFrom, to: newTo }
}

export const updateLimitTimeByRequestType = (
  event: CalendarEvent,
  requestType: RequestType,
  timeSettings: TimeManagementSettings<RequestType>
) => {
  const applicableSettings = timeSettings.find((setting) => setting.type.includes(requestType))

  const today = startOfDay(new Date())

  if (requestType !== RequestType.editTimeSheet && event.start && event.end) {
    if (isBefore(new Date(event.start), today) || isBefore(new Date(event.end), today)) {
      const newStart = setHours(setMinutes(today, new Date(event.start).getMinutes()), new Date(event.start).getHours())
      const newEnd = setHours(setMinutes(today, new Date(event.end).getMinutes()), new Date(event.end).getHours())
      return {
        ...event,
        start: newStart,
        end: newEnd
      }
    }
  }

  if (applicableSettings && event.start && event.end) {
    const currentTime = new Date()

    // Find the time range that the current time falls within
    const currentRange = applicableSettings.timeRanges.find(({ from, to }) => {
      const fromTime = setHours(setMinutes(currentTime, from.minute), from.hour)
      const toTime = setHours(setMinutes(currentTime, to.minute), to.hour)
      return isWithinInterval(currentTime, { start: fromTime, end: toTime })
    })

    // If the current time is within a time range, use that range. Otherwise, use the first range.
    const { from, to } = currentRange || applicableSettings.timeRanges[0]

    const sameEventDate = new Date(event.start)
    const start = setHours(setMinutes(new Date(sameEventDate), from.minute), from.hour)
    const end = setHours(setMinutes(new Date(sameEventDate), to.minute), to.hour)

    return {
      ...event,
      start,
      end
    }
  }

  return event
}
