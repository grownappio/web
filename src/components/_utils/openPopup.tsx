import { Popup, PopupProps } from 'antd-mobile'
import { withNativeProps } from 'antd-mobile/es/utils/native-props'
import { useHistory } from 'react-router-dom'
import React, { ReactNode, useEffect, useState } from 'react'
import { Root, createRoot } from 'react-dom/client'

import CloseImg from '@/assets/img/close.svg'

const exist = new Map<any, PopupRet>

type Props = PopupProps & { showClose?: boolean; key?: any; history?: ReturnType<typeof useHistory> }

type PopupRet = {
  close(): void
  update(props?: Props): void
  to: Element
  app: Root
}


export const openPopup = (children: ReactNode | (() => ReactNode), $props?: Props) => {
  function unmount() {
    ret.app.unmount()
    ret.to.remove()
    exist.delete($props?.key)
    $props?.afterClose?.()
  }

  const _Popup = () => {
    const [props, setProps] = useState($props)
    ret.update = (e) => setProps({ ...$props, ...e })
    
    const [visible, setVisible] = useState(false)
    ret.close = () => {
      setVisible(e => !e)
      props?.onClose?.()
    }

    useEffect(() => {
      setVisible(true)
    }, [])

    return withNativeProps(props || {},
      <Popup {...props} className='[&>.adm-popup-body]:overflow-auto' visible={visible} onClose={() => ret.close()} afterClose={unmount} >
        { props?.showClose && <img className='absolute top-12 right-12 w-28 h-28' src={CloseImg} onClick={() => ret.close()} /> }
        { typeof children === 'function' ? children() : children }
      </Popup>
    )
  }

  let to: Element

  let ret = exist.get($props?.key) || {
    close: () => {},
    update: (props: typeof $props) => {},
    to: to = document.body.appendChild(document.createElement('div')),
    app: createRoot(to)
  }

  // 监听路由
  const unlisten = $props?.history?.listen(() => { unlisten!(); ret.close() })

  ret.app.render(<_Popup />)

  if ($props?.key) exist.set($props.key, ret)
  

  return ret
}