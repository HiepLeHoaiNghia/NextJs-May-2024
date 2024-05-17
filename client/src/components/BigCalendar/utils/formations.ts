import { format } from 'date-fns'

import { type LocaleCode } from '~/components/BigCalendar/types'

export const formatDateByLanguage = (
  dateToFormat?: string | number | Date,
  currentLanguage?: LocaleCode,
  use12Hours?: boolean
) => {
  const timeFormat = use12Hours ? 'hh:mm a' : 'HH:mm'

  switch (currentLanguage) {
    case 'en': {
      return format(dateToFormat as Date, `MMMM d, yyyy ${timeFormat}`)
    }
    case 'vi': {
      const formattedDate = format(dateToFormat as Date, `dd/MM/yyyy ${timeFormat}`)
      return use12Hours ? formattedDate.replace('AM', 'sáng').replace('PM', 'chiều') : formattedDate
    }
    case 'ja': {
      const formattedDate = format(dateToFormat as Date, `yyyy年M月d日 ${timeFormat}`)
      return use12Hours ? formattedDate.replace('AM', '午前').replace('PM', '午後') : formattedDate
    }
    default: {
      return format(dateToFormat as Date, `MMMM d, yyyy ${timeFormat}`)
    }
  }
}
