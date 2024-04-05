import React, { useEffect, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useGetList } from '@/hooks/useGetList'
import { formatDate, getPeopleNum } from '@/units'
import Content from '@/pages/grow/components/Content'
import styles from './index.module.less'
import * as api from './service'
import { TopicInfo } from './interface'
import Input from '@/components/SearchInput'
import { InfiniteScroll } from 'antd-mobile'
import { useSearchQuerys } from '@/hooks/useSearchQuerys'
import { useEffectLazy } from '@/hooks/useEffectLazy'
import Tabs from '@/components/Tabs'

import BgSvg from '@/assets/img/topic/bg.svg'
import BackSvg from '@/assets/img/back.svg'
import CalendarSvg from '@/assets/img/topic/calendar.svg'
import PersonSvg from '@/assets/img/topic/person.svg'
import EyeSvg from '@/assets/img/eye.svg'
import QaSvg from '@/assets/img/qa.svg'

const tabs = [
  { label: 'Hot', value: 1 },
  { label: 'New', value: 2 },
  { label: 'Question', value: 3 }
]

const Topic = () => {
  const params = useSearchQuerys({ type: tabs[0].value, key: '' })
  const history = useHistory();
  const [query] = useState({ page: { page_num: 1, page_size: 80 } })
  const [info, setInfo] = useState<Partial<TopicInfo>>({})
  const aaa = useGetList(query, { url: '/topic/qa/list', list: e => e, hasMore: e => e?.length, numKey: 'page.page_num', sizeKey: 'page.page_size', delay: 600 })

  function onScroll() {
    if (document.body.scrollHeight - (window.scrollY + window.innerHeight) <= 100) {
      aaa.loadmore()
    }
  }

  async function getInfo() {
    await api.getInfo(params.id).then(({ data }) => setInfo(data))
  }

  const toAddQuestion = () => {
    history.push(`/addQuestion?topic=${escape(info?.content || '')}`)
  }

  useEffect(() => {
    document.getElementById('grow-option-list')!.style.overflow = 'hidden'
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    getInfo().then(() => {
      aaa.resetPage({ topic_id: +params.id, type: params.type })
    })
  }, [params.id])

  useEffectLazy(() => {
    document.documentElement.scrollTop = 0
    aaa.resetPage({ topic_id: +params.id, type: params.type })
  }, [params.type])

  return (
    <div className=''>
      <div className="bg-white z-10">
        <div className="flex py-4 px-16">
          <img className="w-24 mr-16" src={BackSvg} alt="" onClick={useHistory().goBack} />
          <Input className='flex-1 rounded-md bg-[#1124380A]' placeholder="Search Grown" />
        </div>
      </div>

      <img className={styles.topic_bg} src={info.cover || BgSvg} alt='' />

      <div className={styles.topic_info}>
        {
          info.avatar
            ? <img className={styles.topic_avatar} src={info.avatar} alt='' />
            : <div className={styles.topic_avatar} style={{background: info.avatar_color || '#8287F3'}}>{ info.content?.slice(1).trim()[0]?.toUpperCase() }</div>
        }
        
        <h2 className={styles.topic_title}>{info.content}</h2>

        <div className={styles.topic_by}>
          <div className='flex flex-row items-center'>
            <img src={PersonSvg} alt='' />Hosted by&ensp;<Link to={`/profile?id=${info.host_id}`}>{info.host_name}</Link>
          </div>
          <div className='flex flex-row items-center'>
            <img src={CalendarSvg} alt='' />Created on {formatDate(info.created_at || 0)}
          </div>
          <div className='flex flex-row items-center'>
            <img src={QaSvg} alt='' />{getPeopleNum(info.qa_num ?? 0)} Q&As
          </div>
          <div className='flex flex-row items-center'>
            <img src={EyeSvg} alt='' />{getPeopleNum(info.visit_num ?? 0)} Views
          </div>

          <button onClick={toAddQuestion} className={styles.topic_ask_btn}>Ask this topic</button>
        </div>
      </div>

      <Tabs className='sticky top-0 h-45 z-10 bg-white after:border-t-1' value={params.type} options={tabs} onChange={e => params.type = e} />

      <Content
        blendLoading={aaa.refreshing}
        loadingMoreFlag={aaa.loading}
        blendHasMoreFlag={aaa.hasMore}
        blendList={aaa.list}
        className='p-12 pt-0'
        setBlendList={aaa.setList}
      />

      <InfiniteScroll className='p-0' hasMore={aaa.hasMore} loadMore={() => aaa.loadmore()!}>
        <></>
      </InfiniteScroll>

    </div>
  )
}

export default Topic