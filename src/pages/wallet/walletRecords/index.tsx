import React, { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import eventbus from '@/units/eventbus'
import { copyTest, retainDecimals } from '@/units'
import { desensitizedCommon } from '@/units'
import { useHistory } from 'react-router-dom'
import { getTxlist, sessionStorageKey, transformInstance } from '@/pages/wallet/service'
import Appbar from '@/components/Appbar'
import { useSearchQuerys } from '@/hooks/useSearchQuerys'
import TransformItem from '../components/TransformItem'
import { ReceiveQRApi } from '../api'
import Scroll from '@/components/Scroll'

import receiveImg from '@/assets/img/wallet/receive.svg'
import transferImg from '@/assets/img/wallet/transfer.svg'
import sendImg from '@/assets/img/wallet/send.svg'
import tradeImg from '@/assets/img/wallet/trade.svg'
import { useData } from '@/reducer'
import recordNoDate from '@/assets/img/wallet/record-nodate.svg'
import copyAddressImg from '@/assets/img/wallet/copy-address.svg'

let pageSize = 20
const WalletRecord = () => {
  const history = useHistory()
  const qs = useSearchQuerys({ walletAddress: '' })
  const state = useData()
  const [pageNum] = useState<number>(1)
  const [assetDetail, setAssetDetail] = useState<any>({})
  const [chain_id, setChainId] = useState<number>(Number(sessionStorage.getItem(sessionStorageKey[0])))

  const req = useRequest(
    async () => {
      if (!assetDetail.wallet_address) return
      const ret = await getTxlist({
        chain_id: chain_id,
        page_num: pageNum,
        page_size: pageSize,
        token_address: assetDetail.token_address,
        address: assetDetail.wallet_address
      })
      if (ret.data?.length > 19) {
        pageSize = 2000
      }
      return ret as { data: transformInstance[], url: string }
    },
    { refreshDeps: [state.assetTriggerPsw, chain_id, assetDetail] }
  )

  const toViewAll = () => {
    window.open(req.data!.url)
  }

  useEffect(() => {
    const tempData = JSON.parse(localStorage.getItem('walletAssetDetail') || '')
    setAssetDetail(tempData)
    eventbus.on('defaultChain', (value) => {
      setChainId(value)
    })
  }, [])

  return (
    <div>
      <Appbar title={assetDetail.name} />

      <img className='block mx-auto my-16 w-46 h-46' src={assetDetail.icon} alt='' />

      <div className='my-16 text-30 font-medium leading-[36px] text-center'>
        {retainDecimals(assetDetail.num || 0, 9)} {assetDetail.name}
      </div>

      <div className='flex items-center mx-auto mb-24 py-8 px-16 w-fit rounded-full bg-text/6 leading-[17px]'>
        <span className='opacity-60'>{desensitizedCommon(qs.walletAddress, 6, 6)}</span>
        <img className='ml-16 w-10 h-10' onClick={() => copyTest(qs.walletAddress)} src={copyAddressImg} alt='' />
      </div>

      {/* btns */}
      <div className='flex justify-between mb-30 px-30'>
        <div onClick={() => ReceiveQRApi({ walletAddress: assetDetail.wallet_address })} className='flex flex-col items-center'>
          <img className='mb-6 w-46 h-46' src={receiveImg} alt='' />
          <span>Receive</span>
        </div>
        <div onClick={() => history.push(`/transfer?symbol=${assetDetail.name}`)} className='flex flex-col items-center'>
          <img className='mb-6 w-46 h-46' src={transferImg} alt='' />
          <span>Transfer</span>
        </div>
        <div onClick={() => history.push(`/assetSend?symbol=${assetDetail.name}`)} className='flex flex-col items-center'>
          <img className='mb-6 w-46 h-46' src={sendImg} alt='' />
          <span>Send</span>
        </div>
        {/* popover "Token trading is temporarily not supported during the closed beta." */}
        <div className='flex flex-col items-center'>
          <img className='mb-6 w-46 h-46' src={tradeImg} alt='' />
          <span>Trade</span>
        </div>
      </div>

      <Scroll className='mx-16' refreshing={req.loading}>
        {
          !!req.data?.data?.length
            ?
            req.data!.data.map((item) => <TransformItem item={item} key={item.id} showTid />)
            :
            <wc-fill-remain class='flex-center'>
              <img src={recordNoDate} alt='' />
            </wc-fill-remain>
        }
      </Scroll>
      
      {(req.data?.data?.length || 0) > 19 && <div onClick={toViewAll}>View all</div>}
    </div>
  )
}

export default WalletRecord
