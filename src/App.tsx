import { dayKeyLoad } from './lib/day'

export default function App() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Guilty Geardle</h1>
      <p>Day key: {dayKeyLoad()}</p>
    </main>
  )
}


