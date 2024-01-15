import type { Metadata } from 'next'
import { base64ToJSON } from '@esusu/core/utils/base64'
import type { GameSchema } from '@esusu/core/models'
import { gameSchema } from '@esusu/core/models'
import { GameBoard } from '@/components/ui/game-board'

export const metadata: Metadata = {
  title: 'Four Connect | Playing'
}

type Props = {
  params: {
    gameId: string
  }
}

export default function FourConnectPage({ params }: Props) {
  const game = gameSchema._parse(base64ToJSON(decodeURIComponent(params.gameId)))

  if (game.issues) {
    throw new Error(
      `Validation error, please go back to game setup: ${game.issues.map(issue => issue.message).join(', ')}`
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <GameBoard players={2} gameSchema={game.output as GameSchema} />
    </div>
  )
}
