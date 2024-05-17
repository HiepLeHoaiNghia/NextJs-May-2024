'use client'

import type React from 'react'
import { useState } from 'react'
import { type SelectProps } from '@radix-ui/react-select/dist'

import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue } from '~/@shadcn/components/ui/select'
import { cn } from '~/@shadcn/utils'

type SelectItemType = string | number | Record<string, string | number>

interface CustomSelectProps extends SelectProps {
  placeholder?: string
  triggerClassName?: string
  contentClassName?: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  scrollable?: boolean
}

const CustomSelect = ({
  value,
  placeholder,
  onValueChange,
  triggerClassName,
  contentClassName,
  children,
  scrollable,
  ...props
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Select open={isOpen} onOpenChange={setIsOpen} value={value} onValueChange={onValueChange} {...props}>
      <SelectTrigger isOpen={isOpen} className={cn('dark:text-gray-light flex-1 whitespace-nowrap', triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent scrollable={scrollable} className={cn('max-h-[10rem] overflow-y-auto', contentClassName)}>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  )
}

export { CustomSelect, type SelectItemType }
