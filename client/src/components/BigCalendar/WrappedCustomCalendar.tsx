'use client'

import { type FC } from 'react'

import {
  CalendarProvider,
  type ExternalBigCalendarContextType
} from '~/components/BigCalendar/context/BigCalendarContext'
import {
  CustomReactBigCalendar,
  type CustomReactBigCalendarProps
} from '~/components/BigCalendar/CustomReactBigCalendar'

type WrappedBigCalendarProps = Partial<CustomReactBigCalendarProps> & Partial<ExternalBigCalendarContextType>

const WrappedBigCalendar: FC<WrappedBigCalendarProps> = ({
  events,
  weekStartsOn,
  bigCalendarClassName,
  CalendarDialogComponent,
  views,
  ...props
}) => {
  return (
    <CalendarProvider {...props} weekStartsOn={weekStartsOn} events={events}>
      <CustomReactBigCalendar
        CalendarDialogComponent={CalendarDialogComponent}
        bigCalendarClassName={bigCalendarClassName}
        views={views}
      />
    </CalendarProvider>
  )
}

export default WrappedBigCalendar

WrappedBigCalendar.displayName = 'BigCalendar'
