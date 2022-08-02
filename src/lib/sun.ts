/*
Highly inspired by  https://gml.noaa.gov/grad/solcalc/ algorithm
*/

import moment from 'moment'

export interface Hour {
  hours: number
  minutes: number
  seconds: number
}

export interface Location {
  lat: number
  long: number
}

interface SunResult {
  date: moment.Moment
  location: Location
  timezone: number
  jday: number
  jcent: number
  azel: {
    azimuth: number
    elevation: number
  }
  sunDeclination: number
  solnoon: number
  eqTime: number
  set: {
    jday: number
    azimuth: number
    timelocal: number
  }
  rise: {
    jday: number
    azimuth: number
    timelocal: number
  }
}

type AngleRad = number
type AngleDeg = number

const Utils = {
  minutesToHour(min: number): Hour {
    const hours = Math.floor(min / 60)
    const minutes = Math.floor(min - hours * 60)
    const seconds = (min - hours - minutes) / 60
    return {
      hours,
      minutes,
      seconds,
    }
  },
  hourToMinutes(hour: Hour): number {
    return hour.hours * 60 + hour.minutes + hour.seconds / 60
  },
  minutesToDegrees(minutes: number): number {
    return (minutes / 1440) * 360
  },
  radToDeg(angleRad: AngleRad) {
    return (180.0 * angleRad) / Math.PI
  },
  degToRad(angleDeg: AngleDeg) {
    return (Math.PI * angleDeg) / 180.0
  },
  isNumber(inputVal) {
    let oneDecimal = false
    const inputStr = '' + inputVal
    for (let i = 0; i < inputStr.length; i++) {
      const oneChar = inputStr.charAt(i)
      if (i == 0 && (oneChar == '-' || oneChar == '+')) {
        continue
      }
      if (oneChar == '.' && !oneDecimal) {
        oneDecimal = true
        continue
      }
      if (oneChar < '0' || oneChar > '9') {
        return false
      }
    }
    return true
  },
}

