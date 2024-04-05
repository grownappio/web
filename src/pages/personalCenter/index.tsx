import React, { useEffect } from 'react'
import Appbar from "@/components/Appbar"
import { useData } from '@/reducer'
import { retainDecimals, setToken } from '@/units'
import { userBalance } from '@/components/Left/service'
import { useRequest } from 'ahooks'
import { sessionStorageKey } from '@/components/Wallets/service'

import returnImg from '@/assets/img/back.svg'
import closeImg from '../publish/fullAnswer/close.svg'
import aboutImg from './about.svg'
import personImg from './person.svg'
import settingImg from './setting.svg'
import logoutImg from './logout.svg'
import { logout } from '@/units/commonService'
import { useHistory } from 'react-router-dom'
import OccupyBox from '@/components/OccupyBox'
import Tokens from '../wallet/components/Tokens'

type Props = {
  onBack?(): void
  state: ReturnType<typeof useData>
  history?: ReturnType<typeof useHistory>
}

const PersonalCenter = (props: Props) => {
  const h = useHistory(), history = props.history || h
  const { userInfo, SpendingwalletList, walletList } = props.state

  // const currentChainID = Number(sessionStorage.getItem(sessionStorageKey[0]))
  const { data } = useRequest(() => userBalance({ chain_id: 80001 }))

  function onLogout() {
    props.onBack?.()
    setToken('')
    history.replace('/login')
    logout()
  }

  return <>
    <Appbar
      className='b-b-1'
      backArrow={<img className='w-24 h-24 active-shadow rounded-full' onClick={props.onBack} src={closeImg} alt="" />}
      title='Personal Center'
    />

    {/* Header */}
    <div className='px-16'>
      <div className='grid grid-cols-[auto_1fr] items-center mt-20'>
        <img className='row-span-2 mr-8 w-48 h-48 rounded-full' src={userInfo.icon} />
        <span className='-mb-4 text-16 font-medium'>{ userInfo.nickName }</span>
        <span className='text-12 opacity-50'>@{ userInfo.name }</span>
      </div>

      {/* Assets */}
      <Tokens className='my-16' list={data?.data} icon='token_image_url' name='token_symbol' num='balance' />
      
      {/* Setting */}
      <div className='my-16 b-1 border-transparent rounded-8'>
        {
          [
            { label: 'Profile', icon: personImg, onClick: () => history.push(`/profile?id=${userInfo.id}`) },
            { label: 'Setting', icon: settingImg },
            { label: 'Abote', icon: aboutImg },
          ].map(e => (
            <div className='flex items-center py-14 px-16 active-bg rounded-12' key={e.label} onClick={e.onClick}>
              <img className='mr-16 w-24 h-24' src={e.icon}  />
              <span className='text-16'>{ e.label }</span>
              <img className='ml-auto w-18 h-18 opacity-40 rotate-180' src={returnImg} alt='' />
            </div>
          ))
        }
      </div>
      
      {/* Logout */}
      <wc-fill-remain class='flex items-end'>
        <button className='flex-1 flex items-center my-30 py-14 px-16 text-error text-start b-1 border-text/8 rounded-8' onClick={onLogout}>
          <img className='w-24 h-24 mr-16' src={logoutImg} alt='' />
          <span className='text-16'>Log out</span>
          <img className='ml-auto w-18 h-18 opacity-40 rotate-180' src={returnImg} alt='' />
        </button>
      </wc-fill-remain>
    </div>
  </>
}

export default PersonalCenter