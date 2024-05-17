'use client'

import React from 'react'

import { cn } from '~/@shadcn/utils'
import { InputNumber } from '~/components/BigCalendar/components/CalendarTimePicker/components/InputNumber'
import { useCalendarContext } from '~/components/BigCalendar/context/BigCalendarContext'

import { type Period, type TimePickerType } from '../types'
import { getDateByPickerType, getValidNumberByPickerType, setDateByPickerType } from '../utils'

interface TimePickerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: TimePickerType
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  period?: Period
  onRightFocus?: () => void
  onLeftFocus?: () => void
}

const TimePickerInput = React.forwardRef<HTMLInputElement, TimePickerInputProps>(
  (
    {
      className,
      type = 'tel',
      value,
      id,
      name,
      date = new Date(new Date().setHours(0, 0, 0, 0)),
      setDate,
      onChange,
      onKeyDown,
      picker,
      period,
      onLeftFocus,
      onRightFocus,
      ...props
    },
    ref
  ) => {
    const [flag, setFlag] = React.useState<boolean>(false)
    const [prevIntKey, setPrevIntKey] = React.useState<string>('0')

    const { dateTimePickerHourStep, dateTimePickerMinuteStep, dateTimePickerSecondStep } = useCalendarContext()

    /**
     * allow the user to enter the second digit within 2 seconds
     * otherwise start again with entering first digit
     */
    React.useEffect(() => {
      if (flag) {
        const timer = setTimeout(() => {
          setFlag(false)
        }, 2000)

        return () => {
          clearTimeout(timer)
        }
      }

      return undefined
    }, [flag])

    const calculatedValue = React.useMemo(() => {
      return getDateByPickerType(date, picker)
    }, [date, picker])

    const calculateValueByKeyDown = (keyInsert: React.KeyboardEvent<HTMLInputElement>['key']) => {
      if (picker === '12hours' && flag && calculatedValue.slice(1, 2) === '1' && prevIntKey === '0') {
        return `0${keyInsert}`
      }

      return !flag ? `0${keyInsert}` : calculatedValue.slice(1, 2) + keyInsert
    }

    const handleTimeChange = (action: 'increase' | 'decrease' | 'scroll', e?: React.WheelEvent<HTMLInputElement>) => {
      let step = 0

      if (picker === '24hours' || picker === '12hours') {
        step = action === 'increase' ? dateTimePickerHourStep ?? 1 : -(dateTimePickerHourStep ?? 1)
      } else if (picker === 'minutes') {
        step = action === 'increase' ? dateTimePickerMinuteStep ?? 1 : -(dateTimePickerMinuteStep ?? 1)
      } else {
        step = action === 'increase' ? dateTimePickerSecondStep ?? 1 : -(dateTimePickerSecondStep ?? 1)
      }

      if (action === 'scroll') {
        if (!e) return
        step = e.deltaY > 0 ? step : -step
      }

      const newValue = getValidNumberByPickerType(calculatedValue, step, picker)
      const tempDate = new Date(date)
      setDate(setDateByPickerType(tempDate, newValue, picker, period))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Tab') return

      e.preventDefault()

      if (e.key === 'ArrowRight') onRightFocus?.()
      if (e.key === 'ArrowLeft') onLeftFocus?.()

      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        handleTimeChange(e.key === 'ArrowUp' ? 'increase' : 'decrease')
      }

      if (e.key >= '0' && e.key <= '9') {
        if (picker === '12hours') setPrevIntKey(e.key)

        const newValue = calculateValueByKeyDown(e.key)
        if (flag) onRightFocus?.()
        setFlag((prev) => !prev)
        const tempDate = new Date(date)
        setDate(setDateByPickerType(tempDate, newValue, picker, period))
      }
    }

    const handleClickButton = (action: 'increase' | 'decrease') => {
      handleTimeChange(action)
    }

    const handleScroll = (e: React.WheelEvent<HTMLInputElement>) => {
      handleTimeChange('scroll', e)
    }

    return (
      <div className='flex items-center'>
        <InputNumber
          controlButtons={false}
          ref={ref}
          id={id || picker}
          name={name || picker}
          className={cn(
            'text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none',
            className
          )}
          value={value || calculatedValue}
          onChange={(e) => {
            onChange?.(e)
          }}
          onWheel={handleScroll}
          type={type}
          inputMode='decimal'
          onKeyDown={(e) => {
            handleKeyDown(e)
          }}
          onIncrease={() => handleClickButton('increase')}
          onDecrease={() => handleClickButton('decrease')}
          {...props}
        />
      </div>
    )
  }
)

export { TimePickerInput, type TimePickerInputProps }
