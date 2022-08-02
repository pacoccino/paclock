import 'normalize.css'
import P5 from 'p5'

import { clockSketch } from './sketch'
import { Clock } from './clock'
// import { Test } from './lib/sun.test'

async function App() {
  //Test()
  const clock = new Clock()
  clock.start()
  new P5(clockSketch(clock), document.getElementById('sketch'))
}

App().catch(console.error)
