import P5 from 'p5'

import { ASTRONOMICAL_STATUS, Clock } from '../lib/clock'

import { theme } from '../themes'
import { Responsive } from '../sketch'

function clockToGeo(clock: Clock) {
  const dayMinutes = 24 * 60
  const sunriseMinutes = clock.sun.rise.timeLocal
  const sunsetMinutes = clock.sun.set.timeLocal
  const noonMinutes = clock.sun.noon.timeLocal
  const nowMinutes = clock.now.hours() * 60 + clock.now.minutes()

  const geoClock = {
    sunriseAngle: (2 * Math.PI * (sunriseMinutes - nowMinutes)) / dayMinutes,
    sunsetAngle: (2 * Math.PI * (sunsetMinutes - nowMinutes)) / dayMinutes,
    noonAngle: (2 * Math.PI * (noonMinutes - nowMinutes)) / dayMinutes,
  }
  return geoClock
}

function drawAngles(p: P5, clock: Clock, responsive: Responsive) {
  const d = responsive.sunRadius - responsive.donutWidth

  p.strokeWeight(1)
  p.textAlign(p.CENTER, p.CENTER)
  p.textSize(responsive.baseFontWeight * 1.8)

  function drawAngle(angle: number, icon: string) {
    let v1 = p.createVector(0, -d * 0.87)
    let v2 = p.createVector(0, -d * 0.07)
    let v3 = p.createVector(0, -d * 0.03)

    v1.rotate(p.radians(angle))
    v2.rotate(p.radians(angle))
    v3.rotate(p.radians(angle))
    p.text(icon, v1.x, v1.y)
    p.line(v1.x + v2.x, v1.y + v2.y, v1.x + v2.x + v3.x, v1.y + v2.y + v3.y)
  }

  p.fill(theme.cardinalDown)
  p.stroke(theme.cardinalDown)
  drawAngle(270, 'E')
  drawAngle(90, 'W')
  p.fill(theme.cardinalRaise)
  p.stroke(theme.cardinalRaise)
  drawAngle(0, 'S')
  drawAngle(180, 'N')

  // p.stroke(theme.f200)
  // drawAngle(clock.sun.set.azimuth, '👇')
  // drawAngle(clock.sun.rise.azimuth, '👆')
}

function drawElevation(p: P5, clock: Clock, responsive: Responsive) {
  p.noFill()
  p.stroke(theme.foreground)
  p.line(
    -responsive.sunRadius / 2,
    -responsive.sunRadius / 3,
    -responsive.sunRadius / 2,
    responsive.sunRadius / 3
  )
  p.line(-responsive.sunRadius / 2 - 5, 0, -responsive.sunRadius / 2 + 5, 0)
  p.line(
    -responsive.sunRadius / 2 - 5,
    -responsive.sunRadius / 3,
    -responsive.sunRadius / 2 + 5,
    -responsive.sunRadius / 3
  )
  p.line(
    -responsive.sunRadius / 2 - 5,
    responsive.sunRadius / 3,
    -responsive.sunRadius / 2 + 5,
    responsive.sunRadius / 3
  )

  p.noStroke()
  p.fill(theme.foreground)
  p.textAlign(p.RIGHT, p.CENTER)
  p.text('0°', -responsive.sunRadius / 2 - 12, 0)
  p.text('90°', -responsive.sunRadius / 2 - 12, -responsive.sunRadius / 3)
  p.text('-90°', -responsive.sunRadius / 2 - 12, responsive.sunRadius / 3)

  p.noStroke()
  p.fill(theme.sun)
  p.circle(
    -responsive.sunRadius / 2,
    -p.map(clock.sun.azel.elevation, 0, 90, 0, responsive.sunRadius / 3),
    15
  )
}
export function drawSun(p: P5, clock: Clock, responsive: Responsive) {
  const geoClock = clockToGeo(clock)

  p.push()

  p.translate(p.width / 2, p.height / 2)

  // ARC Night
  p.fill(theme.night)
  p.noStroke()
  p.arc(
    0,
    0,
    responsive.sunRadius * 2,
    responsive.sunRadius * 2,
    p.radians(clock.sun.set.azimuth) + Math.PI / 2,
    p.radians(clock.sun.rise.azimuth) + Math.PI / 2
  )

  // ARC Day
  p.fill(theme.day)
  p.noStroke()
  p.arc(
    0,
    0,
    responsive.sunRadius * 2,
    responsive.sunRadius * 2,
    p.radians(clock.sun.rise.azimuth) + Math.PI / 2,
    p.radians(clock.sun.set.azimuth) + Math.PI / 2
  )

  // Make donut hole
  p.fill(theme.background)
  p.noStroke()
  p.circle(0, 0, (responsive.sunRadius - responsive.donutWidth) * 2)

  // rings
  p.strokeWeight(2)
  // outer ring
  p.noFill()
  p.stroke(theme.foreground)
  p.circle(0, 0, responsive.sunRadius * 2)
  // inner ring
  p.noFill()
  p.stroke(theme.foreground)
  p.circle(0, 0, (responsive.sunRadius - responsive.donutWidth) * 2)

  p.noStroke()
  p.fill(theme.sun)
  let v1 = p.createVector(
    0,
    -responsive.sunRadius + (1 / 2) * responsive.donutWidth
  )
  v1.rotate(p.radians(clock.sun.azel.azimuth + 180))
  p.circle(v1.x, v1.y, responsive.donutWidth)

  // cursor
  // outer
  p.strokeWeight(2)
  p.noFill()
  p.stroke(theme.foreground)

  p.push()
  p.stroke(theme.sun)
  p.rotate(p.radians(clock.sun.azel.azimuth + 180))
  p.line(0, -0.4 * responsive.sunRadius, 0, -0.8 * responsive.sunRadius)
  p.pop()

  /*
  // solar noon
  p.rotate(geoClock.noonAngle)
  p.stroke(theme.f600)
  p.line(
    0,
    -responsive.sunRadius,
    0,
    -responsive.sunRadius + responsive.donutWidth
  )
  p.rotate(-geoClock.noonAngle)
   */

  drawElevation(p, clock, responsive)

  drawAngles(p, clock, responsive)
  p.pop()
}
