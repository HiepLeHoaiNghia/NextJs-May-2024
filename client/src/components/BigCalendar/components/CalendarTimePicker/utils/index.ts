import { type Period, type TimePickerType } from '~/components/BigCalendar/components/CalendarTimePicker/types'

/**
 * regular expression to check for valid hour format (01-23)
 */
export function validate24HourFormat(value: string) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value)
}

/**
 * regular expression to check for valid 12 hour format (01-12)
 */
export function validate12HoursFormat(value: string) {
  return /^(0[1-9]|1[0-2])$/.test(value)
}

/**
 * regular expression to check for valid minute format (00-59)
 */
export function ValidateMinutesOrSecond(value: string) {
  return /^[0-5][0-9]$/.test(value)
}

export function getValidNumberInRange(
  value: string,
  {
    max,
    min = 0,
    loop = false,
    step = 1
  }: {
    max: number
    min?: number
    loop?: boolean
    step?: number
  }
) {
  let numericValue = parseInt(value, 10)

  if (!Number.isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max
      if (numericValue < min) numericValue = min
    } else {
      if (numericValue > max) numericValue = min + ((numericValue - max - 1) % step)
      if (numericValue < min) numericValue = max - ((max - numericValue) % step)
    }
    return numericValue.toString().padStart(2, '0')
  }

  return '00'
}

export function getValid24Hour(value: string) {
  if (validate24HourFormat(value)) return value
  return getValidNumberInRange(value, { max: 23 })
}

export function getValid12Hours(value: string) {
  if (validate12HoursFormat(value)) return value
  return getValidNumberInRange(value, { min: 1, max: 12 })
}

export function getValidMinuteOrSecond(value: string) {
  if (ValidateMinutesOrSecond(value)) return value
  return getValidNumberInRange(value, { max: 59 })
}

export function getValidNumberByArrowKey(
  value: string,
  {
    min,
    max,
    step
  }: {
    min: number
    max: number
    step: number
  }
) {
  let numericValue = parseInt(value, 10)
  if (!Number.isNaN(numericValue)) {
    numericValue += step
    return getValidNumberInRange(String(numericValue), { min, max, loop: true })
  }
  return '00'
}

export function getValid24HourByArrowKey(value: string, step: number) {
  return getValidNumberByArrowKey(value, { min: 0, max: 23, step })
}

export function getValid12HoursByArrowKey(value: string, step: number) {
  return getValidNumberByArrowKey(value, { min: 1, max: 12, step })
}

export function getValidMinuteOrSecondByArrowKey(value: string, step: number) {
  return getValidNumberByArrowKey(value, { min: 0, max: 59, step })
}

/**
 * Converts 12-hour format time to 24-hour format.
 * 12:00 PM is 12:00
 * 12:00 AM is 00:00
 *
 * @param {number} hour - The hour in 12-hour format.
 * @param {Period} period - The period, either 'AM' or 'PM'.
 * @returns {number} The hour in 24-hour format.
 */

export function convert12HoursTo24Hours(hour: number, period: 'AM' | 'PM') {
  if (period === 'PM') {
    return hour === 12 ? hour : hour + 12
  } // Simplified to just 'else' since there are only two valid Period values
  return hour === 12 ? 0 : hour
}

export function setMinutes(date: Date, value: string) {
  const minutes = getValidMinuteOrSecond(value)
  date.setMinutes(parseInt(minutes, 10))
  return date
}

export function setSeconds(date: Date, value: string) {
  const seconds = getValidMinuteOrSecond(value)
  date.setSeconds(parseInt(seconds, 10))
  return date
}

export function setHours(date: Date, value: string) {
  const hours = getValid24Hour(value)
  date.setHours(parseInt(hours, 10))
  return date
}

export function set12Hours(date: Date, value: string, period: Period) {
  const hours = parseInt(getValid12Hours(value), 10)
  const convertedHours = convert12HoursTo24Hours(hours, period)
  date.setHours(convertedHours)
  return date
}

/**
 * time is stored in the 24-hour form,
 * but needs to be displayed to the user
 * in its 12-hour representation
 */
export function display12HoursValue(hours: number) {
  if (hours === 0 || hours === 12) return '12'
  if (hours >= 22) return String(hours - 12)

  if (hours % 12 > 9) return String(hours)
  return `0${String(hours % 12)}`
}

export function getDateByPickerType(date: Date, pickerType: TimePickerType) {
  let hours
  switch (pickerType) {
    case 'minutes':
      return getValidMinuteOrSecond(String(date.getMinutes()))
    case 'seconds':
      return getValidMinuteOrSecond(String(date.getSeconds()))
    case '24hours':
      return getValid24Hour(String(date.getHours()))
    case '12hours':
      hours = display12HoursValue(date.getHours())
      return getValid12Hours(String(hours))
    default:
      return '00'
  }
}

export function setDateByPickerType(date: Date, value: string, pickerType: TimePickerType, period?: Period) {
  switch (pickerType) {
    case 'minutes':
      return setMinutes(date, value)
    case 'seconds':
      return setSeconds(date, value)
    case '24hours':
      return setHours(date, value)
    case '12hours': {
      if (!period) return date
      return set12Hours(date, value, period)
    }
    default:
      return date
  }
}

export function getValidNumberByPickerType(value: string, step: number, pickerType: TimePickerType) {
  switch (pickerType) {
    case 'minutes':
      return getValidMinuteOrSecondByArrowKey(value, step)
    case 'seconds':
      return getValidMinuteOrSecondByArrowKey(value, step)
    case '24hours':
      return getValid24HourByArrowKey(value, step)
    case '12hours':
      return getValid12HoursByArrowKey(value, step)
    default:
      return '00'
  }
}
