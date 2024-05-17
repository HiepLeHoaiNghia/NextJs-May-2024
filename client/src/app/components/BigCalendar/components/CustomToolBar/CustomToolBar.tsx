'use client'

import React, { type ComponentType } from 'react'
import { type NavigateAction, type ToolbarProps, type View } from 'react-big-calendar'
import { useTranslation } from 'react-i18next'
import {
  addDays,
  addMonths,
  addWeeks,
  type Day,
  eachWeekOfInterval,
  endOfMonth,
  getYear,
  isSameDay,
  isSameMonth,
  setDate,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek
} from 'date-fns'

import { Button } from '~/@shadcn/components/ui/button'
import { SelectItem } from '~/@shadcn/components/ui/select'
import { useCalendarContext } from '~/app/components/BigCalendar/context/BigCalendarContext'
import { type CalendarEvent, type LocaleCode } from '~/app/components/BigCalendar/types'
import { CustomSelect } from '~/app/components/CustomSelect/CustomSelect'

export type CustomToolBarProps = Partial<ToolbarProps<CalendarEvent>> & {
  date: Date
  onNavigate: (navigate: NavigateAction, date?: Date) => void
  onView: (view: View) => void
  currentLanguage?: LocaleCode
  className?: string
  view: View
}

const CustomToolBar: ComponentType<CustomToolBarProps> = (props: CustomToolBarProps) => {
  const { t } = useTranslation()
  const bigCalendarContext = useCalendarContext()

  const { view, date, onNavigate, onView, currentLanguage = bigCalendarContext.currentLanguage, className } = props

  const thisYear = new Date().getFullYear()

  const navigateYears = Array.from({ length: 6 }, (_, i) => thisYear + i)

  const handleMonthChange = (monthIndex: number, navigateView: string) => {
    const newMonth = setMonth(date, monthIndex)
    const startOfNewMonth = startOfMonth(newMonth)

    if (navigateView === 'day' || navigateView === 'agenda') {
      onNavigate('DATE', startOfNewMonth)
    } else {
      const weeksOfNewMonth = eachWeekOfInterval(
        { start: startOfNewMonth, end: endOfMonth(newMonth) },
        { weekStartsOn: 1 } // Always start from Monday
      )

      const firstWeekOfNewMonth = weeksOfNewMonth.find((weekStartDate) => isSameMonth(weekStartDate, startOfNewMonth))

      if (firstWeekOfNewMonth) {
        onNavigate('DATE', firstWeekOfNewMonth)
      } else {
        onNavigate('DATE', startOfNewMonth) // Fallback to the start of the month if no week is found
      }
    }
  }

  const handleYearChange = (year: number) => {
    const newMonth = setYear(date, year)
    onNavigate('DATE', newMonth)
  }

  const handlePrevClick = () => {
    let newDate
    switch (view) {
      case 'month':
        newDate = addMonths(date, -1)
        break
      case 'week':
        newDate = startOfWeek(addWeeks(date, -1), { weekStartsOn: 1 })
        break
      case 'day':
        newDate = addDays(date, -1)
        break
      case 'agenda':
        newDate = addDays(date, -30)
        break
      case 'work_week':
        newDate = startOfWeek(addWeeks(date, -1), { weekStartsOn: 1 })
        break
      default:
        return
    }
    if (!navigateYears.includes(getYear(newDate))) {
      return
    }
    onNavigate('DATE', newDate)
  }

  const handleNextClick = () => {
    let newDate
    switch (view) {
      case 'month':
        newDate = addMonths(date, 1)
        break
      case 'week':
        newDate = startOfWeek(addWeeks(date, 1), { weekStartsOn: 1 })
        break
      case 'day':
        newDate = addDays(date, 1)
        break
      case 'agenda':
        newDate = addDays(date, 30)
        break
      case 'work_week':
        newDate = startOfWeek(addWeeks(date, 1), { weekStartsOn: 1 })
        break
      default:
        return
    }
    if (!navigateYears.includes(getYear(newDate))) {
      return
    }
    onNavigate('DATE', newDate)
  }

  const handleDayChange = (day: number) => {
    const newDate = setDate(date, day)
    onNavigate('DATE', newDate)
  }

  const handleWeekdayChange = (weekday: number) => {
    const newDate = startOfWeek(date, { weekStartsOn: weekday as Day })
    onNavigate('DATE', newDate)
  }

  const handleWeekChange = (weekNumber: number) => {
    const startOfMonthDate = startOfMonth(date)
    const endOfMonthDate = endOfMonth(date)

    const weeksOfMonth = eachWeekOfInterval(
      { start: startOfMonthDate, end: endOfMonthDate },
      { weekStartsOn: 1 } // Always start from Monday
    ).filter((weekStartDate) => {
      // Bỏ qua tuần đầu tiên nếu nó bắt đầu trong tháng trước
      if (!isSameMonth(weekStartDate, date)) {
        return false
      }
      return true
    })

    if (weekNumber > weeksOfMonth.length) {
      return
    }

    const newDate = weeksOfMonth[weekNumber - 1]
    onNavigate('DATE', newDate)
  }

  const handleWorkWeekChange = (weekNumber: number) => {
    const startOfMonthDate = startOfMonth(date)
    const endOfMonthDate = endOfMonth(date)
    const weeksOfMonth = eachWeekOfInterval(
      { start: startOfMonthDate, end: endOfMonthDate },
      { weekStartsOn: 1 } // Always start from Monday
    ).filter((weekStartDate) => isSameMonth(weekStartDate, date))

    if (weekNumber > weeksOfMonth.length) {
      return
    }
    const newDate = weeksOfMonth[weekNumber - 1]
    onNavigate('DATE', newDate)
  }

  const getWeekNumber = (newDate: Date, isWorkWeek = false): number => {
    const startOfMonthDate = startOfMonth(newDate)
    const endOfMonthDate = endOfMonth(newDate)
    const weeksOfMonth = eachWeekOfInterval(
      { start: startOfMonthDate, end: endOfMonthDate },
      { weekStartsOn: 1 } // Always start from Monday
    ).filter((weekStartDate) => {
      if (isWorkWeek) {
        return isSameMonth(weekStartDate, newDate)
      }
      // Bỏ qua tuần đầu tiên nếu nó bắt đầu trong tháng trước
      if (!isSameMonth(weekStartDate, newDate)) {
        return false
      }
      return true
    })

    const currentWeekStart = startOfWeek(newDate, { weekStartsOn: 1 })
    return weeksOfMonth.findIndex((weekStartDate) => isSameDay(weekStartDate, currentWeekStart)) + 1
  }

  return (
    <div className='rbc-toolbar !justify-between'>
      <div className='rbc-btn-group'>
        <Button className='font-semibold' onClick={() => onNavigate('TODAY')}>
          {t('calendarMessages.today')}
        </Button>
        <Button className='text-lg font-semibold' onClick={handlePrevClick}>
          {t('calendarMessages.previous')}
        </Button>
        <Button className='text-lg font-semibold' onClick={handleNextClick}>
          {t('calendarMessages.next')}
        </Button>
      </div>
      <div className='rbc-toolbar-label relative flex !flex-initial items-stretch justify-center gap-2 font-bold'>
        {(view === 'day' || view === 'agenda') && (
          <CustomSelect
            scrollable
            value={String(date.getDay() || 0)}
            onValueChange={(value) => handleWeekdayChange(Number(value))}
            placeholder={String(date.toLocaleString(currentLanguage, { weekday: 'long' }))}
            triggerClassName={`!flex ${className ?? ''}`}
          >
            {React.Children.toArray(
              Array.from({ length: 7 }, (_, i) =>
                new Date(0, 0, i).toLocaleString(currentLanguage, { weekday: 'long' })
              ).map((weekday, index) => <SelectItem value={String(index)}>{weekday}</SelectItem>)
            )}
          </CustomSelect>
        )}
        {view === 'week' && (
          <CustomSelect
            value={String(getWeekNumber(date) || 1)}
            onValueChange={(value) => handleWeekChange(Number(value))}
            placeholder={String(getWeekNumber(date) || 1)}
            triggerClassName={`!flex ${className ?? ''}`}
          >
            {React.Children.toArray(
              eachWeekOfInterval(
                { start: startOfMonth(date), end: endOfMonth(date) },
                { weekStartsOn: 1 } // Always start from Monday
              )
                .filter((weekStartDate) => {
                  // Bỏ qua tuần đầu tiên nếu nó bắt đầu trong tháng trước
                  if (!isSameMonth(weekStartDate, date)) {
                    return false
                  }
                  return true
                })
                .map((_, i) => (
                  <SelectItem value={String(i + 1)}>{`${t('calendarMessages.week')} ${String(i + 1)}`}</SelectItem>
                ))
            )}
          </CustomSelect>
        )}
        {view === 'work_week' && (
          <CustomSelect
            value={String(getWeekNumber(date, true) || 1)}
            onValueChange={(value) => handleWorkWeekChange(Number(value))}
            placeholder={String(getWeekNumber(date, true) || 1)}
            triggerClassName={`!flex ${className ?? ''}`}
          >
            {React.Children.toArray(
              eachWeekOfInterval(
                { start: startOfMonth(date), end: endOfMonth(date) },
                { weekStartsOn: 1 } // Always start from Monday
              )
                .filter((weekStartDate) => isSameMonth(weekStartDate, date))
                .map((_, i) => (
                  <SelectItem value={String(i + 1)}>{`${t('calendarMessages.week')} ${String(i + 1)}`}</SelectItem>
                ))
            )}
          </CustomSelect>
        )}
        {(view === 'day' || view === 'agenda') && (
          <CustomSelect
            scrollable
            value={String(date.getDate() || 1)}
            onValueChange={(value) => handleDayChange(Number(value))}
            placeholder={String(date.getDate() || 1)}
            triggerClassName={`!flex ${className ?? ''}`}
          >
            {React.Children.toArray(
              Array.from(
                { length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() },
                (_, i) => i + 1
              ).map((day) => (
                <SelectItem value={String(day)}>{`${t('calendarMessages.day')} ${String(day)}`}</SelectItem>
              ))
            )}
          </CustomSelect>
        )}
        <CustomSelect
          scrollable
          value={String(date.getMonth())}
          onValueChange={(value) => handleMonthChange(Number(value), view)}
          placeholder={String(date.toLocaleString(currentLanguage, { month: 'long' }))}
          triggerClassName={`!flex ${className ?? ''}`}
        >
          {React.Children.toArray(
            Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString(currentLanguage, { month: 'long' })).map(
              (month, index) => <SelectItem value={String(index)}>{month}</SelectItem>
            )
          )}
        </CustomSelect>
        <CustomSelect
          scrollable
          value={String(date.getFullYear())}
          onValueChange={(value) => handleYearChange(Number(value))}
          placeholder={String(thisYear)}
          triggerClassName={`!flex ${className ?? ''}`}
        >
          {React.Children.toArray(navigateYears.map((year) => <SelectItem value={String(year)}>{year}</SelectItem>))}
        </CustomSelect>
      </div>
      <span className='rbc-btn-group'>
        <Button className='font-semibold' onClick={() => onView('month')}>
          {t('calendarMessages.month')}
        </Button>
        <Button className='font-semibold' onClick={() => onView('week')}>
          {t('calendarMessages.week')}
        </Button>
        <Button className='font-semibold' onClick={() => onView('day')}>
          {t('calendarMessages.day')}
        </Button>
        <Button className='font-semibold' onClick={() => onView('work_week')}>
          {t('calendarMessages.work_week')}
        </Button>
        <Button className='font-semibold' onClick={() => onView('agenda')}>
          {t('calendarMessages.agenda')}
        </Button>
      </span>
    </div>
  )
}

export { CustomToolBar }
