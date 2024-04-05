import { NativeProps, withNativeProps } from 'antd-mobile/es/utils/native-props'
import React, { ButtonHTMLAttributes, memo, useState } from 'react'

type Props = Assign<ButtonHTMLAttributes<HTMLButtonElement>, { onClick(e: Event): Promise<any> | any }> & NativeProps
// 
const Button = (props: Props) => {
  const [loading, setLoading] = useState(false)

  async function onClick(e: any) {
    const ret = props.onClick?.(e)
    if (ret?.then) {
      try {
        setLoading(true)
        await ret
      } finally {
        setLoading(false)
      }
    }
  }

  return withNativeProps(props, <button className={loading ? 'disabled' : ''} onClick={onClick}>{ props.children }</button>)
}

export default memo(Button)