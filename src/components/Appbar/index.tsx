import React, { ReactNode } from 'react'
import { NavBar } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import { showActionSheet } from '../_utils/Confirm'

import returnImg from '@/assets/img/back.svg'
import dots from "@/assets/img/growDetail/dots.svg"
import { ReactSVG } from 'react-svg'


type AppbarProps = {
  back: boolean
  backArrow?: ReactNode
  left: JSX.Element
  right: JSX.Element | boolean
  title: string | JSX.Element
  children: JSX.Element
  className: string
  menus: Parameters<(typeof showActionSheet)>[0]['actions']
  onBack?(): void
}

const Appbar = ({ onBack, ...props }: Partial<AppbarProps>) => {
  const history = useHistory()

  const openMenu = () => {
    showActionSheet({
      cancelText: 'Cancel',
      empty: 'More features are coming soon',
      actions: props.menus!   
    })
  }

  function back() {
    setTimeout(() => {
      onBack ? onBack() : history.goBack()
    }, 50);
  }

  return (
    <NavBar
      {...props}
      right={props.menus?.length ?
        <div className='flex items-center space-x-16'>
          { props.right }
          <img className='rounded-full active-shadow' src={dots} onClick={openMenu} />
        </div>
        : props.right
      }
      className={`bg-white ` + props.className}
      backArrow={props.backArrow ?? <ReactSVG className='w-24 h-24 active-shadow rounded-full' onClick={back} src={returnImg} />}
      children={props.children ?? props.title}
    />
  )
}

export default Appbar