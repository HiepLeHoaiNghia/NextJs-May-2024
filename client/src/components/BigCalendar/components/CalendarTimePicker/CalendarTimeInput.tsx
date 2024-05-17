'use client'

import { useRef, useState } from 'react'

import { cn } from '~/@shadcn/utils'
import { type Period } from '~/components/BigCalendar/components/CalendarTimePicker/types'

import { useCalendarContext } from '../../context/BigCalendarContext'
import { TimePeriodSelector } from './components/TimePeriodSelector'
import { TimePickerInput } from './components/TimePickerInput'

interface CalendarTimeInputProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

const CalendarTimeInput = ({ date, setDate, className }: CalendarTimeInputProps) => {
  const [period, setPeriod] = useState<Period>('AM')
  const hourRef = useRef<HTMLInputElement>(null)
  const minuteRef = useRef<HTMLInputElement>(null)
  const secondRef = useRef<HTMLInputElement>(null)
  const periodRef = useRef<HTMLButtonElement>(null)

  const {
    dateTimePickerHourStep,
    dateTimePickerMinuteStep,
    dateTimePickerSecondStep,
    dateTimePickerShowMinutes,
    dateTimePickerShowSeconds,
    dateTimePicker12HoursFormat
  } = useCalendarContext()

  return (
    <div className={cn('flex w-full items-center justify-center gap-2', className)}>
      <div className='flex flex-1 items-center'>
        <TimePickerInput
          step={dateTimePickerHourStep}
          className='w-full'
          picker={dateTimePicker12HoursFormat ? '12hours' : '24hours'}
          period={dateTimePicker12HoursFormat ? period : undefined}
          date={date}
          setDate={setDate}
          ref={hourRef}
        />
      </div>
      {dateTimePickerShowMinutes && (
        <div className='flex flex-1 items-center'>
          <TimePickerInput
            step={dateTimePickerMinuteStep}
            className='w-full'
            picker='minutes'
            date={date}
            setDate={setDate}
            ref={minuteRef}
          />
        </div>
      )}
      {dateTimePickerShowSeconds && (
        <div className='flex flex-1 items-center'>
          <TimePickerInput
            step={dateTimePickerSecondStep}
            className='w-full'
            picker='seconds'
            date={date}
            setDate={setDate}
            ref={secondRef}
          />
        </div>
      )}
      {dateTimePicker12HoursFormat && (
        <div className='flex flex-1 items-center'>
          <TimePeriodSelector period={period} setPeriod={setPeriod} date={date} setDate={setDate} ref={periodRef} />
        </div>
      )}
    </div>
  )
}

export { CalendarTimeInput }
