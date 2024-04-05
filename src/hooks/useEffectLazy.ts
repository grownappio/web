import { useEffect, useState } from "react"

export function useEffectLazy(cb: React.EffectCallback, deps: any[]) {
  const [first] = useState({ value:  true })

  useEffect(() => {
    if (first.value) first.value = false
    else return cb()
  }, deps)
}