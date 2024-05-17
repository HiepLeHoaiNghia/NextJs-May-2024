'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { type DayPicker } from 'react-day-picker'
import { useTranslation } from 'react-i18next'
import { CalendarIcon, ChevronDown } from 'lucide-react'

import { Button } from '~/@shadcn/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/@shadcn/components/ui/popover'
import { cn } from '~/@shadcn/utils'
import { RangeCalendar } from '~/components/BigCalendar/components/Calendar/RangeCalendar'
import { CalendarTimeSelect } from '~/components/BigCalendar/components/CalendarTimePicker'
import { useCalendarContext } from '~/components/BigCalendar/context/BigCalendarContext'
import { type CalendarEvent, type DisabledDatePickerRange } from '~/components/BigCalendar/types'
import { clampTimeToLimitedRange, formatDateByLanguage } from '~/components/BigCalendar/utils'

type CalendarDateTimePickerProps = React.ComponentProps<typeof DayPicker> & {
  range: { from: CalendarEvent['start'] | undefined; to: CalendarEvent['end'] | undefined }
  wrapperClassName?: string
  labelPlaceholder?: string
  pickerType: 'from' | 'to'
  disabledRange?: DisabledDatePickerRange
}

const CalendarDateTimePicker = ({
  range,
  wrapperClassName,
  pickerType,
  labelPlaceholder = 'Pick a date',
  disabledRange
}: CalendarDateTimePickerProps) => {
  const {
    currentLanguage,
    weekStartsOn,
    showOutsideDays,
    languageConfig,
    setSelectedEvent,
    selectedEvent,
    dateTimePickerMinuteStep,
    dateTimePicker12HoursFormat,
    timeManagementSettings,
    isValidRequestType
  } = useCalendarContext()

  const { t } = useTranslation()

  const [localRange, setLocalRange] = useState(range)
  const [isOpenCalendar, setIsOpenCalendar] = useState(false)

  useEffect(() => {
    setLocalRange(range)
  }, [range])

  const handleDateChange = (selectedDay: Date | undefined) => {
    if (!selectedDay) return
    let updatedRange

    if (timeManagementSettings) {
      updatedRange = clampTimeToLimitedRange({
        selectedDay,
        timeRange: localRange,
        pickerType,
        timeManagementSettings,
        requestType: Number(selectedEvent?.requestType),
        step: dateTimePickerMinuteStep
      })
    }

    setLocalRange(updatedRange || { from: selectedDay, to: selectedDay })

    setSelectedEvent({
      ...selectedEvent,
      start: updatedRange?.from || selectedDay,
      end: updatedRange?.to || selectedDay
    })
  }

  return (
    <div className={cn('flex w-full', { 'cursor-not-allowed': !isValidRequestType }, wrapperClassName)}>
      <Popover modal open={isOpenCalendar} onOpenChange={() => setIsOpenCalendar(!isOpenCalendar)}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn('flex-1 justify-between px-3 text-left font-normal text-gray-500 transition-colors', {
              'border-gray-500 text-gray-950': isOpenCalendar
            })}
            disabled={!isValidRequestType}
          >
            <div className={cn('flex w-5 flex-1 items-center justify-start gap-4')}>
              <CalendarIcon className={cn('w-5')} />
              {localRange[pickerType] ? (
                formatDateByLanguage(localRange[pickerType], currentLanguage, dateTimePicker12HoursFormat)
              ) : (
                <span>{t(labelPlaceholder)}</span>
              )}
            </div>
            <ChevronDown className={cn('w-5 transition-transform', { 'rotate-180': isOpenCalendar })} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='flex max-h-fit w-auto p-0' align='start'>
          <RangeCalendar
            pickerType={pickerType}
            showOutsideDays={showOutsideDays}
            classNames={{ months: 'justify-center' }}
            locale={languageConfig?.[currentLanguage].locale}
            weekStartsOn={weekStartsOn}
            mode='range'
            defaultMonth={localRange[pickerType]}
            selected={localRange}
            onSelect={(_, selectedDate) => handleDateChange(selectedDate)}
            disabled={disabledRange}
            initialFocus
          />
          <div className='flex max-w-32 flex-1 flex-col gap-3 border-t border-border pb-6 pr-3 pt-3'>
            <CalendarTimeSelect pickerType={pickerType} date={localRange[pickerType]} setDate={handleDateChange} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { CalendarDateTimePicker, type CalendarDateTimePickerProps }
