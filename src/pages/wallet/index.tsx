import React, { useState } from 'react'
import { ReactSVG } from 'react-svg'
import { useHistory } from 'react-router-dom'
import styles from './index.module.less'
import collectionsUnFound from '@/assets/img/grow/no-data-asset.svg'
import Wallets from './components/Account'
import Appbar from '@/components/Appbar'
import { useSearchQuerys } from '@/hooks/useSearchQuerys'

import SearchImg from "@/assets/img/grow/tab-search.svg";
import WalletImg from "@/assets/img/grow/tab-wallet.svg";

// const tabs = [
//   { value: 1, label: 'Account' },
//   { value: 2, label: 'Collection' }
// ]

const tabs = [
  { id: 'spending', name: 'Spending' },
  { id: 'wallet', name: 'Wallet' },
]

const WalletBox = () => {
  const history = useHistory()
  const qs = useSearchQuerys({ type: 'spending' })
  const [currentTab, setCurrentTab] = useState<number>(1)

  return (
    <div className={styles['wallet-index']}>
      <Appbar
        className='sticky top-0 b-b-1 bg-white z-10'
        right={
          <>
            <ReactSVG className='w-24 h-24 opacity-60' src={SearchImg} onClick={() => history.push('/search')} />
            <ReactSVG className='ml-16 w-24 h-24 opacity-60' src={WalletImg} onClick={() => history.push('/wallet')} />
          </>
        }
      >
        <div className='absolute-center flex items-center p-2 text-14 font-[500] text-center rounded-full bg-text/4'>
          {
            tabs.map(e => (
              <div key={e.id} className={`py-4 w-88  rounded-full opacity-40 ${e.id === qs.type && 'text-primary bg-white !opacity-100'}`} onClick={() => qs.type = e.id}>
                { e.name }
              </div>
            ))
          }
        </div>
      </Appbar>

      {currentTab === 2 ? (
        <div className={styles['collection-box']}>
          <img src={collectionsUnFound} alt={''} />
          <div className={styles['tips']}>You don't have digital collections from Grown yet.</div>
        </div>
      ) : (
        <div>
          <Wallets />
        </div>
      )}
    </div>
  )
}

export default WalletBox
