import P5 from 'p5'
import { useRef, useEffect } from 'react'

import { clockSketch } from '../sketch'
import { Clock } from '../lib/clock'

export function Sketch({ clock }: { clock: Clock }) {
  const sketchref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    new P5(clockSketch(clock), sketchref.current || undefined)
  }, [])

  return <div className="noselect" ref={sketchref} />
}
