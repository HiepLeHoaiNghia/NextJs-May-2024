import { format, setHours, setMinutes } from 'date-fns'

import { type LimitTimeRanges, type TimeManagementSettings } from '~/app/components/BigCalendar/types'
import { RequestType } from '~/app/core/enums'

// Hàm để tạo nhãn thời gian
const createTimeLabel = (hour: number, minute: number): string => {
  const newDate = setHours(setMinutes(new Date(), minute), hour)
  return format(newDate, 'HH:mm')
}

// Hàm để tạo nhãn thời gian cho một giờ cụ thể
const createTimeLabelsForHour = (
  hour: number,
  startMinute: number,
  endMinute: number,
  minuteStep: number
): string[] => {
  const timeLabels: string[] = []
  for (let minute = startMinute; minute <= endMinute; minute += minuteStep) {
    timeLabels.push(createTimeLabel(hour, minute))
  }
  return timeLabels
}

const createTimeLabelsForRange = (
  range: LimitTimeRanges,
  minuteStep: number,
  pickerType: 'from' | 'to',
  request: RequestType
): string[] => {
  let timeLabels: string[] = []
  for (let { hour } = range.from; hour <= range.to.hour; hour++) {
    const isLastHour = hour === range.to.hour
    const startMinute = hour === range.from.hour ? range.from.minute : 0
    const endMinute = isLastHour ? range.to.minute : 59

    timeLabels = [...timeLabels, ...createTimeLabelsForHour(hour, startMinute, endMinute, minuteStep)]

    if (isLastHour && endMinute % minuteStep !== 0) {
      timeLabels.push(createTimeLabel(hour, endMinute))
    }
  }

  if (request === RequestType.overtime) {
    if (pickerType === 'from') {
      timeLabels.pop() // Remove last element for 'from' picker
    } else {
      timeLabels.shift() // Remove first element for 'to' picker
    }
  }

  return timeLabels
}

const generateDefaultHourOptions = (minuteStep: number): string[] => {
  return Array.from({ length: 24 }, (_, i) => {
    return Array.from({ length: 60 / minuteStep }, (__, j) => {
      const minutes = j * minuteStep
      return format(setMinutes(setHours(new Date(), i), minutes), 'HH:mm')
    })
  }).flat()
}

export const generateHourOptions = ({
  selectedDate,
  minuteStep = 10,
  requestType,
  settings,
  pickerType
}: {
  selectedDate?: Date
  minuteStep?: number
  requestType?: RequestType
  settings?: TimeManagementSettings<RequestType>
  pickerType?: 'from' | 'to'
}) => {
  if (!settings || typeof requestType === 'undefined') {
    return generateDefaultHourOptions(minuteStep)
  }

  const applicableSettings = settings.find((setting) => setting.type.includes(requestType))

  if (!applicableSettings) {
    return []
  }

  return applicableSettings.timeRanges.flatMap((range) => {
    if (pickerType === 'from' || !selectedDate || requestType !== RequestType.overtime) {
      return createTimeLabelsForRange(range, minuteStep, 'from', requestType)
    }

    if (pickerType === 'to') {
      const fromHour = selectedDate.getHours()
      const fromMinute = selectedDate.getMinutes()
      if (
        fromHour >= range.from.hour &&
        (fromHour < range.to.hour || (fromHour === range.to.hour && fromMinute <= range.to.minute))
      ) {
        return createTimeLabelsForRange(range, minuteStep, 'to', requestType)
      }
    }

    return []
  })
}
