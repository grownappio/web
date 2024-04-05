import React, { memo } from 'react'
import { TabBar } from 'antd-mobile'

import { useHistory, useLocation } from 'react-router-dom'
import routes from '@/router'
import OccupyBox from '../OccupyBox'

const tabs = routes.filter((e) => e.tab)

const BottomTabBar = () => {
  const history = useHistory()
  const { pathname } = useLocation()

  return (
    <OccupyBox className='fixed bottom-0 left-0 right-0 b-t-1 bg-white z-[998]'>
      <TabBar activeKey={pathname} safeArea onChange={(e) => history.push(e)}>
        {tabs.map((item) => (
          <TabBar.Item key={item.path} icon={(bool) => <img className='w-full h-full -mt-8 -ml-8 p-8 rounded-full align-baseline box-content' src={bool ? item.icon1 : item.icon} alt='' />} />
        ))}
      </TabBar>
    </OccupyBox>
  )
}

export default memo(BottomTabBar)
