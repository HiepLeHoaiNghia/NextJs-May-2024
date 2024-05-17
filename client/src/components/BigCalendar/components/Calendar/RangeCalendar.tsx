'use client'

import * as React from 'react'
import { type DateRange, DayPicker, type StyledComponent } from 'react-day-picker'
import { cva, type VariantProps } from 'class-variance-authority'
import { isEqual } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { buttonVariants } from 'src/@shadcn/components/ui/button'
import { cn } from 'src/@shadcn/utils'

import {
  CustomCaption,
  type CustomCaptionProps
} from '~/components/BigCalendar/components/Calendar/components/CustomCaption/CustomCaption'
import { useCalendarContext } from '~/components/BigCalendar/context/BigCalendarContext'
import { type DatePickerShape } from '~/components/BigCalendar/types'

const dayCellShapeVariants = cva('', {
  variants: {
    shape: {
      square: 'rounded-none',
      round: 'rounded-full'
    }
  },
  defaultVariants: {
    shape: 'square'
  }
})

type RangeCalendarProps = React.ComponentProps<typeof DayPicker> &
  VariantProps<typeof dayCellShapeVariants> & {
    selected?: DateRange | undefined
    pickerType?: 'from' | 'to'
    shape?: DatePickerShape
  }

const RangeCalendar = (props: RangeCalendarProps) => {
  const context = useCalendarContext()

  const [hoveredDate, setHoveredDate] = React.useState<Date | undefined>()

  const {
    className,
    classNames,
    shape = context.datePickerShape,
    showOutsideDays = context.showOutsideDays,
    selected,
    pickerType,
    ...otherProps
  } = props

  const handleDayMouseEnter = (day: Date) => setHoveredDate(day)
  const handleDayMouseLeave = () => setHoveredDate(undefined)

  // Define custom modifier logic
  const { modifiers, modifiersClassNames } = React.useMemo(() => {
    return {
      modifiers: {
        start: selected?.from ? [selected.from] : [],
        end: selected?.to ? [selected.to] : [],
        highlighted: (day: Date) => {
          if (!selected?.from || !selected.to || !hoveredDate) return false
          const start = selected.from
          const end = selected.to
          if (hoveredDate < start) {
            return day >= hoveredDate && day <= end
          }
          if (hoveredDate > end) {
            return day >= start && day <= hoveredDate
          }
          return day >= start && day <= end
        },
        betweenRange: (day: Date) => {
          if (!selected?.from || !selected.to) return false
          const start = selected.from
          const end = selected.to
          return day > start && day < end
        },
        specialHover: (day: Date) => {
          // Explicitly return false if hoveredDate or selected?.from/to is undefined
          if (!hoveredDate || !selected?.from || !selected.to) {
            return false
          }
          // Check if the day is the same as selected.from or selected.to
          return isEqual(day, selected.from) || isEqual(day, selected.to) || isEqual(day, hoveredDate)
        },
        specialHighlighted: (day: Date) => {
          if (!selected?.from || !selected.to || !hoveredDate) return false
          const start = selected.from
          const end = selected.to
          if (pickerType === 'from' && hoveredDate > start && hoveredDate < end) {
            return day > start && day < hoveredDate
          }
          if (pickerType === 'to' && hoveredDate > start && hoveredDate < end) {
            return day > hoveredDate && day < end
          }
          return false
        }
      },
      modifiersClassNames: {
        start: 'bg-gray-600 text-white',
        end: 'bg-gray-600 text-white',
        highlighted: 'bg-gray-400',
        specialHighlighted: '!bg-transparent',
        betweenRange: 'bg-gray-300',
        specialHover: '!text-white'
      }
    }
  }, [selected?.from, selected?.to, hoveredDate, pickerType])

  const IconLeft = React.useCallback(
    (iconProps: StyledComponent) => <ChevronLeft {...iconProps} className='h-4 w-4' />,
    []
  )
  const IconRight = React.useCallback(
    (iconProps: StyledComponent) => <ChevronRight {...iconProps} className='h-4 w-4' />,
    []
  )

  const Caption = React.useCallback((captionProps: CustomCaptionProps) => {
    return <CustomCaption {...captionProps} />
  }, [])

  return (
    <DayPicker
      components={{
        IconLeft,
        IconRight,
        ...(context.monthYearSelector === 'select' && { Caption })
      }}
      onDayMouseEnter={handleDayMouseEnter}
      onDayMouseLeave={handleDayMouseLeave}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex font-bold justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          dayCellShapeVariants({ shape }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: cn(dayCellShapeVariants({ shape }), 'text-gray-700 w-9 font-bold text-[0.8rem]'),
        row: 'flex w-full mt-2',
        cell: cn(
          dayCellShapeVariants({ shape }),
          'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent focus-within:relative focus-within:z-20'
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          dayCellShapeVariants({ shape }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-400'
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: cn(
          'bg-accent text-accent-foreground border-solid border-2 border-accent-foreground border-gray-700'
        ),
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames
      }}
      {...otherProps}
    />
  )
}
RangeCalendar.displayName = 'RangeCalendar'

export { RangeCalendar, type RangeCalendarProps }
