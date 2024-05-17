'use client'

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from '@radix-ui/react-label'

import { cn } from '~/@shadcn/utils'
import { CustomScrollArea } from '~/components/BigCalendar/components/ScrollArea/ScrollArea'
import { useCalendarContext } from '~/components/BigCalendar/context/BigCalendarContext'
import { generateHourOptions } from '~/components/BigCalendar/utils'
import { Button } from '~/components/Button'

interface CalendarTimeSelectProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  timeSelectClassName?: string
  pickerType?: 'from' | 'to'
}

const CalendarTimeSelect = ({ date, setDate, timeSelectClassName, pickerType }: CalendarTimeSelectProps) => {
  const { t } = useTranslation()
  const { dateTimePickerMinuteStep, timeManagementSettings, selectedEvent } = useCalendarContext()

  const timeOptions = useMemo(
    () =>
      generateHourOptions({
        selectedDate: date,
        minuteStep: dateTimePickerMinuteStep,
        requestType: selectedEvent?.requestType,
        settings: timeManagementSettings,
        pickerType
      }),
    [date, dateTimePickerMinuteStep, selectedEvent?.requestType, timeManagementSettings, pickerType]
  )

  const handleSetTime = (time: string) => {
    const [hour, minute] = time.split(':')
    setDate(date ? new Date(date.setHours(Number(hour), Number(minute))) : new Date())
  }

  return (
    <>
      <Label className='text-center'>{t('calendarForm.timeSelect.label')}</Label>
      <CustomScrollArea className={`flex flex-col items-start${timeSelectClassName ?? ''}`}>
        {React.Children.toArray(
          timeOptions.map((time, index) => (
            <Button
              className={cn('w-full !rounded-none hover:bg-gray-400', {
                'border-b-2': index !== timeOptions.length - 1
              })}
              variant='ghost'
              onClick={() => handleSetTime(time)}
            >
              {time}
            </Button>
          ))
        )}
      </CustomScrollArea>
    </>
  )
}
export { CalendarTimeSelect }
