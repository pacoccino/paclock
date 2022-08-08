import BN from 'bignumber.js'

const MOON_ORBITAL_PERIOD = new BN(29.530588) // days
const MOON_PHASES = 8
const PHASE_DURATION = MOON_ORBITAL_PERIOD.div(MOON_PHASES)

const NEW_MOON_BASE = new BN(1587608820000) // 24 janvier 2020	22:44:11

// const DAYS_TO_MS = new BN(1000);
const DAYS_TO_MS = new BN(24).times(60).times(60).times(1000)

let i = 7

interface MoonState {
  age: BN
  age_n: number
  ageNorm: BN
  ageNorm_n: number
  currentPhase: number
  constants: {
    MOON_ORBITAL_PERIOD: BN
    MOON_PHASES: number
    PHASE_DURATION: BN
  }
}

const MoonLib = {
  getState(): MoonState {
    const diffNow = new BN(Date.now() + i).minus(NEW_MOON_BASE)

    // const moonAge = new BN(i)
    const moonAge = diffNow.div(DAYS_TO_MS).modulo(MOON_ORBITAL_PERIOD)

    const ageNorm = moonAge.div(MOON_ORBITAL_PERIOD)
    const currentPhase = moonAge
      .div(PHASE_DURATION)
      .integerValue(BN.ROUND_FLOOR)
      .toNumber()

    // i = (i + 1) % MOON_ORBITAL_PERIOD.toNumber()

    return {
      age: moonAge,
      age_n: moonAge.toNumber(),
      ageNorm,
      ageNorm_n: ageNorm.toNumber(),
      currentPhase,
      constants: {
        MOON_ORBITAL_PERIOD,
        MOON_PHASES,
        PHASE_DURATION,
      },
    }
  },
}

export { MoonLib, MoonState }