const Sun = {
  calcTimeJulianCent(jd: number): number {
    const T = (jd - 2451545.0) / 36525.0
    return T
  },
  calcJDFromJulianCent(t: number): number {
    const JD = t * 36525.0 + 2451545.0
    return JD
  },
  isLeapYear(yr: number) {
    return (yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0
  },
  calcDateFromJD(jd) {
    const z = Math.floor(jd + 0.5)
    const f = jd + 0.5 - z
    let A
    if (z < 2299161) {
      A = z
    } else {
      const alpha = Math.floor((z - 1867216.25) / 36524.25)
      A = z + 1 + alpha - Math.floor(alpha / 4)
    }
    const B = A + 1524
    const C = Math.floor((B - 122.1) / 365.25)
    const D = Math.floor(365.25 * C)
    const E = Math.floor((B - D) / 30.6001)
    const day = B - D - Math.floor(30.6001 * E) + f
    const month = E < 14 ? E - 1 : E - 13
    const year = month > 2 ? C - 4716 : C - 4715

    return { year: year, month: month, day: day }
  },
  calcDoyFromJD(jd) {
    const date = Sun.calcDateFromJD(jd)

    const k = Sun.isLeapYear(date.year) ? 1 : 2
    const doy =
      Math.floor((275 * date.month) / 9) -
      k * Math.floor((date.month + 9) / 12) +
      date.day -
      30

    return doy
  },
  calcGeomMeanLongSun(jcent) {
    let L0 = (280.46646 + jcent * (36000.76983 + jcent * 0.0003032)) % 360
    return L0 // in degrees
  },

  calcGeomMeanAnomalySun(t) {
    const M = 357.52911 + t * (35999.05029 - 0.0001537 * t)
    return M // in degrees
  },

  calcEccentricityEarthOrbit(t) {
    const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t)
    return e // unitless
  },

  calcSunEqOfCenter(t) {
    const m = Sun.calcGeomMeanAnomalySun(t)
    const mrad = Utils.degToRad(m)
    const sinm = Math.sin(mrad)
    const sin2m = Math.sin(mrad + mrad)
    const sin3m = Math.sin(mrad + mrad + mrad)
    const C =
      sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) +
      sin2m * (0.019993 - 0.000101 * t) +
      sin3m * 0.000289
    return C // in degrees
  },

  calcSunTrueLong(t) {
    const l0 = Sun.calcGeomMeanLongSun(t)
    const c = Sun.calcSunEqOfCenter(t)
    const O = l0 + c
    return O // in degrees
  },

  calcSunTrueAnomaly(t) {
    const m = Sun.calcGeomMeanAnomalySun(t)
    const c = Sun.calcSunEqOfCenter(t)
    const v = m + c
    return v // in degrees
  },

  calcSunRadVector(t) {
    const v = Sun.calcSunTrueAnomaly(t)
    const e = Sun.calcEccentricityEarthOrbit(t)
    const R =
      (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(Utils.degToRad(v)))
    return R // in AUs
  },

  calcSunApparentLong(t) {
    const o = Sun.calcSunTrueLong(t)
    const omega = 125.04 - 1934.136 * t
    const lambda = o - 0.00569 - 0.00478 * Math.sin(Utils.degToRad(omega))
    return lambda // in degrees
  },

  calcMeanObliquityOfEcliptic(t) {
    const seconds = 21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))
    const e0 = 23.0 + (26.0 + seconds / 60.0) / 60.0
    return e0 // in degrees
  },

  calcObliquityCorrection(t) {
    const e0 = Sun.calcMeanObliquityOfEcliptic(t)
    const omega = 125.04 - 1934.136 * t
    const e = e0 + 0.00256 * Math.cos(Utils.degToRad(omega))
    return e // in degrees
  },

  calcSunRtAscension(t) {
    const e = Sun.calcObliquityCorrection(t)
    const lambda = Sun.calcSunApparentLong(t)
    const tananum =
      Math.cos(Utils.degToRad(e)) * Math.sin(Utils.degToRad(lambda))
    const tanadenom = Math.cos(Utils.degToRad(lambda))
    const alpha = Utils.radToDeg(Math.atan2(tananum, tanadenom))
    return alpha // in degrees
  },

  calcSunDeclination(t) {
    const e = Sun.calcObliquityCorrection(t)
    const lambda = Sun.calcSunApparentLong(t)
    const sint = Math.sin(Utils.degToRad(e)) * Math.sin(Utils.degToRad(lambda))
    const theta = Utils.radToDeg(Math.asin(sint))
    return theta // in degrees
  },

  calcEquationOfTime(t) {
    const epsilon = Sun.calcObliquityCorrection(t)
    const l0 = Sun.calcGeomMeanLongSun(t)
    const e = Sun.calcEccentricityEarthOrbit(t)
    const m = Sun.calcGeomMeanAnomalySun(t)

    let y = Math.tan(Utils.degToRad(epsilon) / 2.0)
    y *= y

    const sin2l0 = Math.sin(2.0 * Utils.degToRad(l0))
    const sinm = Math.sin(Utils.degToRad(m))
    const cos2l0 = Math.cos(2.0 * Utils.degToRad(l0))
    const sin4l0 = Math.sin(4.0 * Utils.degToRad(l0))
    const sin2m = Math.sin(2.0 * Utils.degToRad(m))

    const Etime =
      y * sin2l0 -
      2.0 * e * sinm +
      4.0 * e * y * sinm * cos2l0 -
      0.5 * y * y * sin4l0 -
      1.25 * e * e * sin2m
    return Utils.radToDeg(Etime) * 4.0 // in minutes of time
  },

  calcHourAngleSunrise(lat, solarDec) {
    const latRad = Utils.degToRad(lat)
    const sdRad = Utils.degToRad(solarDec)
    const HAarg =
      Math.cos(Utils.degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) -
      Math.tan(latRad) * Math.tan(sdRad)
    const HA = Math.acos(HAarg)
    return HA // in radians (for sunset, use -HA)
  },

  getJD(year, month, day) {
    if (month <= 2) {
      year -= 1
      month += 12
    }
    const A = Math.floor(year / 100)
    const B = 2 - A + Math.floor(A / 4)
    const JD =
      Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day +
      B -
      1524.5
    return JD
  },

  calcRefraction(elev) {
    let correction
    if (elev > 85.0) {
      correction = 0.0
    } else {
      const te = Math.tan(Utils.degToRad(elev))
      if (elev > 5.0) {
        correction =
          58.1 / te -
          0.07 / (te * te * te) +
          0.000086 / (te * te * te * te * te)
      } else if (elev > -0.575) {
        correction =
          1735.0 +
          elev * (-518.2 + elev * (103.4 + elev * (-12.79 + elev * 0.711)))
      } else {
        correction = -20.774 / te
      }
      correction = correction / 3600.0
    }

    return correction
  },

  calcAzEl(T, localtime, latitude, longitude, zone) {
    const eqTime = Sun.calcEquationOfTime(T)
    const theta = Sun.calcSunDeclination(T)

    const solarTimeFix = eqTime + 4.0 * longitude - 60.0 * zone
    // const earthRadVec = Sun.calcSunRadVector(T)
    let trueSolarTime = (localtime + solarTimeFix) % 1440
    let hourAngle = trueSolarTime / 4.0 - 180.0
    if (hourAngle < -180) {
      hourAngle += 360.0
    }
    const haRad = Utils.degToRad(hourAngle)
    let csz =
      Math.sin(Utils.degToRad(latitude)) * Math.sin(Utils.degToRad(theta)) +
      Math.cos(Utils.degToRad(latitude)) *
        Math.cos(Utils.degToRad(theta)) *
        Math.cos(haRad)
    if (csz > 1.0) {
      csz = 1.0
    } else if (csz < -1.0) {
      csz = -1.0
    }
    const zenith = Utils.radToDeg(Math.acos(csz))
    const azDenom =
      Math.cos(Utils.degToRad(latitude)) * Math.sin(Utils.degToRad(zenith))
    let azimuth
    if (Math.abs(azDenom) > 0.001) {
      let azRad =
        (Math.sin(Utils.degToRad(latitude)) * Math.cos(Utils.degToRad(zenith)) -
          Math.sin(Utils.degToRad(theta))) /
        azDenom
      if (Math.abs(azRad) > 1.0) {
        if (azRad < 0) {
          azRad = -1.0
        } else {
          azRad = 1.0
        }
      }
      azimuth = 180.0 - Utils.radToDeg(Math.acos(azRad))
      if (hourAngle > 0.0) {
        azimuth = -azimuth
      }
    } else {
      if (latitude > 0.0) {
        azimuth = 180.0
      } else {
        azimuth = 0.0
      }
    }
    if (azimuth < 0.0) {
      azimuth += 360.0
    }
    const exoatmElevation = 90.0 - zenith

    // Atmospheric Refraction correction
    const refractionCorrection = Sun.calcRefraction(exoatmElevation)

    const solarZen = zenith - refractionCorrection
    const elevation = 90.0 - solarZen

    return { azimuth: azimuth, elevation: elevation }
  },

  calcSolNoon(jd, longitude, timezone) {
    const tnoon = Sun.calcTimeJulianCent(jd - longitude / 360.0)
    let eqTime = Sun.calcEquationOfTime(tnoon)
    const solNoonOffset = 720.0 - longitude * 4 - eqTime // in minutes
    const newt = Sun.calcTimeJulianCent(jd - 0.5 + solNoonOffset / 1440.0)
    eqTime = Sun.calcEquationOfTime(newt)
    let solNoonLocal = 720 - longitude * 4 - eqTime + timezone * 60.0 // in minutes
    while (solNoonLocal < 0.0) {
      solNoonLocal += 1440.0
    }
    while (solNoonLocal >= 1440.0) {
      solNoonLocal -= 1440.0
    }

    return solNoonLocal
  },

  calcSunriseSetUTC(rise, JD, latitude, longitude) {
    const t = Sun.calcTimeJulianCent(JD)
    const eqTime = Sun.calcEquationOfTime(t)
    const solarDec = Sun.calcSunDeclination(t)
    let hourAngle = Sun.calcHourAngleSunrise(latitude, solarDec)
    if (!rise) hourAngle = -hourAngle
    const delta = longitude + Utils.radToDeg(hourAngle)
    const timeUTC = 720 - 4.0 * delta - eqTime // in minutes

    return timeUTC
  },

  // rise = 1 for sunrise, 0 for sunset
  calcSunriseSet(rise, JD, latitude, longitude, timezone) {
    const timeUTC = Sun.calcSunriseSetUTC(rise, JD, latitude, longitude)
    const newTimeUTC = Sun.calcSunriseSetUTC(
      rise,
      JD + timeUTC / 1440.0,
      latitude,
      longitude
    )
    let jday, timeLocal, azimuth
    if (Utils.isNumber(newTimeUTC)) {
      timeLocal = newTimeUTC + timezone * 60.0
      const riseT = Sun.calcTimeJulianCent(JD + newTimeUTC / 1440.0)
      const riseAzEl = Sun.calcAzEl(
        riseT,
        timeLocal,
        latitude,
        longitude,
        timezone
      )
      azimuth = riseAzEl.azimuth
      jday = JD
      if (timeLocal < 0.0 || timeLocal >= 1440.0) {
        const increment = timeLocal < 0 ? 1 : -1
        while (timeLocal < 0.0 || timeLocal >= 1440.0) {
          timeLocal += increment * 1440.0
          jday -= increment
        }
      }
    } else {
      // no sunrise/set found

      azimuth = -1.0
      timeLocal = 0.0
      const doy = Sun.calcDoyFromJD(JD)
      if (
        (latitude > 66.4 && doy > 79 && doy < 267) ||
        (latitude < -66.4 && (doy < 83 || doy > 263))
      ) {
        //previous sunrise/next sunset
        jday = Sun.calcJDofNextPrevRiseSet(
          !rise,
          rise,
          JD,
          latitude,
          longitude,
          timezone
        )
      } else {
        //previous sunset/next sunrise
        jday = Sun.calcJDofNextPrevRiseSet(
          rise,
          rise,
          JD,
          latitude,
          longitude,
          timezone
        )
      }
    }

    return { jday: jday, timelocal: timeLocal, azimuth: azimuth }
  },

  calcJDofNextPrevRiseSet(next, rise, JD, latitude, longitude, tz) {
    let julianday = JD
    const increment = next ? 1.0 : -1.0
    let time = Sun.calcSunriseSetUTC(rise, julianday, latitude, longitude)

    while (!Utils.isNumber(time)) {
      julianday += increment
      time = Sun.calcSunriseSetUTC(rise, julianday, latitude, longitude)
    }
    let timeLocal = time + tz * 60.0
    while (timeLocal < 0.0 || timeLocal >= 1440.0) {
      const incr = timeLocal < 0 ? 1 : -1
      timeLocal += incr * 1440.0
      julianday -= incr
    }

    return julianday
  },

  calculate(
    date: moment.Moment,
    location: Location,
    timezone: number
  ): SunResult {
    const jday = Sun.getJD(date.year(), date.month() + 1, date.day())
    const dayMinutes = date.hour() * 60 + date.minute() + date.second() / 60.0
    const jdaytotal = jday + dayMinutes / 1440 - timezone / 24
    const jcent = Sun.calcTimeJulianCent(jdaytotal)
    const azel = Sun.calcAzEl(
      jcent,
      dayMinutes,
      location.lat,
      location.long,
      timezone
    )
    const solnoon = Sun.calcSolNoon(jday, location.long, timezone)
    const rise = Sun.calcSunriseSet(
      1,
      jday,
      location.lat,
      location.long,
      timezone
    )
    const set = Sun.calcSunriseSet(
      0,
      jday,
      location.lat,
      location.long,
      timezone
    )

    const eqTime = Sun.calcEquationOfTime(jcent)
    const sunDeclination = Sun.calcSunDeclination(jcent)

    return {
      date,
      location,
      timezone,
      jday,
      jcent,
      azel,
      solnoon,
      rise,
      set,
      eqTime,
      sunDeclination,
    }
  },
}

export { Sun, Utils }
