'use client'

import * as React from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/@shadcn/components/ui/select'
import { useCalendarContext } from '~/app/components/BigCalendar/context/BigCalendarContext'

import { type Period } from '../types'
import { display12HoursValue, setDateByPickerType } from '../utils'

export interface TimePeriodSelectorProps {
  period: Period
  setPeriod: (m: Period) => void
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  onRightFocus?: () => void
  onLeftFocus?: () => void
}

export const TimePeriodSelector = React.forwardRef<HTMLButtonElement, TimePeriodSelectorProps>(
  ({ period, setPeriod, date, setDate, onLeftFocus, onRightFocus }, ref) => {
    const { currentLanguage, languageConfig } = useCalendarContext()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'ArrowRight') onRightFocus?.()
      if (e.key === 'ArrowLeft') onLeftFocus?.()
    }

    const handleValueChange = (value: Period) => {
      setPeriod(value)
      if (date) {
        const tempDate = new Date(date)
        const hours = display12HoursValue(date.getHours())
        setDate(setDateByPickerType(tempDate, hours.toString(), '12hours', period === 'AM' ? 'PM' : 'AM'))
      }
    }

    const renderPeriodSelectItem = React.useMemo(() => {
      const periodSelectorItem =
        languageConfig?.[currentLanguage].translation.common.timePicker.periodSelectorItems || []

      return periodSelectorItem.map((item: { value: string; label: string }) => {
        return (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        )
      })
    }, [currentLanguage, languageConfig])

    return (
      <div className='flex h-full items-center'>
        <Select defaultValue={period} onValueChange={(value: Period) => handleValueChange(value)}>
          <SelectTrigger
            ref={ref}
            className='w-full focus:bg-accent focus:text-accent-foreground'
            onKeyDown={handleKeyDown}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{renderPeriodSelectItem}</SelectContent>
        </Select>
      </div>
    )
  }
)

TimePeriodSelector.displayName = 'TimePeriodSelector'
