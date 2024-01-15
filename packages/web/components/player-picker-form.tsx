'use client'

import type { UseControllerProps } from 'react-hook-form'
import { useForm, useController, Controller } from 'react-hook-form'
import type { GameSchema } from '@esusu/core/models'
import { TestIds } from '@esusu/core/testing/ids'
import { randomIntFromInterval } from '@esusu/core/utils/random'
import { gameSchema } from '@esusu/core/models'
import { AVATARS } from '@esusu/core/constants'
import { useRouter } from 'next/navigation'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from './ui/switch'

const numberOfAvatars = Object.keys(AVATARS).length

function getRandomAvatars(): [string, string] {
  const randomAvatar = randomIntFromInterval(1, numberOfAvatars)
  const nextAvatar = ((randomAvatar + 1) % numberOfAvatars) + 1
  return [AVATARS[randomAvatar], AVATARS[nextAvatar]]
}

export function PlayerPickerForm() {
  const router = useRouter()
  const [firstAvatar, secondAvatar] = getRandomAvatars()
  const { handleSubmit, control } = useForm<GameSchema>({
    resolver: valibotResolver(gameSchema),
    defaultValues: {
      firstPlayer: {
        name: '',
        isAI: false,
        avatarId: firstAvatar
      },
      secondPlayer: {
        name: '',
        isAI: false,
        avatarId: secondAvatar
      }
    }
  })

  function onSubmit(data: GameSchema) {
    const base64Data = Buffer.from(JSON.stringify(data)).toString('base64')
    router.push(`/four-connect/${base64Data}`)
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- Expected to work with react-hook-form
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap gap-4 justify-center">
        <Player control={control} player="firstPlayer" name="secondPlayer" />
        <Player control={control} player="secondPlayer" name="firstPlayer" />
      </div>
      <div className="flex justify-center">
        <Controller
          control={control}
          name="secondPlayer"
          render={({ fieldState }) => (
            <ErrorField data-testid={TestIds.ConnectFourPlayerAIError} message={fieldState.error?.root?.message} />
          )}
        />
      </div>
      <div className="flex justify-center pt-10">
        <Button className="m-auto" type="submit" data-testid={TestIds.ConnectFourPlayerSubmit}>
          Play!
        </Button>
      </div>
    </form>
  )
}

type PlayerProps = UseControllerProps<GameSchema> & {
  player: keyof GameSchema
}

function Player({ player, control }: PlayerProps) {
  const nameController = useController({
    name: `${player}.name`,
    control
  })
  const aiController = useController({
    name: `${player}.isAI`,
    control
  })
  const avatarController = useController({
    name: `${player}.avatarId`,
    control
  })

  return (
    <div data-testid={player === 'firstPlayer' ? TestIds.ConnectFourPlayerOne : TestIds.ConnectFourPlayerTwo}>
      <div className="flex justify-center mb-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={`/${avatarController.field.value}`} alt={`${player}-avatar`} />
        </Avatar>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Player {player === 'firstPlayer' ? 1 : 2}</h2>
      <div>
        <ErrorField
          data-testid={TestIds.ConnectFourPlayerNameError}
          message={nameController.fieldState.error?.message}
        />
        <Label>
          <Input
            className="w-64"
            data-testid={TestIds.ConnectFourPlayerName}
            placeholder="Enter Name"
            {...nameController.field}
            id={`${player}-name`}
          />
        </Label>
      </div>
      <div className="flex items-center justify-center mt-4">
        <Label className="mr-2" htmlFor={`${player}-ai`}>
          AI Player?
        </Label>
        <Switch
          id={`${player}-ai`}
          data-testid={TestIds.ConnectFourPlayerIsAi}
          checked={aiController.field.value}
          onCheckedChange={aiController.field.onChange}
        />
      </div>
    </div>
  )
}

type ErrorProps = {
  message?: string
  'data-testid'?: string
}

function ErrorField({ message, ...props }: ErrorProps) {
  if (!message) {
    return null
  }

  return (
    <p {...props} className="text-red-700 text-sm pt-4">
      {message}
    </p>
  )
}
