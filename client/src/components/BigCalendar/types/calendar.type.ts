import { type Event } from 'react-big-calendar'
import { type Matcher } from 'react-day-picker'

import { type RequestStatus, type RequestType } from '~/core/enums'

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type DatePickerShape = 'square' | 'round'

export interface LimitTimeRanges {
  from: {
    hour: number
    minute: number
  }
  to: {
    hour: number
    minute: number
  }
}

export interface TimeManagementSetting<T = string | number> {
  timeRanges: LimitTimeRanges[]
  type: T[]
}

export type TimeManagementSettings<T = string | number> = TimeManagementSetting<T>[]

export type CalendarEvent = Event & {
  allDay?: boolean | undefined
  title?: React.ReactNode | undefined
  id?: string | number
  start?: Date
  end?: Date
  requestType?: RequestType
  status?: RequestStatus
  [key: string]: unknown
}

export type EventColorClassSettings<ObjKey extends PropertyKey | string | number> = Record<ObjKey, string>

export type DisabledDatePickerRange = Matcher | Matcher[] | [] | undefined

export type DisabledDatePickerSettings<ObjKey extends PropertyKey | string | number> = Record<
  ObjKey,
  Matcher | Matcher[] | undefined
>
