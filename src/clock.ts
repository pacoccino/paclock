import moment, { Moment } from 'moment'
import { Location, Sun, Utils } from './lib/sun'
import { MoonLib, MoonState } from './lib/moon'

export enum ASTRONOMICAL_STATUS {
  DAY,
  NIGHT,
}

const TESTMODE = window.location.search === '?test'

export class Clock {
  now: Moment
  sunrise: Moment
  sunset: Moment
  noon: Moment
  astronomicalStatus: ASTRONOMICAL_STATUS
  timezone: number
  interval: number
  location: Location
  moon: MoonState

  constructor() {
    this.sunrise = moment({ hour: 0, minute: 0 })
    this.sunset = moment({ hour: 0, minute: 0 })
    this.noon = moment({ hour: 0, minute: 0 })

    this.moon = MoonLib.getState()

    this.location = {
      lat: 48.864716, // Paris
      long: 2.349014,
    }

    this.timezone = -new Date().getTimezoneOffset() / 60

    this.tick()
    this.getLocation()
  }

  start() {
    this.interval = setInterval(this.tick.bind(this), 1000)
  }

  getLocation() {
    const options = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000,
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.location.lat = position.coords.latitude
          this.location.long = position.coords.longitude
          console.log('location from geoloc', this.location)
        },
        (error) => {
          console.error(error)
        },
        options
      )
    }
  }
  /*
  async fetchByGeoloc() {
    const url = `https://api.sunrise-sunset.org/json?lat=${gps[0]}&lng=${gps[1]}&formatted=0`
    const res = await fetch(url)
    const json = await res.json()
    this.sunset = moment(json.results.sunset)
    this.sunrise = moment(json.results.sunrise)
  }
  async fetchByIP() {
    const url = `https://api.ipgeolocation.io/astronomy?apiKey=787a176c706241748f7446bf97660998`
    const res = await fetch(url)
    const json = await res.json()
    this.sunset = moment({
      hour: json.sunset.split(':')[0],
      minute: json.sunset.split(':')[1],
    })
    this.sunrise = moment({
      hour: json.sunrise.split(':')[0],
      minute: json.sunrise.split(':')[1],
    })
    this.noon = moment({
      hour: json.solar_noon.split(':')[0],
      minute: json.solar_noon.split(':')[1],
    })
    this.location = json.location
  }
  async fetchSun() {
    await this.fetchByIP()
  }
   */

  calculateSun() {
    const result = Sun.calculate(this.now, this.location, this.timezone)

    const sunnoon = Utils.minutesToHour(result.solnoon)
    const sunrise = Utils.minutesToHour(result.rise.timelocal)
    const sunset = Utils.minutesToHour(result.set.timelocal)

    this.sunset = moment({
      hour: sunset.hours,
      minute: sunset.minutes,
    })
    this.sunrise = moment({
      hour: sunrise.hours,
      minute: sunrise.minutes,
    })
    this.noon = moment({
      hour: sunnoon.hours,
      minute: sunnoon.minutes,
    })
  }

  tick() {
    if (this.now && TESTMODE) {
      this.now = this.now.add(30, 'minutes')
    } else {
      this.now = moment()
    }

    this.calculateSun()
    this.moon = MoonLib.getState()

    this.astronomicalStatus =
      this.now.isAfter(this.sunrise) && this.now.isBefore(this.sunset)
        ? ASTRONOMICAL_STATUS.DAY
        : ASTRONOMICAL_STATUS.NIGHT
  }
}
