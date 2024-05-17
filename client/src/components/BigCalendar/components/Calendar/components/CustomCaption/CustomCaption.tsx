'use client'

import React from 'react'
import { Button, type CaptionProps, useNavigation } from 'react-day-picker'
import { useTranslation } from 'react-i18next'

import { SelectItem } from '~/@shadcn/components/ui/select'
import { cn } from '~/@shadcn/utils'
import { useCalendarContext } from '~/components/BigCalendar/context/BigCalendarContext'
import { CustomSelect } from '~/components/CustomSelect/CustomSelect'

type CustomCaptionProps = React.HTMLAttributes<HTMLDivElement> & CaptionProps

function CustomCaption({ className }: CustomCaptionProps) {
  const { currentLanguage } = useCalendarContext()
  const { currentMonth, goToMonth } = useNavigation()
  const { t } = useTranslation()
  const thisYear = new Date().getFullYear()

  const handleMonthChange = (monthIndex: number) => {
    const newMonth = new Date(currentMonth.getFullYear(), monthIndex)
    goToMonth(newMonth)
  }

  const handleYearChange = (year: number) => {
    const newMonth = new Date(year, currentMonth.getMonth())
    goToMonth(newMonth)
  }

  return (
    <div className={cn('relative flex items-stretch justify-center gap-2 font-bold', className)}>
      <CustomSelect
        scrollable
        value={String(currentMonth.getMonth())}
        onValueChange={(value) => handleMonthChange(Number(value))}
        placeholder={String(currentMonth.toLocaleString(currentLanguage, { month: 'long' }))}
        triggerClassName={className}
      >
        {React.Children.toArray(
          Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString(currentLanguage, { month: 'long' })).map(
            (month, index) => <SelectItem value={String(index)}>{month}</SelectItem>
          )
        )}
      </CustomSelect>
      <CustomSelect
        scrollable
        value={String(currentMonth.getFullYear())}
        onValueChange={(value) => handleYearChange(Number(value))}
        placeholder={String(thisYear)}
        triggerClassName={className}
      >
        {React.Children.toArray(
          Array.from({ length: 6 }, (_, i) => thisYear + i).map((year) => (
            <SelectItem value={String(year)}>{year}</SelectItem>
          ))
        )}
      </CustomSelect>
      <Button
        className='my-[2px] rounded-md px-[6px] font-medium outline outline-1 outline-neutral-500 hover:bg-neutral-900 hover:text-white'
        onClick={() => goToMonth(new Date())}
      >
        {t('calendarMessages.today')}
      </Button>
    </div>
  )
}

export { CustomCaption, type CustomCaptionProps }
