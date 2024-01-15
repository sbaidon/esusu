import * as v from 'valibot'

export const player = v.object({
  name: v.string('name is required', [v.minLength(1, 'At least 1 character must be used')]),
  isAI: v.boolean(),
  avatarId: v.string()
})

export const gameSchema = v.object(
  {
    firstPlayer: player,
    secondPlayer: player
  },
  [
    v.forward(
      v.custom(input => {
        if (input.firstPlayer.isAI && input.secondPlayer.isAI) {
          return false
        }
        return true
      }, "How boring! Don't let two AIs play!"),
      ['secondPlayer']
    )
  ]
)

export type PlayerSchema = v.Input<typeof player>
export type GameSchema = v.Input<typeof gameSchema>
