import { useState } from 'react'
import { Sketch } from './sketch'
import { Infos } from './infos'
import { Clock } from '../lib/clock'
import { theme } from '../themes'

const clock = new Clock()
clock.start()

export function ReactApp() {
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <div>
      <div
        className="fixed w-full h-full top-0 left-0 bottom-0 right-0"
        style={{ backgroundColor: theme.background }}
      />
      <div className="relative">
        <div className={infoOpen ? 'hidden' : 'visible'}>
          <Sketch clock={clock} />
        </div>
        <div className={infoOpen ? 'visible' : 'hidden'}>
          <Infos clock={clock} />
        </div>
        <div
          className="fixed right-0 top-0 m-4 text-xl cursor-pointer"
          onClick={() => setInfoOpen(!infoOpen)}
        >
          {infoOpen ? '🕘' : 'ℹ'}
        </div>
      </div>
    </div>
  )
}
