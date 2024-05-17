'use client'

import { BigCalendar } from '~/components/BigCalendar'
import dumpEvents from '~/components/BigCalendar/resource/events/dumpEvents'
import { type CalendarEvent, type TimeManagementSettings } from '~/components/BigCalendar/types'
import { RequestType } from '~/core/enums'

function LoginPage() {
  const timeManagementSettings: TimeManagementSettings<RequestType> = [
    {
      timeRanges: [
        {
          from: { hour: 8, minute: 30 },
          to: { hour: 11, minute: 30 }
        },
        {
          from: { hour: 13, minute: 0 },
          to: { hour: 17, minute: 30 }
        }
      ],
      type: [RequestType.editTimeSheet, RequestType.paidLeave, RequestType.unpaidLeave, RequestType.remoteWork]
    },
    {
      timeRanges: [
        {
          from: { hour: 0, minute: 0 },
          to: { hour: 8, minute: 30 }
        },
        {
          from: { hour: 19, minute: 0 },
          to: { hour: 23, minute: 59 }
        }
      ],
      type: [RequestType.overtime]
    }
  ]

  return (
    <BigCalendar
      timeManagementSettings={timeManagementSettings}
      datePickerShape='round'
      events={dumpEvents as CalendarEvent[]}
    />
  )
}

export default LoginPage
