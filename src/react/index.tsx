import { useState } from 'react'
import { Sketch } from './sketch'
import { Infos } from './infos'
import { Clock } from '../lib/clock'

const clock = new Clock()
clock.start()

export function ReactApp() {
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <div className="relative">
      <div className={infoOpen ? 'hidden' : 'visible'}>
        <Infos clock={clock} />
      </div>
      <div className={infoOpen ? 'visible' : 'hidden'}>
        <Sketch clock={clock} />
      </div>
      <div
        className="absolute right-0 top-0 m-4"
        onClick={() => setInfoOpen(!infoOpen)}
      >
        +
      </div>
    </div>
  )
}
