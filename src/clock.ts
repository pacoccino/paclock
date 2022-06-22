import moment, { Moment } from 'moment'

export enum STATUS {
  DAY,
  NIGHT,
}

const gps = [48.864716, 2.349014] // paris

const TESTMODE = window.location.search === '?test'

export class Clock {
  now: Moment
  sunrise: Moment
  sunset: Moment
  noon: Moment
  astronomicalStatus: STATUS
  interval: number
  location: any

  constructor() {
    this.sunrise = moment({ hour: 0, minute: 0 })
    this.sunset = moment({ hour: 0, minute: 0 })
    this.tick()
  }

  start() {
    this.interval = setInterval(this.tick.bind(this), 1000)
    this.fetchSun().catch(console.error)
  }

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
    // TODO update every day
  }

  tick() {
    if (this.now && TESTMODE) {
      this.now = this.now.add(30, 'minutes')
    } else {
      this.now = moment({ hours: 0, minutes: 0 })
    }

    this.astronomicalStatus =
      this.now.isAfter(this.sunrise) && this.now.isBefore(this.sunset)
        ? STATUS.DAY
        : STATUS.NIGHT
  }
}
