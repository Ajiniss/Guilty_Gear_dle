import { dayKeyParis } from './lib/day'

export default function App() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Guilty Gear Dle</h1>
      <p>Day key: {dayKeyParis()}</p>
    </main>
  )
}

