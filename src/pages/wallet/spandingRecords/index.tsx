import { useGetList } from '@/hooks/useGetList'
import React, { useEffect, useMemo, useState } from 'react'
import { sessionStorageKey, transformInstance } from '../service'
import Scroll from '@/components/Scroll'
import TransformItem from '../components/TransformItem'
import Appbar from '@/components/Appbar'
import Filter from '@/components/Filter'

const SpendingRecord = () => {
  const chain_id = Number(sessionStorage.getItem(sessionStorageKey[0]))

  const [filter, setFilter] = useState({ status_filter: [], sub_type_filter: [], token_filter: [] })
  const initial = useMemo(() => ({ chain_id, page_num: 1, page_size: 10 }), [])
  const aaa = useGetList<transformInstance>(initial, { url: '/spending/getFundRecords', list: e => e.list, hasMore: e => !!e?.list?.length, numKey: 'page_num', sizeKey: 'page_size', delay: 600 })

  useEffect(() => {
    aaa.resetPage({ ...filter })
  }, [filter])

  return (
    <>
      <Appbar className='sticky top-0 b-b-1 bg-white z-10' title='Spending account records' />

      <Filter
        className='m-16 mt-12'
        value={filter}
        // @ts-ignore
        onChange={setFilter}
        items={[
          { label: 'Type', value: 'sub_type_filter', options: [{ label: 'Deposit', value: 3 }, { label: 'Withdraw', value: 4 }, { label: 'Gas', value: 7 }, { label: 'Earn', value: 6 }] },
          { label: 'Status', value: 'status_filter', options: [{ label: 'In progress', value: 1 }, { label: 'Completed', value: 2 }, { label: 'Failed', value: 3 }] },
          { label: 'Token', value: 'token_filter', options: [{ label: 'GWC', value: 2 }, { label: 'MATIC', value: 3 }] },
        ]}
      />

      <Scroll
        className='m-16'
        list={aaa.list}
        item={e => <TransformItem item={e} />}
        itemKey='id'
        refreshing={aaa.refreshing}
        loadingMore={aaa.loadingMore}
        onLoadmore={aaa.loadmore}
        hasMore={aaa.hasMore}
        empty={!aaa.list.length}
      />
    </>
  )
}

export default SpendingRecord
