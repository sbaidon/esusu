'use client'

import { type PlayerSchema } from '@esusu/core/models'
import { HOVERED_COLOR_CLASSES_PER_PLAYER } from '@esusu/core/styles/colors'
import { TestIds } from '@esusu/core/testing/ids'
import { Avatar, AvatarImage } from '@/components/ui/avatar'

type PlayerCardProps = {
  currentPlayer: number
  winner: number | null
  player: PlayerSchema
  playerId: number
}

export function PlayerCard({ player, winner, currentPlayer, playerId }: PlayerCardProps) {
  const isWinner = winner === playerId
  const isCurrentTurn = playerId === currentPlayer
  const currentColor = HOVERED_COLOR_CLASSES_PER_PLAYER[playerId]

  function getBackground() {
    if (isWinner) {
      return ''
    }
    if (!isCurrentTurn) {
      return 'opacity-50'
    }
    return ''
  }

  return (
    <div className={`p-4 flex-1 flex flex-col items-center mb-4 ${getBackground()}`}>
      <Avatar className="w-20 h-20">
        <AvatarImage src={`/${player.avatarId}`} alt="avatar" />
      </Avatar>
      <div className="flex-1 flex items-center">
        <h2
          className="text-2xl font-semibold m-4"
          data-testid={
            playerId === 0 ? TestIds.ConnectFourPlayerOneNameDisplay : TestIds.ConnectFourPlayerTwoNameDisplay
          }
        >
          {player.name}
        </h2>
        <div className={`${currentColor} rounded-full w-4 h-4`} />
      </div>
      {isWinner ? (
        <p
          className="text-xl"
          data-testid={playerId === 0 ? TestIds.ConnectFourPlayerOneWinner : TestIds.ConnectFourPlayerTwoWinner}
        >
          Winner 🎉
        </p>
      ) : null}
    </div>
  )
}
