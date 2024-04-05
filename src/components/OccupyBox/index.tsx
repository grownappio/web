import { SafeArea } from 'antd-mobile'
import { NativeProps } from 'antd-mobile/es/utils/native-props'
import React, { ReactNode, RefObject, forwardRef, useEffect, useRef, useState } from 'react'

type Props = {
  children: ReactNode
  safe?: 'top' | 'bottom'
  boxRef?: RefObject<HTMLDivElement>
} & NativeProps

const OccupyBox = (props: Props, ref0: RefObject<HTMLDivElement>) => {
  const _ref = useRef<HTMLDivElement>(), ref = ref0 ?? _ref

  const [style, setStyle] = useState<any>({})

  useEffect(() => {
    new ResizeObserver(([{ target: e }]) => {
      setStyle({ maxWidth: (e as HTMLElement).offsetWidth + 'px', height: (e as HTMLElement).offsetHeight + 'px' })
    }).observe(ref.current!)
  }, [ref.current])

  return (
    <div ref={props.boxRef} style={style}>
      <div ref={ref} className={'flex-wrap ' + props.className} style={props.style}>
        {props.safe === 'top' && <SafeArea className='flex-shrink-0 w-full' position={props.safe} />}
        {props.children}
        {props.safe === 'bottom' && <SafeArea className='flex-shrink-0 w-full' position={props.safe} />}
      </div>
    </div>
  )
}

// @ts-ignore
export default forwardRef(OccupyBox)
