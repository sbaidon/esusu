'use client'

import { TestIds } from '@esusu/core/testing/ids'
import { Link } from '@/components/ui/link'

interface Props {
  error: Error
}

export default function GameError({ error }: Props) {
  return (
    <div className="container relative h-screen flex flex-col items-center justify-center gap-y-5">
      <p data-testid={TestIds.ConnectFourParseSchemaError}>{error.message}</p>
      <Link href="/four-connect">Back to game setup</Link>
    </div>
  )
}
