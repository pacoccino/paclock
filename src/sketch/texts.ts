import P5 from 'p5'

import { Clock } from '../lib/clock'
import { theme } from '../themes'
import { Responsive } from '../sketch'

export function drawText(p: P5, clock: Clock, responsive: Responsive) {
  p.push()

  p.translate(p.width / 2, p.height / 2)

  /*
  p.noStroke()
  p.textAlign(p.CENTER, p.CENTER)
  p.textSize(responsive.baseFontWeight * 4)
  p.fill(theme.foreground)
  p.text(`${clock.now.format('HH:mm')}`, 0, 0)

  p.textSize(responsive.baseFontWeight * 1.5)
  p.fill(theme.f200)
  p.text(
    `☀️ ${clock.sunrise.format('HH:mm')} - ${clock.sunset.format('HH:mm')}`,
    0,
    responsive.baseFontWeight * 6
  )


  p.textSize(baseFontWeight)
  p.fill(theme.f400)
  p.text(
   [
     // clock.location.district,
     clock.location.zipcode,
     clock.location.country_code2,
   ]
     .filter((e) => !!e)
     .join(', '),
   0,
   -baseFontWeight * 4
  )
*/
  p.pop()
}
