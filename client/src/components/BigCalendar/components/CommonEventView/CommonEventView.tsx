'use client'

import { type ComponentType } from 'react'
import { type EventProps } from 'react-big-calendar'
import { useTranslation } from 'react-i18next'
import { endOfMonth, isWithinInterval, startOfMonth } from 'date-fns'

import { type CalendarEvent } from '~/components/BigCalendar/types'
import { RequestType } from '~/core/enums'

type CommonEventViewProps = Partial<EventProps<CalendarEvent>> & {
  event: CalendarEvent
  currentDateOfView?: Date
  showOutsideDays?: boolean
}

const CommonEventView: ComponentType<CommonEventViewProps> = ({ currentDateOfView, showOutsideDays, event }) => {
  const { t } = useTranslation()

  let eventComponent = null

  if (currentDateOfView && !showOutsideDays) {
    const startOfCurrentMonth = startOfMonth(currentDateOfView)
    const endOfCurrentMonth = endOfMonth(currentDateOfView)
    if (
      event.start !== undefined &&
      !isWithinInterval(event.start, { start: startOfCurrentMonth, end: endOfCurrentMonth })
    ) {
      eventComponent = null
    }
  } else {
    eventComponent = (
      <>
        {event.requestType !== undefined
          ? t(`calendarForm.requestType.selectItems.${RequestType[Number(event.requestType)]}`)
          : t('calendarForm.requestType.placeholder')}
        <div>{event.title}</div>
      </>
    )
  }

  return eventComponent
}

export { CommonEventView, type CommonEventViewProps }
