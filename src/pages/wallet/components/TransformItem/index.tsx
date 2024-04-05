import React from 'react'
import { useHistory } from 'react-router-dom'
import { NativeProps, withNativeProps } from 'antd-mobile/es/utils/native-props'
import { ReactSVG } from 'react-svg'
import { ClassNameType, RecordStatus, RecordType, transformInstance } from '../../service'
import { desensitizedCommon, formatToLocalTime } from '@/units'

import earn from '@/assets/wallets/earn.svg'
import arrowImg from '@/assets/img/arrow.svg'
import transferImg from '@/assets/wallets/transfer.svg'
import gas from '@/assets/img/wallet/gass.svg'

const aaa: any = {
  completed: 'text-primary',
  failed: 'text-text/60',
  inProgress: 'text-warn',
}

const TransformItem = ({ item, ...props }: { item: transformInstance; showTid?: boolean } & NativeProps) => {
  const history = useHistory()
  return withNativeProps(
    props,
    <div className='grid grid-cols-2 gap-y-10 items-center mb-8 py-12 px-16 b-1 border-text/8 rounded-8 whitespace-nowrap [&>:nth-child(even)]:text-right'>
      {
        props.showTid
          ?
          <span>{desensitizedCommon(item.tx_id, 7, 7)}</span>
          :
          <div>
            <img className='mr-8' src={RecordType[item.sub_type].icon} alt={''} />
            <span className='align-middle'>{RecordType[item.sub_type].name}</span>
          </div>
      }
      <span className='opacity-60'>{formatToLocalTime(item.timestamp)}</span>
      <span>
        {Number(item.amount) <= 0 ? item.amount : `+${item.amount}`}
        {` ${item.token_symbol}`}
      </span>
      <div>
        <span className={aaa[ClassNameType[item.status]]}>{RecordStatus[item.status]}</span>
        {!(item.explore_url === '' && item.source_id === 0) && (
          <ReactSVG
            className='inline-block ml-4 w-20 h-20 align-middle opacity-60 active-shadow'
            src={arrowImg}
            onClick={async () => {
              if (item.explore_url === '' && item.source_id === 0) return
              if (item.explore_url === '') history.push(`/allSeeds`)
              else window.open(item.explore_url)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default TransformItem
