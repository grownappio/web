import React, { useState, useEffect, useContext, useRef } from 'react'
import { ReactSVG } from 'react-svg'
import { DataContext } from '@/reducer/index'
import { useHistory } from 'react-router-dom'
import { getHots, getTopics } from "../../service"
import { getPeopleNum } from '@/units'
import eventbus from '@/units/eventbus'
import styles from './index.module.less'

import hotSearch2 from '@/assets/img/grow/hot-search2.svg'
import hotTopic from '@/assets/img/grow/hot-topic.svg'
import SearchInput from './SearchInput'
import noticeNoDataImg from "@/assets/img/notice/notice-no-data.svg";

const hotSearch = [0, 1, 2]

const Hot = () => {
  const history = useHistory()
  const { dispatch } = useContext<any>(DataContext)
  const [hotSearchData, setHotSearchData] = useState<any[]>([])
  const [hotTopicData, setHotTopicData] = useState<any[]>([])
  const [tabi, setTab] = useState(0)

  // ========================= hot search =========================

  const hotSearchItem = (value: string, i: number) => {
    return (
      <div key={i} className={styles['item']}>
        <span className={[styles['item-index'], hotSearch.includes(i) ? styles.active : ''].join(' ')}>{i + 1}</span>
        <span className={styles['item-title']} onClick={() => fillSearch(value)}>{value}</span>
      </div>
    )
  }

  const fillSearch = (value: string) => {
    dispatch({ type: 'changeSearchValue', value })
    sessionStorage.setItem('searchValue', value)
    history.push(`/growSearch?key=${value}`)
  }

  // ========================= hot topic =========================

  const hotTopicItem = (item: any, i: number) => (
    <div key={item.id} className={styles['item']} onClick={() => history.push(`/topic?id=${item.id}`)}>
      <span className={[styles['item-index'], hotSearch.includes(i) ? styles.active : ''].join(' ')}>{i + 1}</span>
      <span className={styles['item-title']}>{item.content}</span>
      <br />
      <p className={styles['item-data']}>
        &emsp;&emsp; {getPeopleNum(item.qa_num)} <span className={styles['item-tip']}>Q&As</span>&emsp;{getPeopleNum(item.visit_num)} <span className={styles['item-tip']}>Views</span>
      </p>
    </div>
  )

  const tabs = [
    {
      icon: hotTopic,
      label: 'Hot topic',
      children: () => (
        <div className={styles['list']}>
          {hotTopicData.slice(0, 10).map((item, index) => hotTopicItem(item, index))}
          {!!hotTopicData.length || <div className={styles.empty}><img src={noticeNoDataImg} alt='' />No imformation temporary</div>}
        </div>
      ),
      getData: async () => setHotTopicData((await getTopics())?.data?.list ?? [])
    },
    {
      icon: hotSearch2,
      label: 'Hot search',
      children: () => (
        <div className={styles['list']}>
          {hotSearchData.slice(0, 10).map((item, index) => hotSearchItem(item.word, index))}
          {!!hotSearchData.length || <div className={styles.empty}><img src={noticeNoDataImg} alt='' />No imformation temporary</div>}
        </div>
      ),
      getData: async () => setHotSearchData((await getHots()).data?.hots ?? [])
    }
  ]

  useEffect(() => {
    tabs[tabi].getData()
  }, [tabi])

  useEffect(() => {
    eventbus.on('topic_update', tabs[0].getData)
    return () => (eventbus.off('topic_update', tabs[0].getData), undefined)
  }, [])

  return (
    <>
      <SearchInput onSearch={fillSearch} />

      <div className={styles['hot-box']}>
        <div className={styles['tabs']}>
          {
            tabs.map((e, i) => (
              <div key={e.label} className={[styles['tab'], tabi === i ? styles['tab-active'] : ''].join(' ')} onClick={() => setTab(i)}>
                <ReactSVG src={e.icon} />
                <span>{e.label}</span>
              </div>
            ))
          }
        </div>
        {
          tabs[tabi].children()
        }
      </div>
    </>
  )
}

export default Hot