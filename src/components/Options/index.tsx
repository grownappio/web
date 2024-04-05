import React from 'react'
import { NativeProps, withNativeProps } from "antd-mobile/es/utils/native-props"
import { ReactNode } from "react"
import { Action, showActionSheet } from "../_utils/Confirm"
import { CaretDownFilled } from '@ant-design/icons'

type Props<T> = {
  value: T
  onChange?: (val: T) => void
  placeholder?: ReactNode
  options: (Omit<Action, 'key' | 'text'> & { label: ReactNode; value: string | number; [k: string]: any })[]
  children?: (e: Props<T>['options'][0]) => ReactNode
} & NativeProps

const Options = <T,>(props: Props<T>) => {
  function openMenu() {
    showActionSheet({
      cancelText: 'Cancel',
      onAction: e => props.onChange?.(e.key as T),
      actions: props.options.map(e => ({ ...e, text: e.label, key: e.value }))
    })
  }

  const e = props.options.find(e => e.value === props.value)

  return withNativeProps(props, (
    <span className='flex items-center py-4 px-16 b-1 border-text/8 text-text/60 font-semibold rounded-6' onClick={openMenu}>
      {
        e && props.children
          ? props.children(e)
          : (
            <>
              { e?.icon && typeof e.icon === 'string' && <img className='mr-8 w-22 h-22' src={e.icon} alt='' /> }
              { e?.icon && typeof e.icon === 'object' && <span className='mr-8'>{ e.icon }</span> }
              <span>{ e?.label }</span>
              { e === undefined && props.placeholder }
              <CaretDownFilled className='mt-2 -mr-2 ml-2 text-12' />
            </>
          )
      }
    </span>
  ))
}

export default Options