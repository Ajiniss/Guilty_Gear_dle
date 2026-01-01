import { useState } from 'react'
import { characters } from './lib/data'
import { dayKeyLoad } from './lib/day'
import { dailyCharacter } from './lib/daily'
import { loadGuesses, saveGuesses } from './lib/storage'

export default function App() {

  type Status = 'yes' | 'mid' | 'no'

  const yes = 'lightgreen'
  const mid = 'orange'
  const no = 'lightcoral'

  const dayKey = dayKeyLoad()
  const target = dailyCharacter(dayKey)
  const attempts = 10

  const [selectedId, setSelectedId] = useState<string>(characters[0]?.id ?? '')
  const [guesses, setGuesses] = useState<string[]>(() => loadGuesses(dayKey))

  const won =
    guesses.length
      ? guesses[guesses.length - 1] === target.id
      : false

  const noAttempts = guesses.length >= attempts

  //Game dl
  function bg(status: Status) {
    return status === 'yes' ? yes : status === 'mid' ? mid : no
  }

  function norm(x: unknown) {
    return String(x).trim().toLowerCase()
  }

  function matchArray(guess: unknown, target: unknown): Status {
    const guessTableau = Array.isArray(guess) ? guess : []
    const targetTableau = Array.isArray(target) ? target : []

    const guessSet = new Set(guessTableau.map(norm))
    const targetSet = new Set(targetTableau.map(norm))

    let common = 0
    for (const x of guessSet) if (targetSet.has(x)) common++

    if (common === 0) return 'no'
    if (guessSet.size === targetSet.size && common === guessSet.size) return 'yes'
    return 'mid'
  }

  function matchScalar(guess: unknown, target: unknown): Status {
    if (guess == null || target == null) return 'no'
    return norm(guess) === norm(target) ? 'yes' : 'no'
  }

  function matchAny(guess: unknown, target: unknown): Status {
    if (Array.isArray(guess) || Array.isArray(target)) return matchArray(guess, target)
    return matchScalar(guess, target)
  }

  function arrowNum(guess: unknown, target: unknown): string {
    const g = Number(guess)
    const t = Number(target)
    if (!Number.isFinite(g) || !Number.isFinite(t)) return ''
    if (g < t) return '^'
    if (g > t) return 'v'
    return ''
  }

  function renderValue(value: unknown) {
    if (Array.isArray(value)) return value.join(', ')
    return value == null ? '-' : String(value)
  }

  //UI

  function addGuess() {
    if (!selectedId) return
    if (won || noAttempts) return

    const next = [...guesses, selectedId]
    setGuesses(next)
    saveGuesses(dayKey, next)
  }

  //DEBUG
  function reset() {
    const next: string[] = []
    setGuesses(next)
    saveGuesses(dayKey, next)
  }

  return (
    <main style={{ padding: 24, maxWidth: 760 }}>
      <h1 style={{ textAlign: "center" }}>Guilty Gear Dle</h1>

      <div>
        {won && <h1>You Rock!</h1>}
        {!won && noAttempts && <h1>DEFAT...</h1>}
      </div>

      <div>

        <h3>Guess The Characters:</h3>

        {/*TODO: le bouton est trop gros*/}
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={won || noAttempts} >
          {characters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button onClick={addGuess}>
          Go
        </button>

        {/*TODO: mettre les couleurs sur le css*/}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>First Game</th>
              <th>Most Recent</th>
              <th>Gender</th>
              <th>Race</th>
              <th>Origin</th>
              <th>Height</th>
              <th>Weight</th>
            </tr>
          </thead>

          <tbody>
            {guesses.map((id) => {
              const category = characters.find((c) => c.id === id)

              const firstGameS = matchAny(category?.firstGame, target.firstGame)
              const mostRecentS = matchAny(category?.mostRecent, target.mostRecent)
              const genderS = matchAny(category?.gender, target.gender)
              const raceS = matchAny(category?.race, target.race)
              const originS = matchAny(category?.origin, target.origin)

              const heightS = matchAny(category?.height, target.height)
              const weightS = matchAny(category?.weight, target.weight)

              const heightText = category ? `${category.height}${arrowNum(category.height, target.height)}` : '-'
              const weightText = category ? `${category.weight}${arrowNum(category.weight, target.weight)}` : '-'

              return (
                <tr key={id}>
                  <td>{category ? category.name : '-'}</td>

                  <td style={{ backgroundColor: bg(firstGameS) }}>
                    {category ? renderValue(category.firstGame) : '-'}
                  </td>

                  <td style={{ backgroundColor: bg(mostRecentS) }}>
                    {category ? renderValue(category.mostRecent) : '-'}
                  </td>

                  <td style={{ backgroundColor: bg(genderS) }}>
                    {category ? renderValue(category.gender) : '-'}
                  </td>

                  <td style={{ backgroundColor: bg(raceS) }}>
                    {category ? renderValue(category.race) : '-'}
                  </td>

                  <td style={{ backgroundColor: bg(originS) }}>
                    {category ? renderValue(category.origin) : '-'}
                  </td>

                  <td style={{ backgroundColor: bg(heightS) }}>
                    {heightText} cm
                  </td>

                  <td style={{ backgroundColor: bg(weightS) }}>
                    {weightText}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p>
        Try: {guesses.length}/{attempts}
      </p>

      {/*DEBUG*/}
      <h3>Debug</h3>
      <p>Day key: {dayKey}</p>
      <p>Target id: {target.id}</p>
      <button onClick={reset}>
        Reset
      </button>
    </main >)
}
