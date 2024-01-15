'use client'

import { Button } from '@/components/ui/button'

interface Props {
  error: Error
  reset: () => void
}

export default function NotFound({ error, reset }: Props) {
  return (
    <div className="container relative h-screen flex flex-col items-center justify-center gap-y-5">
      <p>{error.message}</p>
      <Button onClick={reset}>Retry</Button>
    </div>
  )
}
