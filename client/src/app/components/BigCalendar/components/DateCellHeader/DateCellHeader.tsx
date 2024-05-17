'use client'

import { type ComponentType } from 'react'
import { type DateHeaderProps } from 'react-big-calendar'

export type CustomDateCellHeaderProps = Partial<DateHeaderProps> & {
  showOutsideDays?: boolean
}

const DateCellHeader: ComponentType<CustomDateCellHeaderProps> = ({
  showOutsideDays,
  isOffRange,
  label,
  onDrillDown
}) => {
  if (!showOutsideDays && isOffRange) {
    return null
  }

  return (
    <button className='rbc-button-link' onClick={onDrillDown} type='button'>
      {label}
    </button>
  )
}

export { DateCellHeader }
