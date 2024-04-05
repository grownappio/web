import { useState, useEffect } from 'react'

export function useVisualViewport() {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    
    const handler = () => {
      setViewport({
        width: vv.width,
        height: vv.height
      })
    }

    vv.addEventListener('resize', handler)
    vv.addEventListener('scroll', handler)

    return () => {
      vv.removeEventListener('resize', handler)
      vv.removeEventListener('scroll', handler)
    }
  }, [])

  return viewport
}
