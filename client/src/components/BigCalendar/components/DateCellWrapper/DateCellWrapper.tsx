'use client'

import { type ComponentType } from 'react'
import { type DateCellWrapperProps } from 'react-big-calendar'
import { endOfMonth, isBefore, isWithinInterval, startOfDay, startOfMonth } from 'date-fns'

type CustomDateCellWrapperProps = Partial<DateCellWrapperProps> & {
  currentDateOfView?: Date
  showOutsideDays?: boolean
  value: Date
}

const DateCellWrapper: ComponentType<CustomDateCellWrapperProps> = ({
  currentDateOfView,
  showOutsideDays,
  value,
  children
}) => {
  if (!showOutsideDays && currentDateOfView) {
    const startOfCurrentMonth = startOfMonth(currentDateOfView)
    const endOfCurrentMonth = endOfMonth(currentDateOfView)
    if (!isWithinInterval(new Date(value), { start: startOfCurrentMonth, end: endOfCurrentMonth })) {
      return <div className='hide-outside-days' />
    }
  }
  if (isBefore(startOfDay(new Date(value)), startOfDay(new Date()))) {
    return <div className='rbc-day-bg'>{children}</div>
  }
  return children
}

export { type CustomDateCellWrapperProps, DateCellWrapper }
