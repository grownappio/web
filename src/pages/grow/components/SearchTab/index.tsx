import React from "react";
import styles from './index.module.less';
import returnImg from '@/assets/img/grow/return.svg';

const tabData = [
  {
    id: 1,
    name: 'Answers'
  },
  {
    id: 0,
    name: 'Questions'
  },
  {
    id: 2,
    name: 'People'
  }
]

export type PropsSearchTab = {
  returnGrowHome: () => void;
  changeCurretId: (value: number) => void;
  currentId: number;
  isShadow: boolean;
}

const SearchTab = (props: PropsSearchTab) => {
  const { returnGrowHome, changeCurretId, isShadow, currentId } = props;
  return (
    <div className={[styles['search-tab'], isShadow ? styles['show-shadow'] : ''].join(' ')}>
      <div className={styles['seacrh--top']}>
        <img onClick={() => {
          returnGrowHome()
        }} src={returnImg} alt="" />
        <span>Search results</span>
      </div>
      <div className={styles['top-tab-box']}>
        {
          tabData.map((item: { id: number; name: string }) => {
            return (
              <div onClick={() => {
                if (item.id === 4 || item.id === currentId) {
                  return
                }
                changeCurretId(item.id)
              }} className={[styles['tab-option'], currentId === item.id ? styles.active : ''].join(' ')} key={item.id}>
                <span>{item.name}</span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default SearchTab;