import P5 from 'p5'

import { ASTRONOMICAL_STATUS, Clock } from '../lib/clock'

import { theme } from '../themes'
import { Responsive } from '../sketch'

export class SunSketch {
  p: P5
  clock: Clock
  responsive: Responsive

  constructor(p: P5, clock: Clock, responsive: Responsive) {
    this.p = p
    this.clock = clock
    this.responsive = responsive
  }

  draw() {
    this.p.push()
    this.p.translate(this.p.width / 2, this.p.height / 2)

    this.drawDonut()
    this.drawElevation()
    this.drawCompass()
    this.drawAiguilles()

    this.p.pop()
  }

  drawAiguilles() {
    // Sun
    this.p.strokeWeight(1)
    this.p.stroke(theme.f600)
    this.p.fill(theme.sun)
    let sunPosition = this.p.createVector(
      0,
      -this.responsive.sunRadius + (1 / 2) * this.responsive.donutWidth
    )
    sunPosition.rotate(this.p.radians(this.clock.sun.azel.azimuth + 180))
    this.p.circle(sunPosition.x, sunPosition.y, this.responsive.donutWidth + 15)

    // aiguille
    this.p.push()
    this.p.noFill()
    this.p.strokeWeight(2)
    this.p.stroke(theme.sun)
    this.p.rotate(this.p.radians(this.clock.sun.azel.azimuth + 180))
    this.p.line(
      0,
      -0.4 * this.responsive.sunRadius,
      0,
      -0.8 * this.responsive.sunRadius
    )
    this.p.pop()
  }

  drawDonut() {
    // ARC Night
    this.p.fill(theme.night)
    this.p.noStroke()
    this.p.arc(
      0,
      0,
      this.responsive.sunRadius * 2,
      this.responsive.sunRadius * 2,
      this.p.radians(this.clock.sun.set.azimuth) + Math.PI / 2,
      this.p.radians(this.clock.sun.rise.azimuth) + Math.PI / 2
    )

    // ARC Day
    this.p.fill(theme.day)
    this.p.noStroke()
    this.p.arc(
      0,
      0,
      this.responsive.sunRadius * 2,
      this.responsive.sunRadius * 2,
      this.p.radians(this.clock.sun.rise.azimuth) + Math.PI / 2,
      this.p.radians(this.clock.sun.set.azimuth) + Math.PI / 2
    )

    // Make donut hole
    this.p.fill(theme.background)
    this.p.noStroke()
    this.p.circle(
      0,
      0,
      (this.responsive.sunRadius - this.responsive.donutWidth) * 2
    )

    // rings
    this.p.strokeWeight(2)
    // outer ring
    this.p.noFill()
    this.p.stroke(theme.foreground)
    this.p.circle(0, 0, this.responsive.sunRadius * 2)
    // inner ring
    this.p.noFill()
    this.p.stroke(theme.foreground)
    this.p.circle(
      0,
      0,
      (this.responsive.sunRadius - this.responsive.donutWidth) * 2
    )

    /*
    // goldens
    this.p.push()
    this.p.rotate(this.p.radians(this.clock.sun.set.azimuth + 180))
    this.p.noFill()
    this.p.strokeWeight(1)
    this.p.stroke(theme.sun)
    const bluecolor = this.p.createVector(0, 0.21, 0.96)
    const goldencolor = this.p.createVector(1, 0.8, 0.08)
    const subcolor = P5.Vector.sub(bluecolor, goldencolor)
    for (let i = -30; i < 30; i++) {
      this.p.push()
      const color = P5.Vector.add(
        goldencolor,
        P5.Vector.mult(subcolor, (i + 30) * (1 / 60))
      ).mult(255)
      this.p.stroke(color.array())
      this.p.rotate(this.p.radians(i / 8))
      this.p.line(
        0,
        -this.responsive.sunRadius + 1,
        0,
        -this.responsive.sunRadius + this.responsive.donutWidth - 1
      )
      this.p.pop()
    }
    this.p.pop()*/
  }

  drawElevation() {
    const xOffset = -this.responsive.sunRadius / 2
    const height = this.responsive.sunRadius / 4
    this.p.noFill()
    this.p.stroke(theme.f400)
    this.p.line(xOffset, -height, xOffset, height)
    this.p.line(xOffset - 5, 0, xOffset + 5, 0)
    this.p.line(xOffset - 5, -height, xOffset + 5, -height)
    this.p.line(xOffset - 5, height, xOffset + 5, height)

    this.p.noStroke()
    this.p.fill(theme.f400)
    this.p.textAlign(this.p.RIGHT, this.p.CENTER)
    this.p.text('0°', xOffset - 12, 0)
    this.p.text('90°', xOffset - 12, -height)
    this.p.text('-90°', xOffset - 12, height)

    this.p.noStroke()
    this.p.fill(theme.sun)
    this.p.circle(
      xOffset,
      -this.p.map(this.clock.sun.azel.elevation, 0, 90, 0, height),
      15
    )
  }
  drawCompass() {
    const d = this.responsive.sunRadius - this.responsive.donutWidth

    this.p.textAlign(this.p.CENTER, this.p.CENTER)
    this.p.textSize(this.responsive.baseFontWeight * 1.6)

    const drawAngle = (angle: number, icon: string, color: string) => {
      let v1 = this.p.createVector(0, -d * 0.89) // center
      let v2 = this.p.createVector(0, -d * 0.05) // line margin
      let v3 = this.p.createVector(0, -d * 0.03) // line length

      v1.rotate(this.p.radians(angle))
      v2.rotate(this.p.radians(angle))
      v3.rotate(this.p.radians(angle))

      this.p.noStroke()
      this.p.fill(color)
      this.p.text(icon, v1.x, v1.y)

      this.p.noFill()
      this.p.stroke(color)
      this.p.line(
        v1.x + v2.x,
        v1.y + v2.y,
        v1.x + v2.x + v3.x,
        v1.y + v2.y + v3.y
      )
    }

    drawAngle(270, 'E', theme.cardinalDown)
    drawAngle(90, 'W', theme.cardinalDown)
    drawAngle(0, 'S', theme.cardinalRaise)
    drawAngle(180, 'N', theme.cardinalRaise)
  }
}
