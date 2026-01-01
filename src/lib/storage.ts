export function saveGuesses(dayKey: string, guesses: string[]): void {
  const key = `ggdle:${dayKey}:guesses`
  localStorage.setItem(key, JSON.stringify(guesses))
}

export function loadGuesses(dayKey: string): string[] {
  const key = `ggdle:${dayKey}:guesses`
  const raw = localStorage.getItem(key)
  if (!raw) return []

  const parsed = JSON.parse(raw)
  return parsed
}
