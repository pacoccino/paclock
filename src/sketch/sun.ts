import P5 from 'p5'

import { ASTRONOMICAL_STATUS, Clock } from '../lib/clock'

import { theme } from '../themes'
import { Responsive } from '../sketch'

function clockToGeo(clock) {
  const dayMinutes = 24 * 60
  const sunriseMinutes = clock.sunrise.hours() * 60 + clock.sunrise.minutes()
  const sunsetMinutes = clock.sunset.hours() * 60 + clock.sunset.minutes()
  const noonMinutes = clock.noon.hours() * 60 + clock.noon.minutes()
  const nowMinutes = clock.now.hours() * 60 + clock.now.minutes()

  const geoClock = {
    sunriseAngle: (2 * Math.PI * (sunriseMinutes - nowMinutes)) / dayMinutes,
    sunsetAngle: (2 * Math.PI * (sunsetMinutes - nowMinutes)) / dayMinutes,
    noonAngle: (2 * Math.PI * (noonMinutes - nowMinutes)) / dayMinutes,
  }
  return geoClock
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
    geoClock.sunsetAngle - Math.PI / 2,
    geoClock.sunriseAngle - Math.PI / 2
  )

  // ARC Day
  p.fill(theme.day)
  p.noStroke()
  p.arc(
    0,
    0,
    responsive.sunRadius * 2,
    responsive.sunRadius * 2,
    geoClock.sunriseAngle - Math.PI / 2,
    geoClock.sunsetAngle - Math.PI / 2
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

  // cursor
  // outer
  p.strokeWeight(2)
  p.noFill()
  p.stroke(theme.foreground)
  p.line(
    0,
    -responsive.sunRadius - (1 / 2) * responsive.donutWidth,
    0,
    -responsive.sunRadius + (3 / 2) * responsive.donutWidth
  )
  // inner
  p.stroke(
    clock.astronomicalStatus === ASTRONOMICAL_STATUS.DAY
      ? theme.background
      : theme.foreground
  )
  p.line(
    0,
    -responsive.sunRadius,
    0,
    -responsive.sunRadius + responsive.donutWidth
  )
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

  p.pop()
}
