import P5 from 'p5'
import { useRef, useEffect } from 'react'

import { clockSketch } from '../sketch'

export function Sketch({ clock }) {
  const sketchref = useRef(null)

  useEffect(() => {
    new P5(clockSketch(clock), sketchref.current)
  }, [])

  return <div className="noselect" ref={sketchref} />
}
