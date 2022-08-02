import 'normalize.css'
import P5 from 'p5'

import { clockSketch } from './sketch'
import { Clock } from './clock'

async function App() {
  const clock = new Clock()
  clock.start()
  new P5(clockSketch(clock), document.getElementById('sketch'))
}

App().catch(console.error)
