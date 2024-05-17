'use client'

import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Input } from '~/@shadcn/components/ui/input'
import { Label } from '~/@shadcn/components/ui/label'
import { SelectItem } from '~/@shadcn/components/ui/select'
import { Textarea } from '~/@shadcn/components/ui/textarea'
import { CalendarRangeTimePicker } from '~/components/BigCalendar/components/CalendarRangeTimePicker/CalendarRangeTimePicker'
import { type BigCalendarContextType, useCalendarContext } from '~/components/BigCalendar/context/BigCalendarContext'
import { type CalendarEvent, DialogType } from '~/components/BigCalendar/types'
import { convertEnumToObject, updateLimitTimeByRequestType } from '~/components/BigCalendar/utils'
import { CustomSelect } from '~/components/CustomSelect/CustomSelect'
import { RequestStatus, RequestType } from '~/core/enums'

interface CalendarFormProps
  extends Partial<Pick<BigCalendarContextType, 'selectedEvent' | 'setSelectedEvent' | 'dialogState'>> {
  className?: string
}

const CalendarForm = (props: CalendarFormProps) => {
  const context = useCalendarContext()

  const { t } = useTranslation()

  const {
    dialogState = context.dialogState,
    selectedEvent = context.selectedEvent,
    setSelectedEvent = context.setSelectedEvent,
    className
  } = props

  const handleUpdateForm = useCallback(
    <K extends keyof Omit<CalendarEvent, 'start' | 'end'>>(field: K, value: CalendarEvent[K]) => {
      if (!selectedEvent) return

      let updatedEvent = { ...selectedEvent, [field]: value }

      if (field === 'requestType' && context.timeManagementSettings) {
        updatedEvent = updateLimitTimeByRequestType(updatedEvent, value as RequestType, context.timeManagementSettings)
      }

      setSelectedEvent(updatedEvent)
    },
    [context.timeManagementSettings, selectedEvent, setSelectedEvent]
  )

  const renderForm = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='w-full'>
          <Label htmlFor='requestType'>{t('calendarForm.requestType.label')}</Label>
          <CustomSelect
            onValueChange={async (value) => {
              handleUpdateForm('requestType', Number(value))
            }}
            value={
              selectedEvent && selectedEvent.requestType !== undefined ? String(selectedEvent.requestType) : undefined
            }
            placeholder={t('calendarForm.requestType.placeholder')}
            triggerClassName={className}
            contentClassName='max-h-[10rem]'
          >
            {React.Children.toArray(
              convertEnumToObject(RequestType).map(({ key, value }) => (
                <SelectItem value={String(key)}>
                  {t(`calendarForm.requestType.selectItems.${String(value)}`)}
                </SelectItem>
              ))
            )}
          </CustomSelect>
        </div>
        <div className='w-full'>
          <Label htmlFor='title'>{t('calendarForm.title.label')}</Label>
          <Input
            id='title'
            value={String(selectedEvent?.title ?? '')}
            onChange={(e) => handleUpdateForm('title', e.target.value)}
            disabled={!context.isValidRequestType}
          />
        </div>
        <div className='w-full'>
          <Label htmlFor='desc'>{t('calendarForm.description.label')}</Label>
          <Textarea
            id='desc'
            value={String(selectedEvent?.desc ?? '')}
            className='max-h-60 min-h-40 overflow-y-auto'
            onChange={(e) => handleUpdateForm('desc', e.target.value)}
            disabled={!context.isValidRequestType}
          />
        </div>
        <CalendarRangeTimePicker />
      </div>
    )
  }, [t, selectedEvent, className, context.isValidRequestType, handleUpdateForm])

  const renderReadOnly = useMemo(
    () => (
      <div className='flex flex-col gap-4'>
        <div className='w-full'>
          <Label className='font-bold'>{t('calendarForm.requestStatus.label')}</Label>
          <div>
            {selectedEvent?.requestStatus !== undefined
              ? t(`calendarForm.requestStatus.selectItems.${RequestStatus[Number(selectedEvent.requestStatus)]}`)
              : t('calendarForm.requestStatus.placeholder')}
          </div>
        </div>
        <div className='w-full'>
          <Label className='font-bold'>{t('calendarForm.requestType.label')}</Label>
          <div>
            {selectedEvent?.requestType !== undefined
              ? t(`calendarForm.requestType.selectItems.${RequestType[Number(selectedEvent.requestType)]}`)
              : t('calendarForm.requestType.placeholder')}
          </div>
        </div>
        <div className='w-full'>
          <Label className='font-bold'>{t('calendarForm.title.label')}</Label>
          <div>{selectedEvent?.title}</div>
        </div>
        <div className='w-full'>
          <Label className='font-bold'>{t('calendarForm.description.label')}</Label>
          <div className='max-h-60 overflow-y-auto'>{String(selectedEvent?.desc ?? '')}</div>
        </div>
        <CalendarRangeTimePicker />
      </div>
    ),
    [selectedEvent, t]
  )

  return (
    <div className={className}>{dialogState.dialogType !== DialogType.showEvent ? renderForm : renderReadOnly}</div>
  )
}

export { CalendarForm }
