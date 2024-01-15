// eslint-disable-next-line @typescript-eslint/triple-slash-reference -- Using declarations
/// <reference path="../../../declarations/uuid.d.ts" />

import { v4 as uuidv4 } from 'uuid'

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function randomUUID(): string {
  return uuidv4()
}
