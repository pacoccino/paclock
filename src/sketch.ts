import P5 from 'p5'
import { drawMoon } from './draws/moon'
import { drawSun } from './draws/sun'
import { drawText } from './draws/texts'
import { theme } from './themes'

export interface Responsive {
  minW: number
  sunRadius: number
  moonRadius: number
  donutWidth: number
  baseFontWeight: number
}

export const clockSketch = (clock) => (p: P5) => {
  const responsive: Responsive = {
    minW: 0,
    sunRadius: 0,
    moonRadius: 0,
    donutWidth: 0,
    baseFontWeight: 0,
  }

  const resize = () => {
    responsive.minW = Math.min(window.innerWidth, window.innerHeight)
    if (responsive.minW > 500) {
      responsive.sunRadius = (responsive.minW * 0.85) / 2
      responsive.donutWidth = 0.07 * responsive.sunRadius
      responsive.baseFontWeight = 14
    } else {
      responsive.sunRadius = (responsive.minW * 0.9) / 2
      responsive.donutWidth = 0.1 * responsive.sunRadius
      responsive.baseFontWeight = 10
    }
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
