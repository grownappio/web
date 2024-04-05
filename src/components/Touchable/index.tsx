import React, { useCallback, useEffect, useRef } from 'react'

type TouchableProps = Partial<{
  disabled: boolean
  children: JSX.Element
  className: string
  num: number
  [k: string]: any
}>

const Touchable = ({ children, disabled = false, num = 6, ...attrs }: TouchableProps) => {
  const el = useRef<HTMLDivElement>(null)
  const cb = useCallback((e: Event) => e.preventDefault(), [])

  useEffect(() => {
    if (disabled) {
      el.current!.addEventListener('touchstart', cb, { passive: false })
    } else {
      el.current!.removeEventListener('touchstart', cb)
    }
    return () => el.current?.removeEventListener('touchstart', cb)
  }, [disabled])

  return (
    <div {...attrs} ref={el}>
      {Array.from({ length: num }).map(e => children)}
    </div>
  )
}
export default Touchable