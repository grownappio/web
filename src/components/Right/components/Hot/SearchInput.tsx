import React, { useState, useEffect, useContext, useRef } from 'react'
import { useData, DataContext } from '@/reducer/index'
import { clearHistory } from "../../service"
import styles from './index.module.less'

import historySearch2 from '@/assets/img/grow/history-search2.svg'
import seacrhImg from '@/assets/img/grow/search.svg'
import seacrhSelectImg from '@/assets/img/grow/search-select.svg'
import clear from '@/assets/img/grow/clear.svg'
import searchHistory from '@/assets/img/grow/search-history.svg'

const SearchInput = (props: { onSearch: (s: string) => void }) => {
  const state = useData()
  const [activated, setActivated] = useState(false)
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  const historyRef = useRef<any>(null)
  const inputRef = useRef<any>(null)

  const handleClick = (event: any) => {
    //搜索框历史记录弹窗关闭
    if (!historyRef?.current?.contains(event.target) && !inputRef?.current?.contains(event.target)) {
      setFocused(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const { dispatch } = useContext<any>(DataContext)

  const clearAllHistory = async (word: string) => {
    const result = await clearHistory({ word })
    if (result?.code === 200) {
      if (word) {
        const tempData = (state.historySearchData || []).filter((item) => item !== word)
        dispatch({ type: 'changeHistorySearchData', value: tempData })
      } else {
        dispatch({ type: 'changeHistorySearchData', value: [] })
      }
    }
  }

  const historyItems = (item: any) => {
    return (
      <div className={styles['history-item']}>
        <div className={styles['left']}>
          <img className={styles['history-search']} src={searchHistory} alt="" />
          <span className={styles['history-content']}>{item}</span>
        </div>

        <img className={[styles['history-clear'], state?.historySearchData?.length > 4 ? styles.active : ''].join(' ')}
          onClick={async (e) => { e.stopPropagation(); await clearAllHistory(item) }} src={clear} alt="" />
      </div>
    )
  }

  return (
    <div className={[styles['search-input'], activated ? styles.active : ''].join(' ')} ref={inputRef}>
      <img className={styles['search-icon']} src={activated ? seacrhSelectImg : seacrhImg} alt="" />
      <div style={{ flex: 1 }}>
        <input
          placeholder="Search In Grown"
          className={styles['input']}
          type="text"
          required={true}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          onFocus={() => {
            setActivated(true)
            setFocused(true)
          }}
          onBlur={() => {
            setActivated(false)
          }}
          onKeyUp={(e) => {
            if (e.keyCode === 13 && value.trim()) {
              props.onSearch(value)
            }
          }}
        />
        <div className={styles['clear-box']} onClick={() => setValue('')} onMouseDown={(e) => e.preventDefault()} />
      </div>
      {
        focused &&
        <div className={[styles['history-list']].join(' ')} ref={historyRef} >
          <div className={styles['history-tab-box']}>
            <div className={styles['left']}>
              <img src={historySearch2} alt={''} />
              <span className={styles['history-title']}>History</span>
            </div>
            <span className={styles['history-clear-all']} onClick={async () => { await clearAllHistory(''); setFocused(false) }} >Clear all</span>
          </div>
          <div className={styles['history-list-box']}>
            {
              state.historySearchData?.map((item) => {
                return (
                  <div onClick={() => { setValue(item); props.onSearch(item) }} key={item}>
                    {historyItems(item)}
                  </div>
                )
              })
            }
          </div>
        </div>
      }
    </div>
  )
}

export default SearchInput