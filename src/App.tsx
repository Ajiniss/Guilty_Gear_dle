import { useState } from 'react'
import { characters } from './lib/data'
import { dayKeyLoad } from './lib/day'
import { dailyCharacter } from './lib/daily'
import { loadGuesses, saveGuesses } from './lib/storage'

export default function App() {

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

      <p>
        Try: {guesses.length}/{attempts}
      </p>

      <div>
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

      </div>

      <div>
        {won && <p> You Win</p>}
        {!won && noAttempts && <p>No more Try</p>}
      </div>

      <h3>History</h3>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>First Game</th>
            <th>Most Recent</th>
            <th>Gender</th>
            <th>Race</th>
            <th>Origin</th>
          </tr>
        </thead>

        <tbody>
          {guesses.map((id) => {
            const category = characters.find((c) => c.id === id)

            return (
              <tr key={id}>
                <td>{category ? category.name : id}</td>
                <td>{category ? category.firstGame : '-'}</td>
                <td>{category ? category.mostRecent : '-'}</td>
                <td>{category ? category.gender : '-'}</td>
                <td>{category ? category.race : '-'}</td>
                <td>{category ? category.origin : '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/*DEBUG*/}
      <h3>Debug</h3>
      <p>Day key: {dayKey}</p>
      <p>Target id: {target.id}</p>
      <button onClick={reset}>
        Reset
      </button>
    </main >)
}
