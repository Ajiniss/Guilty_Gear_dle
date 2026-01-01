import { useMemo, useState } from 'react'
import { characters } from './lib/data'
import { dayKeyLoad } from './lib/day'
import { dailyCharacter } from './lib/daily'
import { loadGuesses, saveGuesses } from './lib/storage'

const ATTEMPTS = 10

export default function App() {

  const dayKey = dayKeyLoad()
  const target = dailyCharacter(dayKey)



  return (
    <main style={{ padding: 24 }}>
      <h1>Guilty Geardle</h1>

      <p> daykey = {dayKey}</p>
      <p> target = {target.id}</p>
    </main>
  )
}
