import moment from 'moment'

import { Sun, Utils, Location } from './sun'

export function SunTest() {
  const date = moment.utc({
    year: 2022,
    month: 7,
    day: 2,
    hour: 12,
    minutes: 0,
    seconds: 0,
  })
  const location: Location = {
    lat: 52.33,
    long: 13.3,
  }
  const tz = 2

  console.log('date: ', date.format())

  const result = Sun.calculate(date, location, tz)

  console.log('res', result)

  const sunnoon = Utils.minutesToHour(result.solnoon)
  const sunrise = Utils.minutesToHour(result.rise.timelocal)
  const sunset = Utils.minutesToHour(result.set.timelocal)
  console.log(sunrise, sunset, sunnoon)
}
