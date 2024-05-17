import { isNaN } from 'lodash'

// Regular expression to check the format dd/mm/yyyy
const DATE_REGEX = /^\d{2}\/\d{2}\/\d{4}$/

/**
 * Check if the date string is in the correct format.
 * @param value - The date string to check.
 * @returns True if the date string matches the format, false otherwise.
 */
const isValidFormat = (value: string): boolean => DATE_REGEX.test(value)

/**
 * Validate the date string in dd/mm/yyyy format.
 * @param value - The date string in dd/mm/yyyy format.
 * @returns True if the date is valid and not in the future (more than one year from now), false otherwise.
 */
export const isValidDateString = (value: string): boolean => {
  if (!isValidFormat(value)) return false

  const [day, month, year] = value.split('/')
  const parsedDate = new Date(`${year}-${month}-${day}`)

  if (isNaN(parsedDate.getTime())) return false

  const currentDate = new Date()
  currentDate.setFullYear(currentDate.getFullYear() + 1)

  return parsedDate <= currentDate
}

/**
 * Get the current date in dd/mm/yyyy format.
 * @returns The current date string in dd/mm/yyyy format.
 */
export const getCurrentDateString = (): string => {
  const currentDate = new Date()
  const day = String(currentDate.getDate()).padStart(2, '0')
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const year = currentDate.getFullYear()
  return `${day}/${month}/${String(year)}`
}

/**
 * Add days to a given date.
 * @param date - The initial date.
 * @param days - Number of days to add.
 * @returns The new date with added days.
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Subtract days from a given date.
 * @param date - The initial date.
 * @param days - Number of days to subtract.
 * @returns The new date with subtracted days.
 */
export const subtractDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

// Export all date utilities
export default {
  isValidDateString,
  getCurrentDateString,
  addDays,
  subtractDays
}
