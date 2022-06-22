import 'normalize.css'
import P5 from 'p5'

import { mySketch } from './sketch'
import { Clock } from './clock'

async function App() {
  const clock = new Clock()
  clock.start()
  new P5(mySketch(clock), document.getElementById('sketch'))
}

App().catch(console.error)
