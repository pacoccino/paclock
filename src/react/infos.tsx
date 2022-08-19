import BN from 'bignumber.js'
import { useState, useEffect } from 'react'

function Row({ title, children }) {
  return (
    <div className="flex mb-1 ml-1">
      <div className="text-sm uppercase">{title}</div>
      <div className="text-sm flex-1 text-right">{children}</div>
    </div>
  )
}

function Title({ children }) {
  return <h2 className="flex mb-2 mt-2">{children}</h2>
}

export function Infos({ clock }) {
  const [now, setNow] = useState(clock.now)

  useEffect(() => {
    const t = setInterval(() => {
      setNow(clock.now)
    }, 1000)
    return () => {
      clearInterval(t)
    }
  })

  return (
    <div className="bg-black mx-8 my-8">
      <div className="max-w-xs mx-auto">
        <h1 className="text-center mb-2">PaClock</h1>
        <Title>🌏 General</Title>
        <Row title="Date">{clock.now.format('YYYY-MM-DD')}</Row>
        <Row title="Time">{clock.now.format('HH:mm:ss')}</Row>
        <Row title="TZ">
          {clock.timezone > 0 ? '+' : ''}
          {clock.timezone}
        </Row>
        <Row title="Location">
          {clock.location.lat}, {clock.location.long}
        </Row>
        <Title>🌞 Sun</Title>
        <Row title="Rise">{clock.sun.rise.timeLocal_m.format('HH:mm')}</Row>
        <Row title="Noon">{clock.sun.noon.timeLocal_m.format('HH:mm')}</Row>
        <Row title="Set">{clock.sun.set.timeLocal_m.format('HH:mm')}</Row>
        <Row title="azimuth">
          {new BN(clock.sun.azel.azimuth).dp(2).toNumber()}°
        </Row>
        <Row title="elevation">
          {new BN(clock.sun.azel.elevation).dp(2).toNumber()}°
        </Row>
        <Row title="Declination">
          {new BN(clock.sun.sunDeclination).dp(2).toNumber()}°
        </Row>
        <Row title="Eq. Time">{new BN(clock.sun.eqTime).dp(2).toNumber()}</Row>
        <Title>🌚 Moon</Title>
        <Row title="Age">{clock.moon.age.dp(2).toNumber()} days</Row>

        <div className="mt-8 text-center text-sm">
          <a href="https://github.com/pakokrew/paclock" target="_blank">
            This is open-source ❤️
          </a>
        </div>
      </div>
    </div>
  )
}
