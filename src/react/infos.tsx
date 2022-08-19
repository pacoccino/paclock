import { useState, useEffect } from 'react'

function Row({ title, children }) {
  return (
    <div className="flex mb-1 ml-2">
      <div className="text-xs uppercase">{title}</div>
      <div className="text-sm flex-1 text-right">{children}</div>
    </div>
  )
}

function Title({ children }) {
  return <h2 className="flex mb-2">{children}</h2>
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
        <h1 className="text-center">PaClock</h1>
        <Title>🌏 General</Title>
        <Row title="Date">
          <span>{clock.now.format('YYYY-MM-DD')}</span>
        </Row>
        <Row title="Time">
          <span>{clock.now.format('HH:mm:ss')}</span>
        </Row>
        <Row title="Location">
          <span>
            {clock.location.lat}, {clock.location.long}
          </span>
        </Row>
        <Title>🌞 Sun</Title>
        <Row title="Sunrise">
          <span>{clock.sun.rise.timeLocal_m.format('HH:mm')}</span>
        </Row>
        <Row title="Sunset">
          <span>{clock.sun.set.timeLocal_m.format('HH:mm')}</span>
        </Row>
        <Title>🌚 Moon</Title>
        <Row title="Age">
          <span>{clock.moon.age.dp(1).toNumber()} days</span>
        </Row>
      </div>
    </div>
  )
}
