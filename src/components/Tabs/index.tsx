import React, { CSSProperties, useState } from 'react'
import styles from './styles.module.less'

type Option<T> = {
  label: string | JSX.Element
  value: T
  icon?: JSX.Element
}

type TabsProps<T> = {
  options: Option<T>[]
  separator?: boolean
  value?: T
  defaultValue?: T
  eq?: (e: T) => any
  onChange?: (val: T) => void
  className?: string
  style?: CSSProperties & Record<string, any>
  [k: string]: any
}

const Tabs = <T,>({ options, defaultValue, className, value, onChange, eq = e => e, ...attrs }: TabsProps<T>) => {

  const [val, setVal] = useState(value ?? defaultValue ?? options[0].value)

  return (
    <div {...attrs} className={[styles['tabs'], 'relative bg-white after:border-[#11243814] after:border-b-1 after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none', className].join(' ')}>
      {options.map((e, i) => (
        <div key={i} className={[styles['tab'], eq(e.value) === eq(value ?? val) ? styles['tab-active'] : ''].join(' ')} onClick={() => (setVal(e.value), onChange?.(e.value))}>
          {e.icon}
          <span>{e.label}</span>
        </div>
      ))}
    </div>
  )
}

export default Tabs