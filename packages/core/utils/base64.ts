export function JSONToBase64(value: object) {
  const json = JSON.stringify(value)
  return Buffer.from(json).toString('base64')
}

export function base64ToJSON(value: string): unknown {
  const json = Buffer.from(value, 'base64').toString()
  try {
    return JSON.parse(json)
  } catch (error) {
    throw new Error('Not valid json')
  }
}
