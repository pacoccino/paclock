import 'normalize.css'
import { createRoot } from 'react-dom/client'

import { ReactApp } from './react'
import './styles.css'

async function App() {
  const container = document.getElementById('root')
  const root = createRoot(container!)
  root.render(<ReactApp />)
}

App().catch(console.error)
