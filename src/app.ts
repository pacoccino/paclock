import 'normalize.css'
import P5 from 'p5'

import { clockSketch } from './sketch'
import { Clock } from './clock'
// import { SunTest } from './lib/sun.test'
import { MoonTest } from './lib/moon.test'

async function App() {
  MoonTest()

  const clock = new Clock()
  clock.start()
  new P5(clockSketch(clock), document.getElementById('sketch'))
}

App().catch(console.error)
