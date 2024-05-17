'use client'

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarIcon } from 'lucide-react'

import CalendarDateTimePicker from '~/app/components/BigCalendar/components/CalendarDateTimePicker'
import { useCalendarContext } from '~/app/components/BigCalendar/context/BigCalendarContext'
import {
  DialogType,
  type DisabledDatePickerRange,
  type DisabledDatePickerSettings
} from '~/app/components/BigCalendar/types'
import { formatDateByLanguage } from '~/app/components/BigCalendar/utils'
import { RequestType } from '~/app/core/enums'

interface CalendarRangeTimePickerProps {
  className?: string
  disabledDatePickerSettings?: DisabledDatePickerSettings<RequestType>
}

export default function CalendarRangeTimePicker(props: CalendarRangeTimePickerProps) {
  const {
    dialogState,
    selectedEvent,
    currentLanguage,
    dateTimePicker12HoursFormat,
    disabledDatePickerSettings: contextDisabledDatePickerSettings
  } = useCalendarContext()

  const { className, disabledDatePickerSettings = contextDisabledDatePickerSettings } = props

  const { t } = useTranslation()

  const renderDateTimePicker = useMemo(() => {
    let disabledRange: DisabledDatePickerRange

    if (
      Object.prototype.hasOwnProperty.call(selectedEvent, 'requestType') &&
      selectedEvent?.requestType &&
      Object.values(RequestType).includes(selectedEvent.requestType)
    ) {
      disabledRange = disabledDatePickerSettings?.[selectedEvent.requestType]
    } else {
      disabledRange = undefined
    }

    return (
      <div className='flex w-full gap-4'>
        <CalendarDateTimePicker
          pickerType='from'
          range={{ from: selectedEvent?.start, to: selectedEvent?.end }}
          disabledRange={disabledRange}
          labelPlaceholder={t('calendarForm.startDate.label')}
        />
        <CalendarDateTimePicker
          pickerType='to'
          range={{ from: selectedEvent?.start, to: selectedEvent?.end }}
          disabledRange={disabledRange}
          labelPlaceholder={t('calendarForm.endDate.label')}
        />
      </div>
    )
  }, [disabledDatePickerSettings, selectedEvent, t])

  const renderReadOnly = useMemo(() => {
    return (
      <div className='flex w-full flex-col gap-2 text-sm'>
        <div className='flex flex-1 items-center gap-2'>
          <CalendarIcon />
          <span>{t('calendarForm.startDate.label')}:</span>
          <span className='font-semibold'>
            {formatDateByLanguage(selectedEvent?.start, currentLanguage, dateTimePicker12HoursFormat)}
          </span>
        </div>
        <div className='flex flex-1 items-center gap-2'>
          <CalendarIcon />
          <span>{t('calendarForm.endDate.label')}:</span>
          <span className='font-semibold'>
            {formatDateByLanguage(selectedEvent?.end, currentLanguage, dateTimePicker12HoursFormat)}
          </span>
        </div>
      </div>
    )
  }, [selectedEvent, t, currentLanguage, dateTimePicker12HoursFormat])

  return (
    <div className={className}>
      {dialogState.dialogType !== DialogType.showEvent ? renderDateTimePicker : renderReadOnly}
    </div>
  )
}
