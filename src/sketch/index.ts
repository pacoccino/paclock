import P5 from 'p5'
import { drawMoon } from './moon'
import { drawSun } from './sun'
import { drawText } from './texts'
import { theme } from '../themes'
import { Clock } from '../lib/clock'

export interface Responsive {
  minW: number
  sunRadius: number
  innerSunRadius: number
  moonRadius: number
  donutWidth: number
  baseFontWeight: number
}

export const clockSketch = (clock: Clock) => (p: P5) => {
  const responsive: Responsive = {
    minW: 0,
    sunRadius: 0,
    innerSunRadius: 0,
    moonRadius: 0,
    donutWidth: 0,
    baseFontWeight: 0,
  }

  const resize = () => {
    responsive.minW = Math.min(window.innerWidth, window.innerHeight)
    if (responsive.minW > 500) {
      responsive.sunRadius = (responsive.minW * 0.85) / 2
      responsive.donutWidth = 0.07 * responsive.sunRadius
      responsive.baseFontWeight = 12
    } else {
      responsive.sunRadius = (responsive.minW * 0.9) / 2
      responsive.donutWidth = 0.1 * responsive.sunRadius
      responsive.baseFontWeight = 8
    }
    responsive.innerSunRadius = responsive.sunRadius * 0.85
    responsive.moonRadius = responsive.minW * 0.14
  }

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight)
    p.background(theme.background)
    p.frameRate(1)
    resize()
  }

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight)
    resize()
  }

  p.draw = () => {
    // Clear the frame
    p.background(theme.background)

    drawSun(p, clock, responsive)
    drawText(p, clock, responsive)
    drawMoon(p, clock, responsive)
  }
}
