import 'normalize.css'
import { createRoot } from 'react-dom/client'

import { ReactApp } from './react'
import './styles.css'

// import { SunTest } from './lib/sun.test'
// import { MoonTest } from './lib/moon.test'

async function App() {
  // MoonTest()

  const container = document.getElementById('root')
  const root = createRoot(container!)
  root.render(<ReactApp />)
}

App().catch(console.error)
