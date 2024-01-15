import type { LinkProps } from 'next/link'
import NextLink from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = LinkProps & {
  children: ReactNode
  className?: string
}

export function Link({ children, className, ...props }: Props) {
  return (
    <NextLink {...props} className={cn('font-light decoration-blue-500 underline', className)}>
      {children}
    </NextLink>
  )
}

export function NavLink({ children, className, ...props }: Props) {
  return (
    <NextLink
      {...props}
      className={cn(className, 'font-medium text-lg transition-colors hover:text-primary hover:font-thin')}
    >
      {children}
    </NextLink>
  )
}
