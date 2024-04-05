import React from 'react'
import { retainDecimals } from '@/units'
import { withNativeProps } from 'antd-mobile/es/utils/native-props'

const Tokens = ({ list = [] as any[], icon='icon', name='name', num='num', onItem=(e:any)=>{}, ...props }) => {
  return withNativeProps(props,
    list?.length
    ?
    <div className='b-1 border-text/8 rounded-8 bg-bc'>
      {
        list.map((e, i) => (
          <div className='relative flex items-center mx-16 py-16 b-b-1 border-text/6 last:border-0' key={i} onClick={() => onItem(e)}>
            <img className='mr-16 w-24 h-24' src={e[icon]} alt='' />
            <span>{ e[name] }</span>
            <span className='ml-auto'>{ retainDecimals(e[num] || 0, 9) }</span>
          </div>
        ))
      }
    </div>
    : <></>
  )
}

export default Tokens
