import React, { memo, useState } from "react"

import ArrowImg0 from '@/assets/img/grow/triangle-black.svg'
import ArrowImg1 from '@/assets/img/grow/triangle-blue-help.svg'
import ArrowImg2 from '@/assets/img/grow/triangle-black-help.svg'
import LikeImg0 from '@/assets/img/grow/fabulous.svg'
import LikeImg1 from '@/assets/img/grow/fabulous-select.svg'
import LikeImg2 from '@/assets/img/grow/fabulous-no1.svg'
import StepImg0 from '@/assets/img/grow/fabulous-no.svg'
import StepImg2 from '@/assets/img/grow/fabulous-enter.svg'
import { calculationThousand } from "@/units"

const Link = ({ type = 0, like = 0, step = 0, className = '', onType = (type: number, like: number, step: number) => {} }) => {
  const [show, setShow] = useState(false)

  function onClick(t: number) {
    if (show) {
      onType(
        t,
        // 
        type === 1 ? like - 1 :
        t === 1 ? like + 1 :
        like,
        // 
        type === 2 ? step - 1:
        t === 2 ? step + 1 :
        step
      )
    }
    setShow(e => !e)
  }

  return (
    <div className=
      {`relative flex items-center py-8 px-12 h-32 rounded-4 text-text/60
      ${show && '!text-primary'}
      ${show && 'bg-[#effcee]'}
      ${type === 1 && '!text-primary'}
      ${type === 2 && '!text-error'}
      ${type === 2 && show && '!bg-error/8'}
      ${className}`}
      onClick={() => onClick(type !== 0 ? 0 : 1)}
      onMouseLeave={() => setShow(false)}
    >
      <img className={`mr-4 w-8 h-5 ${show && 'rotate-180'}`} src={
        show && type === 0 ? ArrowImg1 :
        type === 1 ? ArrowImg1 :
        type === 2 ? ArrowImg2 :
        ArrowImg0
      } alt="" />
      <img className="mr-8 w-16 h-16 !shadow-none" src={
        show && type === 0 ? StepImg2 :
        type === 1 ? LikeImg1 :
        type === 2 ? LikeImg2 :
        LikeImg0
        } alt="" />
      <span>{ calculationThousand(type === 2 ? step : like) }</span>

      {
        show &&
        <div className=
          {`absolute top-full right-0 flex items-center mt-6 py-8 px-12 h-32 rounded-4 shadow-md z-10
          ${type === 2 ? 'text-primary bg-[#effcee]' : 'text-error bg-[#FFF5F5]'}`}
          onClick={(e) => {e.stopPropagation(); onClick(type === 2 ? 1 : 2)}}
        >
          <img className="mr-8 w-16 h-16" src={type === 2 ? StepImg2 : StepImg0} alt="" />
          <span>{ calculationThousand(type !== 2 ? step : like) }</span>
        </div>
      }
    </div>
  )
}

export default memo(Link)