import React, { useContext, useEffect, useMemo } from "react";
import { Badge } from 'antd';
import NoticeBoard from "@/pages/noticeBoard";
import styles from "./index.module.less";
import { toggle } from "@/units";
import { DataContext, useData } from "@/reducer";
import { notificationRead } from "@/components/Right/components/Notice/service";
import { NoticeItem } from "@/components/Right/components/Notice/data";
import { useSearchQuerys } from "@/hooks/useSearchQuerys";
import Tabs from "@/components/Tabs";
import Scroll from "@/components/Scroll";
import { useGetList } from "@/hooks/useGetList";
import { Switch } from "antd-mobile";

import Follwing from '@/assets/img/notice/follwing.svg'
import { Link } from "react-router-dom";

const Notice = () => {
  const { dispatch } = useContext<any>(DataContext);
  const state = useData()

  const options = [
    { label: <Badge count={state.notice_num} offset={[6, 0]}>All</Badge>, value: [] },
    { label: 'Answer', value: [1] },
    { label: 'Reply', value: [2] },
    { label: 'Upvote', value: [4,5,6] },
    { label: 'Follow', value: [3] },
  ]

  const params = useSearchQuerys({ type_filter: [] as number[], relationship_filter: [] as number[] })
  const initial = useMemo(() => ({ page_num: 1, page_size: 10, show_detail: true, ...params }), [])
  const aaa = useGetList<NoticeItem>(initial, { url: '/notification', list: e => e?.list, hasMore: e => e?.list?.length, numKey: 'page_num', sizeKey: 'page_size', delay: 600 })

  useEffect(() => {
    aaa.resetPage({ ...params })
  }, [params.type_filter, params.relationship_filter])

  useEffect(() => {
    if (params.type_filter.length === 0) readNotice()
  }, [params.type_filter])

  async function readNotice() {
    await notificationRead();
    dispatch({ type: 'changeNoticeNum', value: 0 })
  }

  return (
    <div className={styles['notice-box']}>
      {/* appbar */}
      <div className="flex items-center px-16 py-8 text-md bg-white">
        <Link className="text-inherit" to={`/profile?id=${state.userInfo.id}`}>
          <img className="mr-12 w-28 h-28 rounded-full" src={state.userInfo.icon} alt="" />
          <span className="text-16 font-bold align-middle">{state.userInfo.nickName}</span>
        </Link>
        <div className="flex items-center ml-auto">
          <img className="mr-4 w-20" src={Follwing} alt="" />
          <Switch style={{'--height': '20px', '--width': '44px'}} checked={params.relationship_filter.includes(1)} onChange={() => {params.relationship_filter = toggle(params.relationship_filter, 1)}} />
        </div>
      </div>

      <Tabs
        className='sticky top-0 h-44 z-10 rounded-b-6 shadow-lg shadow-gray-500/5'
        options={options}
        value={params.type_filter}
        onChange={e => params.type_filter = e}
        eq={e => e.toString()} />

      <Scroll
        list={aaa.list}
        item={e => <NoticeBoard key={e.id} {...e} />}
        empty={aaa.empty}
        refreshing={aaa.refreshing}
        loadingMore={aaa.loadingMore}
        hasMore={aaa.hasMore}
        onLoadmore={aaa.loadmore} />
    </div>
  )
}

export default Notice;