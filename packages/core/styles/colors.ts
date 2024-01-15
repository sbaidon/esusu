import { FourConnect } from '../four-connect'

export const COLOR_CLASSES_PER_PLAYER: Record<string, string> = {
  [FourConnect.mark]: 'bg-gray-200',
  0: 'bg-green-300',
  1: 'bg-yellow-300'
}

export const HOVERED_COLOR_CLASSES_PER_PLAYER: Record<string, string> = {
  0: 'bg-green-200',
  1: 'bg-yellow-200'
}
