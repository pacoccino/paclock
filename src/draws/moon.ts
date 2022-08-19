import P5 from 'p5'
import { Clock } from '../clock'
import { Responsive } from '../sketch'

export function drawMoon(p: P5, clock: Clock, responsive: Responsive) {
  const moon = clock.moon

  const r = responsive.moonRadius

  p.push()

  p.translate(p.width / 2, p.height / 2 - responsive.sunRadius / 2)

  /* TODO inclination
  const incl = p.HALF_PI - (clock.location.lat / 180) * p.PI
  p.rotate(incl)

  // if (clock.location.lat < 0) {
  // p.rotate(p.PI)
  // }

   */

  p.rectMode(p.CENTER)

  // outer ring
  p.strokeWeight(1)
  p.stroke(255)
  p.noFill()
  p.circle(0, 0, r)

  p.noStroke()

  if (moon.currentPhase < 2) {
    p.fill(255)
    p.circle(0, 0, r)

    const e = p.map(moon.ageNorm_n, 0, 0.25, 0, 1)

    p.fill(0)
    p.ellipse(0, 0, r * (1 - e), r)

    p.fill(0)
    p.arc(0, 0, r, r, p.HALF_PI, -p.HALF_PI)
  } else if (moon.currentPhase < 4) {
    p.fill(0)
    p.circle(0, 0, r)

    const e = p.map(moon.ageNorm_n, 0.25, 0.5, 0, 1)

    p.fill(255)
    p.ellipse(0, 0, r * e, r)

    p.fill(255)
    p.arc(0, 0, r, r, -p.HALF_PI, p.HALF_PI)
  } else if (moon.currentPhase < 6) {
    p.fill(0)
    p.circle(0, 0, r)

    const e = p.map(moon.ageNorm_n, 0.5, 0.75, 0, 1)

    p.fill(255)
    p.ellipse(0, 0, r * (1 - e), r)

    p.fill(255)
    p.arc(0, 0, r, r, p.HALF_PI, -p.HALF_PI)
  } else {
    p.fill(255)
    p.circle(0, 0, r)

    const e = p.map(moon.ageNorm_n, 0.75, 1, 0, 1)

    p.fill(0)
    p.ellipse(0, 0, r * e, r)

    p.fill(0)
    p.arc(0, 0, r, r, -p.HALF_PI, p.HALF_PI)
  }

  p.pop()
}
