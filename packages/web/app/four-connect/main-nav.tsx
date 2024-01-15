'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Link } from '@/components/ui/link'

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      <Link href="/four-connect">
        <Image alt="esusu" src="/esusu-logo.svg" height={75} width={75} />
      </Link>
    </nav>
  )
}
