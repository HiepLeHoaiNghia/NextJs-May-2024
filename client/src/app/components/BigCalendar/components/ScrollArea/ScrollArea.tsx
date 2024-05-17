'use client'

import { useEffect, useRef, useState } from 'react'
import { ScrollArea, type ScrollAreaProps } from '@radix-ui/react-scroll-area'
import { cva, type VariantProps } from 'class-variance-authority'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { cn } from '~/@shadcn/utils'
import { Button } from '~/app/components/Button'

const scrollAreaVariants = cva(
  `h-72 w-full scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-black scrollbar-track-rounded-full scrollbar-thumb-rounded-full`,
  {
    variants: {
      scrollBar: {
        hidden: 'overflow-hidden',
        auto: 'overflow-auto',
        scrollX: 'overflow-x-auto overflow-y-hidden',
        scrollY: 'overflow-y-auto overflow-x-hidden'
      }
    },
    defaultVariants: {
      scrollBar: 'auto'
    }
  }
)

type CustomScrollAreaProps = ScrollAreaProps &
  VariantProps<typeof scrollAreaVariants> & {
    className?: string
    scrollBarClassName?: string
    children: React.ReactNode
    behavior?: ScrollBehavior
    scrollSettings?: {
      hoverScrollDistance?: number
      clickScrollDistance?: number
      speedStep?: number
    }
  }

const CustomScrollArea = ({
  behavior = 'auto',
  className,
  scrollBarClassName,
  children,
  scrollBar,
  scrollSettings: { hoverScrollDistance = 150, clickScrollDistance = 100, speedStep = 2 } = {},
  ...props
}: CustomScrollAreaProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [mouseEnterTime, setMouseEnterTime] = useState<number | null>(null)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  const checkScrollAbility = () => {
    if (scrollAreaRef.current) {
      setCanScrollUp(scrollAreaRef.current.scrollTop > 0)
      setCanScrollDown(
        scrollAreaRef.current.scrollTop < scrollAreaRef.current.scrollHeight - scrollAreaRef.current.clientHeight - 1
      )
    }
  }

  useEffect(() => {
    checkScrollAbility()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      checkScrollAbility()
    }

    const currentRef = scrollAreaRef.current

    currentRef?.addEventListener('scroll', handleScroll)

    return () => {
      currentRef?.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (scrollDirection && mouseEnterTime) {
      const intervalId = setInterval(() => {
        if (scrollAreaRef.current) {
          const elapsedTime = Date.now() - mouseEnterTime
          const speed = Math.min(speedStep, elapsedTime / 1000)
          const newScrollPosition =
            scrollDirection === 'up'
              ? Math.max(0, scrollAreaRef.current.scrollTop - hoverScrollDistance * speed)
              : Math.min(
                  scrollAreaRef.current.scrollHeight - scrollAreaRef.current.clientHeight,
                  scrollAreaRef.current.scrollTop + hoverScrollDistance * speed
                )
          scrollAreaRef.current.scrollTop = newScrollPosition
        }
      }, 100)

      return () => {
        clearInterval(intervalId)
      }
    }
    return undefined
  }, [scrollDirection, mouseEnterTime, behavior, hoverScrollDistance, speedStep])

  const handleMouseEnter = (direction: 'up' | 'down') => {
    setScrollDirection(direction)
    setMouseEnterTime(Date.now())
  }

  const handleMouseLeave = () => {
    setScrollDirection(null)
    setMouseEnterTime(null)
  }

  const handleClick = (direction: 'up' | 'down') => {
    if (scrollAreaRef.current) {
      const newScrollPosition =
        direction === 'up'
          ? Math.max(0, scrollAreaRef.current.scrollTop - clickScrollDistance)
          : Math.min(
              scrollAreaRef.current.scrollHeight - scrollAreaRef.current.clientHeight,
              scrollAreaRef.current.scrollTop + clickScrollDistance
            )
      scrollAreaRef.current.scrollTop = newScrollPosition
    }
  }

  return (
    <div className='relative flex h-72 flex-col items-center justify-center'>
      <Button
        variant='ghost'
        className={cn('flex w-full cursor-pointer items-center justify-center p-2', !canScrollUp && 'hidden')}
        onMouseEnter={() => handleMouseEnter('up')}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick('up')}
      >
        <ChevronUp className='h-4 w-4' />
      </Button>
      <ScrollArea ref={scrollAreaRef} className={cn(className, scrollAreaVariants({ scrollBar }))} {...props}>
        {children}
      </ScrollArea>
      <Button
        variant='ghost'
        className={cn('flex w-full cursor-pointer items-center justify-center p-2', !canScrollDown && 'hidden')}
        onMouseEnter={() => handleMouseEnter('down')}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick('down')}
      >
        <ChevronDown className='h-4 w-4' />
      </Button>
    </div>
  )
}

CustomScrollArea.displayName = 'ScrollArea'

export { CustomScrollArea }
export type { CustomScrollAreaProps }
