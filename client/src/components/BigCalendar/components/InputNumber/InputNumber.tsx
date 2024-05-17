'use client'

import * as React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { cn } from '~/@shadcn/utils'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onIncrement?: () => void
  onDecrement?: () => void
}

const InputNumber = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onIncrement, onDecrement, ...props }, ref) => {
    return (
      <div className='flex h-12 items-center rounded-md border border-input text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
        <input
          type={type}
          className={cn('h-full w-full min-w-12 bg-background px-2 py-2', className)}
          ref={ref}
          {...props}
        />
        <div className='flex flex-col'>
          {onIncrement && (
            <button
              type='button'
              onClick={onIncrement}
              className='flex w-6 items-center justify-center rounded-md bg-transparent text-black hover:bg-slate-500'
              aria-label='Increment'
            >
              <ChevronUp className='w-4' />
            </button>
          )}
          {onDecrement && (
            <button
              type='button'
              className='flex w-6 items-center justify-center rounded-md bg-transparent text-black hover:bg-slate-500'
              onClick={onDecrement}
              aria-label='Decrement'
            >
              <ChevronDown className='w-4' />
            </button>
          )}
        </div>
      </div>
    )
  }
)
InputNumber.displayName = 'InputNumber'

export { InputNumber, type InputProps }
