import React from 'react'
import { getWallet, sessionStorageKey } from "./service"
import { openPopup } from '@/components/_utils/openPopup'
import WalletCreate from './components/CreteWallet'
import VerifyPassword from './components/VerifyPassword'
import { useHistory } from 'react-router-dom'
import { delay } from '@/units'
import { dispatchRef, state } from '@/reducer'
import Receive from './components/Receive'
import history from '@/units/history'

/**
 * Create Wallet
 * @see [Figma](https://www.figma.com/file/tGSKt3fQodWNiVlKYpLjBH/Grown-%E6%89%8B%E6%9C%BA%E7%AB%AFH5%E9%80%82%E9%85%8D-%E5%AF%B9%E6%8E%A5?node-id=382%3A4326&mode=dev)
 */
export async function CheckAccountApi() {
  const chain_id = Number(sessionStorage.getItem(sessionStorageKey[0]))
  const { data } = await getWallet({ chain_id })

  if (data) return data

  return new Promise((resolve, reject) => {
    const dialog = openPopup(
      <WalletCreate
        chainId={chain_id}
        onSuccess={async () => {
          const { data } = await getWallet({ chain_id })
          dialog.close()
          await delay(300)
          resolve(data)
          VerifyPasswordApi({ address: data })
        }}
        onCancel={async () => {
          reject('cancel')
          dialog.close()
        }}
      />,
      { position: 'bottom' }
    )
  })
}

let verifyPassword: Promise<any> | undefined

/**
 * 钱包密码验证弹窗
 * @see [Figma](https://www.figma.com/file/tGSKt3fQodWNiVlKYpLjBH/Grown-%E6%89%8B%E6%9C%BA%E7%AB%AFH5%E9%80%82%E9%85%8D-%E5%AF%B9%E6%8E%A5?node-id=382%3A4506&mode=dev)
 */
export async function VerifyPasswordApi(ctx?: { history?: ReturnType<typeof useHistory>; address?: string }) {
  const chain_id = Number(sessionStorage.getItem(sessionStorageKey[0]))
  const address = ctx?.address || (await getWallet({ chain_id })).data
  if (!address) return

  return verifyPassword ||= new Promise((resolve, reject) => {
    const popup = openPopup(
      <VerifyPassword
        onSuccess={() => {
          dispatchRef.current({ type: 'changeAssetTriggerPsw', value: state.assetTriggerPsw + 1 })
          resolve(1)
          popup.close()
        }}
        history={history}
      />,
      {
        history,
        showClose: true,
        closeOnMaskClick: true,
        onClose() {
          reject('cancel')
        },
        afterClose() {
          verifyPassword = undefined
        },
      }
    )
  })
}

/**
 * Receive QR
 * @see [Figma](https://www.figma.com/file/tGSKt3fQodWNiVlKYpLjBH/Grown-%E6%89%8B%E6%9C%BA%E7%AB%AFH5%E9%80%82%E9%85%8D-%E5%AF%B9%E6%8E%A5?node-id=382%3A2415&mode=dev)
 */
export function ReceiveQRApi(props: Parameters<typeof Receive>[0]) {
  openPopup(<Receive {...props} />, { position: 'bottom', showClose: true, bodyClassName: 'pt-32 pb-16 px-22 text-center', closeOnMaskClick: true })
}