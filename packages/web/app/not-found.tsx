'use client'

import Image from 'next/image'
import { Link } from '@/components/ui/link'

export default function NotFound() {
  return (
    <div className="container relative h-screen flex flex-col items-center justify-center gap-y-5">
      <Image alt="esusu" height={150} src="/esusu-logo.svg" width={150} />
      <h1>
        You got lost! Let&apos;s go <Link href="/four-connect">to play.</Link>
      </h1>
    </div>
  )
}
