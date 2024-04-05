import React, { ReactNode } from 'react'
import { useRequest } from 'ahooks';
import { openPopup } from "./openPopup";
import { delay } from '@/units';

import walletCreating from "@/assets/wallets/wallet-creating.gif"
import createSuccessed from "@/assets/wallets/creat-successed.gif"
import createFail from "@/assets/wallets/creat-failed.gif"

type  Props = Partial<{
  title: ReactNode
  desc: ReactNode
  request(): Promise<any>
  onRequest(): void
  requestingText: ReactNode
  onSuccess(): void
  successText: ReactNode
  onFail(): void
  failText: ReactNode
  onCompleted(): void
}>

const PrettyConfirmContent = (props: Props) => {
  const req = useRequest(async () => {
    props.onRequest!()
    const [ret] = await Promise.allSettled([props.request!(), delay(2000)])
    if (ret.status === 'fulfilled') {
      delay(1200).then(props.onSuccess).then(props.onCompleted)
      return ret.value
    } else {
      delay(1200).then(props.onFail).then(props.onCompleted)
      throw ret.reason
    }
  }, { manual: true })

  return (
    <>
      <div className='text-18 font-semibold leading-[24px] text-center'>{ props.title }</div>
      {
        req.data ?
          <>
            <div className='mt-24 mb-58 text-16 opacity-80'>{ props.successText ?? 'successfully' }</div>
            <img className='mb-24 w-144 h-144' src={createSuccessed} alt='' />
          </> :
        req.loading ?
          <>
            <div className='mt-24 mb-58 opacity-80'>{ props.successText ?? 'loading' }</div>
            <img className='mb-24 w-144 h-144' src={walletCreating} alt='' />
          </> :
        req.error ?
          <>
            <div className='mt-24 mb-58 opacity-80'>{ props.successText ?? 'failed' }</div>
            <img className='mb-24 w-144 h-144' src={createFail} alt='' />
          </> :
          <>
            <div className='my-24 opacity-80'>{ props.desc }</div>
            <button className='btn-primary block mt-32 mb-16 py-14 w-full text-16 font-semibold' onClick={req.runAsync}>Confirm</button>
            <button className='btn-outline block mb-40 py-14 w-full text-16 font-semibold' onClick={props.onCompleted}>Cancel</button>
          </>
      }
    </>
  )
}

export function PrettyConfirmApi(props: Props) {
  return new Promise<void>((resolve, reject) => {
    const popup = openPopup(
      <PrettyConfirmContent
        {...props}
        onRequest={() => {
          popup.update({ showClose: false })
        }}
        onSuccess={resolve}
        onFail={reject}
        onCompleted={() => {
          popup.update({ showClose: false, closeOnMaskClick: true })
          popup.close()
        }}
      />,
      { position: 'bottom', bodyClassName: 'px-24 pt-32 text-center', showClose: true }
    )
  })
}