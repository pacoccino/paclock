import { STATUS } from './clock'

const colors = {
  background: 15,
  foreground: 240,
  f200: 200,
  f600: 100,
}

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

export const mySketch = (clock) => (p) => {
  let rayon = (Math.min(window.innerWidth, window.innerHeight) * 0.8) / 2
  let donutWidth = 0.05 * rayon

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight)
    p.background(colors.background)
    p.frameRate(1)
  }

  p.draw = () => {
    // Clear the frame
    p.background(colors.background)

    p.translate(p.width / 2, p.height / 2)

    const geoClock = clockToGeo(clock)
    // ARC Night
    p.fill(colors.background)
    p.noStroke()
    p.arc(
      0,
      0,
      rayon * 2,
      rayon * 2,
      geoClock.sunsetAngle,
      geoClock.sunriseAngle
    )

    // ARC Day
    p.fill(colors.foreground)
    p.noStroke()
    p.arc(
      0,
      0,
      rayon * 2,
      rayon * 2,
      geoClock.sunriseAngle - Math.PI / 2,
      geoClock.sunsetAngle - Math.PI / 2
    )

    // Make donut hole
    p.fill(colors.background)
    p.noStroke()
    p.circle(0, 0, (rayon - donutWidth) * 2)

    // rings
    p.strokeWeight(2)
    // outer ring
    p.stroke(colors.foreground)
    p.noFill()
    p.circle(0, 0, rayon * 2)
    // inner ring
    p.noFill()
    p.stroke(colors.foreground)
    p.circle(0, 0, (rayon - donutWidth) * 2)

    // cursor
    // outer
    p.strokeWeight(2)
    p.noFill()
    p.stroke(colors.foreground)
    p.line(0, -rayon - donutWidth, 0, -rayon + 2 * donutWidth)
    // inner
    p.stroke(
      clock.astronomicalStatus === STATUS.DAY
        ? colors.background
        : colors.foreground
    )
    p.line(0, -rayon, 0, -rayon + donutWidth)
    // solar noon
    p.rotate(geoClock.noonAngle)
    p.stroke(colors.f600)
    p.line(0, -rayon, 0, -rayon + donutWidth)
    p.rotate(-geoClock.noonAngle)

    // texts
    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(64)
    p.fill(colors.foreground)
    p.text(`${clock.now.format('HH:mm')}`, 0, 0)
    p.strokeWeight(1)
    p.textSize(24)
    p.fill(colors.f200)
    p.text(
      `${clock.sunrise.format('HH:mm')} - ${clock.sunset.format('HH:mm')}`,
      0,
      60
    )
    p.textSize(14)
    p.fill(colors.f600)
    p.text(
      [
        clock.location.district,
        clock.location.zipcode,
        clock.location.country_code2,
      ]
        .filter((e) => !!e)
        .join(', '),
      0,
      100
    )
  }

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight)
    rayon = (Math.min(window.innerWidth, window.innerHeight) * 0.8) / 2
    donutWidth = 0.05 * rayon
  }
}
