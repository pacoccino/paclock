import moment from 'moment'

import { MoonLib } from './moon'

export function MoonTest() {
  const moon = MoonLib.getState()

  console.log('moon: ', moon)
}
