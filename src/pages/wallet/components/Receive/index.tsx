import React from 'react'
import { copyTest, desensitizedCommon } from '@/units/index'
import { useData, state } from '@/reducer'
import QRCode from 'qrcode.react'

import CopyImg from '@/assets/img/copy.svg'
import { ReactSVG } from 'react-svg'

export type ReceiveProps = {
  walletAddress: string
}

const ReceiveeteMask = (props: ReceiveProps) => {
  const { walletAddress } = props
  return (
    <>
      <div className='mb-32 text-20 font-semibold leading-[20px]'>Receive</div>

      <div className='inline-flex items-center py-4 px-12 b-1 border-text/8 rounded-6'>
        <img className='mr-6 w-16 h-16 rounded-full' src={state.chainCurrent.icon} />
        <span>{state.chainCurrent.name}</span>
      </div>

      <div className='my-16 mx-auto p-12 b-2 w-fit border-primary bg-primary/8 rounded-6'>
        <QRCode className='!w-170 !h-170' value={walletAddress} level='L' />
      </div>

      <div className='my-16 text-16'>Scan address to receive payment</div>

      <div className='mb-24 py-6 px-22 text-text/60 bg-text/6 rounded-6'>{desensitizedCommon(walletAddress, 17, 17)}</div>

      <button className='btn-primary flex-center py-14 w-full text-16 font-semibold' onClick={() => copyTest(walletAddress)}>
        <ReactSVG className='mr-8 w-16 h-16' src={CopyImg} />
        Copy
      </button>
    </>
  )
}

export default ReceiveeteMask
