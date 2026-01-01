import { characters } from './data'
import { dayKeyLoad } from './day'
import { hashString } from './hash'
import type { Character } from './types'

export function dailyIndex(dayKey = dayKeyLoad()): number {
  const n = characters.length
  if (n === 0) throw new Error('No characters in dataset')
  return hashString(dayKey) % n
}

export function dailyCharacter(dayKey = dayKeyLoad()): Character {
  return characters[dailyIndex(dayKey)]
}
