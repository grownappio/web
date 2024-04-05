import React, { ReactNode, useState } from 'react'
import { ActionSheet, Dialog, Modal } from "antd-mobile"

import delMaskCloseImg from "@/assets/img/profile/photoAlbum/del-mask-close.svg";
import { Action as _Action } from 'antd-mobile/es/components/action-sheet';
import { openPopup } from './openPopup';
import Input from '../Input';
import { createApp } from './createApp';

type Funable<T> = T | (() => T)

const exec = <T,>(e: T | (() => T)) => e instanceof Function ? e() : e

export const Confirm = (props: Partial<{ title: ReactNode, content: ReactNode, showClose: boolean, okClass: string, btnsClass: string, btns: ReactNode, confirm: ReactNode, onCancel: () => void }>) => {
  return new Promise(s => {
    function onCancel() {
      props.onCancel?.()
      dialog.close()
    }

    function onConfirm() {
      s(true);
      dialog.close()
    }

    const dialog = Dialog.show({
      bodyStyle: { padding: 0 },
      className: 'custom',
      content: (
        <div className='pb-24 px-16 text-center'>
          { props.showClose !== false && <img className='absolute top-12 right-12' src={delMaskCloseImg} alt='' onClick={onCancel} /> }
          <div className='text-20 mt-32 font-bold'>{ props.title }</div>
          <div className='text-16 my-24'>{ props.content }</div>
  
          <div className={`mt-32 space-x-12 font-bold ${props.btnsClass}`}>
            <button className='py-14 px-38 rounded-6 outline outline-1 outline-text/8' onClick={onCancel}>Cancel</button>
            { (!props.confirm || typeof props.confirm === 'string') && <button className={`py-14 px-38 rounded-6 text-white bg-[#F11F29] ${props.okClass}`} onClick={onConfirm}>{ props.confirm || 'Confirm' }</button>}
            { (props.confirm && typeof props.confirm === 'object') && <div onClick={onConfirm}>{ props.confirm }</div> }
            { props.btns }
          </div>
        </div>
      ),
      actions: []
    })
  })
}


// =======================================================================================================================================

export const Prompt = (title: string, { placeholder = '' } = {}) => new Promise<string>(resolve => {
  const Content = () => {
    const [val, setVal] = useState('')
    return <>
      <div className='mt-8 text-center text-20 font-semibold'>{ title }</div>
      <Input className='mt-22 mb-30' value={val} onChange={setVal} placeholder={placeholder} clearable />
      <div className='flex space-x-12 font-bold'>
        <button className='flex-1 py-14 rounded-6 outline outline-1 outline-text/8' onClick={() => modal.close()}>Cancel</button>
        <button className={`flex-1 py-14 rounded-6 text-white bg-primary`} onClick={() => {resolve(val); modal.close()}}>Confirm</button>
      </div>
    </>
  }
  const modal = Modal.show({
    content: <Content />,
    bodyClassName: 'pt-24 pb-16 px-16 [&_.adm-modal-footer]:p-0',
    className: '[&_.adm-modal-content]:p-0'
  })
})


// =======================================================================================================================================

export type Action = _Action & { icon?: ReactNode; hide?: Funable<boolean> }

export const showActionSheet = (props: Omit<Parameters<typeof ActionSheet.show>[0], 'actions'> & { actions: Action[], autoClose?: boolean, empty?: ReactNode }) => {
  const actions = props.actions.filter(e => !exec(e.hide)).map(e => {
    e = { ...e }
    e.text = <div className='flex items-center font-[500]'>
      { e.icon && typeof e.icon === 'string' && <img className='mr-16 w-20 h-20' src={e.icon} alt='' /> }
      { e.icon && typeof e.icon === 'object' && <span className='mr-16'>{ e.icon }</span> }
      {e.text}
    </div>
    return e
  })

  const dialog = ActionSheet.show({
    ...props,
    className: 'custom',
    extra: !actions.length && props.empty ? props.empty : props.extra,
    onAction(...args) { props.autoClose !== false && dialog.close(); props.onAction?.(...args) },
    actions
  })
  return dialog
}