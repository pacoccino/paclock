import { useState } from 'react'
import { Sketch } from './sketch'
import { Infos } from './infos'
import { Clock } from '../lib/clock'

const clock = new Clock()
clock.start()

export function ReactApp() {
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <div>
      <Sketch clock={clock} />
      {infoOpen && <Infos clock={clock} />}
      <h1>cc</h1>
      <div className="mode-switch" onClick={() => setInfoOpen(!infoOpen)}>
        x
      </div>
    </div>
  )
}
