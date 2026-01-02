import { useState, useRef, useEffect } from 'react'
import { characters } from './lib/data'
import { dayKeyLoad } from './lib/day'
import { dailyCharacter } from './lib/daily'
import { loadGuesses, saveGuesses } from './lib/storage'
import './App.css'
import bgm from './assets/theme.mp3'

export default function App() {

  //Pour la zic
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return

    const start = () => {
      a.volume = 0.3
      a.play().catch(() => { })
      window.removeEventListener('pointerdown', start)
    }

    window.addEventListener('pointerdown', start)
  }, [])



  type Status = 'yes' | 'mid' | 'no'

  const yes = 'lightgreen'
  const mid = 'orange'
  const no = 'lightcoral'

  const dayKey = dayKeyLoad()
  // const dayKey = "1/3/2026"
  const target = dailyCharacter(dayKey)
  const attempts = 10

  const [selectedId, setSelectedId] = useState<string>(characters[0]?.id ?? '')
  const [guesses, setGuesses] = useState<string[]>(() => loadGuesses(dayKey))

  const won = guesses.length ? guesses[guesses.length - 1] === target.id : false
  const noAttempts = guesses.length >= attempts

  function bg(status: Status) {
    return status === 'yes' ? yes : status === 'mid' ? mid : no
  }

  function norm(x: unknown) {
    return String(x).trim().toLowerCase()
  }

  function matchArray(guess: unknown, targetV: unknown): Status {
    const guessArr = Array.isArray(guess) ? guess : []
    const targetArr = Array.isArray(targetV) ? targetV : []

    const guessSet = new Set(guessArr.map(norm))
    const targetSet = new Set(targetArr.map(norm))

    let common = 0
    for (const x of guessSet) if (targetSet.has(x)) common++

    if (common === 0) return 'no'
    if (guessSet.size === targetSet.size && common === guessSet.size) return 'yes'
    return 'mid'
  }

  function matchScalar(guess: unknown, targetV: unknown): Status {
    if (guess == null || targetV == null) return 'no'
    return norm(guess) === norm(targetV) ? 'yes' : 'no'
  }

  function matchAny(guess: unknown, targetV: unknown): Status {
    if (Array.isArray(guess) || Array.isArray(targetV)) return matchArray(guess, targetV)
    return matchScalar(guess, targetV)
  }

  function arrowNum(guess: unknown, targetV: unknown): string {
    const g = Number(guess)
    const t = Number(targetV)
    if (!Number.isFinite(g) || !Number.isFinite(t)) return ''
    if (g < t) return '↑'
    if (g > t) return '↓'
    return ''
  }

  function renderValue(value: unknown) {
    if (Array.isArray(value)) return value.join(', ')
    return value == null ? '-' : String(value)
  }

  function addGuess() {
    if (!selectedId) return
    if (won || noAttempts) return

    const next = [...guesses, selectedId]
    setGuesses(next)
    saveGuesses(dayKey, next)
  }

  function reset() {
    const next: string[] = []
    setGuesses(next)
    saveGuesses(dayKey, next)
  }

  return (
    <main className="page">
      <audio ref={audioRef} src={bgm} loop />

      <h1 className="title">Guilty Geardle</h1>

      <div className="status">
        {won && <h1>You Rock!</h1>}
        {!won && noAttempts && <h1>DEFEAT...</h1>}
      </div>

      <div className="content">
        <h3>Guess The Characters:</h3>

        <div className="controls">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={won || noAttempts}
          >
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button onClick={addGuess} disabled={won || noAttempts}>
            Go
          </button>
        </div>

        <div className="tableWrap">
          <table className="guessTable">
            <thead>
              <tr>
                <th className="colName">Name</th>
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

                const heightText = category
                  ? `${arrowNum(category.height, target.height)}${category.height}cm`
                  : '-'
                const weightText = category
                  ? `${arrowNum(category.weight, target.weight)}${category.weight}kg`
                  : '-'

                return (
                  <tr key={id}>
                    <td className="colName">{category ? category.name : '-'}</td>

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

                    <td style={{ backgroundColor: bg(heightS) }}>{heightText}</td>

                    <td style={{ backgroundColor: bg(weightS) }}>{weightText}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className="tries">
          Try: {guesses.length}/{attempts}
        </p>

        <div className="debug">
          <h3>Debug</h3>
          <p>Day key: {dayKey}</p>
          <p>Target id: {target.id}</p>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    </main>
  )
}

