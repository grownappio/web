import React, { useEffect, useMemo, useState } from "react"
import { useHistory } from "react-router-dom"
import ContentComponent from '../../../grow/components/Content'
import styles from "./index.module.less"

import selectImg from "@/assets/img/grow/detail/select.svg"
import returnImg from '@/assets/img/grow/return.svg'
import Tabs from "@/components/Tabs"
import Options from "@/components/Options"
import { useSearchQuerys } from "@/hooks/useSearchQuerys"
import { useGetList } from "@/hooks/useGetList"

const mainTab = [
  { value: false, label: 'Q&A' },
  { value: true, label: 'Favorites' },
]

const sortArr = [
  { value: 2, label: 'Hot' },
  { value: 1, label: 'New' }, 
  { value: 3, label: 'Upvotes' }
]

export type QaAndFavoritesProps = {
  isCeiling: boolean
  mainTabId: boolean
  subTabId: number
  sortId: number
  blendLoading: boolean
  loadingMoreFlag: boolean
  blendHasMoreFlag: boolean
  blendList: any[]
  subTabList: any[]
  isSelf: boolean
  nickName: string
  setMainTabId: (value: boolean) => void
  setSubTabId: (value: number) => void
  setSortId: (value: number) => void
  setBlendList: (value: any[]) => void
}
const QaAndFavorites = (props: QaAndFavoritesProps, ref: any) => {
  const history = useHistory()
  const {
    isCeiling, mainTabId, subTabId, sortId, blendLoading,
    loadingMoreFlag, blendHasMoreFlag, blendList, subTabList, isSelf, nickName,
    setMainTabId, setSubTabId, setSortId, setBlendList
  } = props

  const qs = useSearchQuerys({ id: 0, type: 1 })
  const query = useMemo(() => ({ ...qs, page: { page_num: 1, page_size: 20 } }), [])
  // const aaa = useGetList(query, { url: '/qa/home/getAnswerCards', list: e => e.list, hasMore: e => !!e?.list?.length, numKey: 'page.page_num', sizeKey: 'page.page_size',  delay: 600 })

  const [selectFlag, setSelectFlag] = useState(false)
  const [noDataType, setNoDataType] = useState<number>(0)

  const getSortName = (id: number) => {
    let name = ''
    sortArr.forEach((item) => {
      if (id === item.value) {
        name = item.label
      }
    })
    return name
  }

  useEffect(() => {
    if (!mainTabId) {
      if (subTabId === 1) { // 答案
        setNoDataType(4)
      } else {
        setNoDataType(0)
      }
    } else { // 2 favorites
      setNoDataType(5)
    }
  }, [mainTabId, subTabId])

  return (
    <div className={styles['qa-favorites']}>
      <div className={[styles['tab-box'], isCeiling ? styles.ceiling : ''].join(' ')}>
        {
          isCeiling
          &&
          <div className="flex items-center justify-center h-44 text-16 font-bold">
            <img className="absolute left-12 w-40 h-40" onClick={() => history.goBack} src={returnImg} alt="" />
            {nickName}
          </div>
        }
        <Tabs className="h-44 after:!border-b-0" value={mainTabId} options={mainTab} onChange={setMainTabId} style={{'--tab-flex': 1}} />
        <div className={styles['sub-tab-and-sort']}>
          <div className={styles['sub-tab-list']}>
            {
              subTabList.map((e) => 
                <div onClick={() => setSubTabId(e.value)} key={e.value} className={[styles.option, 'h-32', subTabId === e.value ? styles.active : ''].join(' ')}>{e.label}</div>
              )
            }
          </div>
          {
            !mainTabId
            &&
            <Options className="h-32 bg-white active-shadow" value={sortId} options={sortArr} onChange={setSortId} />
          }
        </div>
      </div>
      {
        isCeiling
        &&
        <div className={styles['anti-rebound']} />
      }
      <ContentComponent
        className="-mt-12 px-12"
        blendLoading={blendLoading}
        loadingMoreFlag={loadingMoreFlag}
        blendHasMoreFlag={blendHasMoreFlag}
        blendList={blendList}
        setBlendList={setBlendList}
        isPullDown={false}
        spotBtnFlag={isSelf && mainTabId}
        noDataType={noDataType}
      />
    </div>
  )
}

export default QaAndFavorites