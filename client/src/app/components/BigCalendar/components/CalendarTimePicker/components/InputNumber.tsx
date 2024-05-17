'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { cn } from '~/@shadcn/utils'

export interface InputNumberProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof InputVariants> {
  wrapperSize?: VariantProps<typeof InputVariants>['wrapperSize']
  type?: React.InputHTMLAttributes<HTMLInputElement>['type']
  errorMessage?: string
  classNameWrapper?: string
  classNameInput?: string
  classNameError?: string
  controlButtons?: boolean
  maxValue?: number
  maxLength?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  onFocusOut?: (value: number) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

const InputVariants = cva(
  'flex items-center rounded-md border border-input text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: ''
      },
      wrapperSize: {
        default: 'h-8',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8'
      }
    },
    defaultVariants: {
      variant: 'default',
      wrapperSize: 'default'
    }
  }
)

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      type = 'tel',
      maxValue,
      maxLength,
      onIncrease,
      onDecrease,
      onType,
      onFocusOut,
      onKeyDown,
      errorMessage = true,
      className,
      classNameWrapper,
      classNameInput,
      classNameError,
      controlButtons = true,
      value: externalValue,
      onChange,
      wrapperSize,
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = React.useState<string | number>((externalValue || '') as string)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      if (/^\d+$/.test(value) || value === '') {
        let numericValue = Number(value)
        if (maxLength && value.length > maxLength) {
          numericValue = Number(value.slice(0, maxLength))
        }
        if (maxValue !== undefined && numericValue > maxValue) {
          numericValue = maxValue
        } else if (numericValue < 1) {
          numericValue = 0
        }
        onType && onType(numericValue)
        setLocalValue(numericValue)
        onChange && onChange(event)
      }
    }

    const increase = () => {
      let value = Number(externalValue || localValue) + 1
      if (maxValue !== undefined && value > maxValue) {
        value = maxValue
      }
      setLocalValue(value)
      onIncrease && onIncrease(value)
      onChange && onChange({ target: { value } } as unknown as React.ChangeEvent<HTMLInputElement>)
    }

    const decrease = () => {
      let value = Number(externalValue || localValue) - 1
      if (value < 1) {
        value = 0
      }
      setLocalValue(value)
      onDecrease && onDecrease(value)
      onChange && onChange({ target: { value } } as unknown as React.ChangeEvent<HTMLInputElement>)
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      onFocusOut && onFocusOut(Number(event.target.value))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Tab') return

      e.preventDefault()

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        increase()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        decrease()
      }
    }

    return (
      <>
        <div className={cn(InputVariants({ wrapperSize }), classNameWrapper)}>
          <input
            type={type}
            onBlur={handleBlur}
            className={cn('h-full w-full min-w-12 bg-background px-2', classNameInput)}
            value={externalValue === undefined ? localValue : externalValue}
            onKeyDown={onKeyDown || handleKeyDown}
            onChange={handleChange}
            ref={ref}
            {...props}
          />
          {controlButtons && (
            <div className='flex flex-col'>
              <button
                type='button'
                onClick={increase}
                className='flex h-full w-6 items-center justify-center rounded-md bg-transparent text-black hover:bg-slate-500'
                aria-label='Increment'
              >
                <ChevronUp className='w-4' />
              </button>
              <button
                type='button'
                className='flex h-full w-6 items-center justify-center rounded-md bg-transparent text-black hover:bg-slate-500'
                onClick={decrease}
                aria-label='Decrement'
              >
                <ChevronDown className='w-4' />
              </button>
            </div>
          )}
        </div>
        {errorMessage && <div className={cn('mt-1 min-h-5 text-sm text-red-600', classNameError)}>{errorMessage}</div>}
      </>
    )
  }
)

InputNumber.displayName = 'InputNumber'

export { InputNumber }
