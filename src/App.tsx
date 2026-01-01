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
            </tr>
          </thead>

          <tbody>
            {guesses.map((id) => {
              const category = characters.find((c) => c.id === id)

              return (
                <tr key={id}>
                  <td
                    style={{
                      backgroundColor: category && category.name === target.name ? 'lightgreen' : 'lightcoral',
                    }}
                  >
                    {category ? category.name : '-'}
                  </td>
                  <td
                    style={{
                      backgroundColor: category && category.firstGame === target.firstGame ? 'lightgreen' : 'lightcoral',
                    }}
                  >
                    {category ? category.firstGame : '-'}
                  </td>
                  <td
                    style={{
                      backgroundColor: category && category.mostRecent === target.mostRecent ? 'lightgreen' : 'lightcoral',
                    }}
                  >
                    {category ? category.mostRecent : '-'}
                  </td>
                  <td
                    style={{
                      backgroundColor: category && category.gender === target.gender ? 'lightgreen' : 'lightcoral',
                    }}
                  >
                    {category ? category.gender : '-'}
                  </td>
                  <td
                    style={{
                      backgroundColor: category && category.race === target.race ? 'lightgreen' : 'lightcoral',
                    }}
                  >
                    {category ? category.race : '-'}
                  </td>
                  <td
                    style={{
                      backgroundColor: category && category.origin === target.origin ? 'lightgreen' : 'lightcoral',
                    }}
                  >
                    {category ? category.origin : '-'}
                  </td>
                  <td
                    style={{
                      backgroundColor: category && category.height === target.height ? 'lightgreen' : 'lightcoral',
                    }}
                  >
                    {category ? category.height : '-'}
                  </td>
                  <td
                    style={{
                      backgroundColor: category && category.weight === target.weight ? 'lightgreen' : 'lightcoral',
                    }}
                  >
                    {category ? category.weight : '-'}
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
