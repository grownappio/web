import React from 'react'
import { useState, useEffect } from 'react'
import styles from './index.module.less';
// import page_left from "@/assets/wallets/left.svg"
import page_right from "@/assets/wallets/right.svg"

export type PropsPagination = {
  total: number;
  pageSize: number;
  page: number;
  onChange: (num: number) => void;
}
export default function Pagination(props: PropsPagination) {
  const { total = 20, onChange = null, pageSize = 5, page } = props;
  const [totalPage, setTotalPage] = useState<number>(1);
  const [leftStepper, setLeftStepper] = useState<boolean>(false); // 左侧的省略号
  const [rightStepper, setRightStepper] = useState<boolean>(false); // 右侧的省略号
  const [$node, $setNode] = useState<number[]>([]); //*节点渲染数组

  const watcher = (now: number, totalPage: number) => {
    if (totalPage >= 8) {
      setLeftStepper(now - 4 >= 0)
      setRightStepper(now + 4 < totalPage)
      if (now < 4) {
        $setNode([2, 3, 4, 5, 6])
      } else if (now >= totalPage - 4) {
        $setNode([totalPage - 5, totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1])
      } else {
        $setNode([now - 2, now - 1, now, now + 1, now + 2])
      }
    } else {
      const arr = [];
      for (let i = 0; i < totalPage; i++) {
        if (i !== 0 && i !== 1 && i !== totalPage) {
          arr.push(i)
        }
      }
      $setNode(arr)
    }
  }

  const pageChanging = (num: number) => {
    // setNow(num)
    watcher(num, totalPage)
    onChange && onChange(num)
  }

  const onPrev = () => {
    if (page - 1 < 1) return
    pageChanging(page - 1)
  }

  const onNext = () => {
    if (page + 1 > totalPage) return
    pageChanging(page + 1)
  }


  const onSetStep = (distance: number) => {
    if (page + (distance) < 1) {
      pageChanging(1)
    } else if (page + (distance) > totalPage) {
      pageChanging(totalPage)
    } else {
      pageChanging(page + (distance))
    }
  }

  useEffect(() => {
    let _pagerCount = total % pageSize === 0 ? total / pageSize : total / pageSize + 1;
    const c = Number(_pagerCount.toFixed(0));
    _pagerCount = Number(c > _pagerCount ? c - 1 : c)
    setTotalPage(_pagerCount);
    watcher(page, _pagerCount)
  }, [total, pageSize])


  return <ul className={[styles['x-pagination-root'], styles['x-clearfix']].join(' ')}>
            <li onClick={onPrev}>
                <button disabled={page === 1} className={[styles['x-pagination-item'], styles['x-pagination-prev']].join(' ')}>
                  <img src={page_right} alt={''}/>
                </button>
            </li>
            <li
              onClick={pageChanging.bind(null, 1)}
              className={[styles['x-pagination-item'], page === 1 ? styles['x-pagination-actived'] : ''].join(' ')}
              style={{borderRadius:page === 1?'':'0.06rem 0 0 0.06rem'}}
            >1</li>
            {leftStepper && <li className={[styles['x-pagination-item'], styles['x-pagination-point-prev']].join(' ')} onClick={() => onSetStep(-5)}>
              <span className={styles['x-pagination-left']} />
            </li>}
            {
              $node.map(function (num, index) {
                return <li
                  className={[styles['x-pagination-item'], page === num ? styles['x-pagination-actived'] : ''].join(' ')}
                  style={{paddingRight:page-1 === num ? '0.18rem':'',paddingLeft:page+1 === num ? '0.18rem':''}}
                  key={index}
                  onClick={pageChanging.bind(null, num)}
                >{num}</li>
              })
            }
            {rightStepper && <li
              className={[styles['x-pagination-item'], styles['x-pagination-point-next']].join(' ')}
              onClick={() => onSetStep(5)}>
              <span className={styles['x-pagination-right']} />
            </li>}
            {totalPage > 1 && <li
              onClick={pageChanging.bind(null, totalPage)}
              className={[styles['x-pagination-item'], page === totalPage ? styles['x-pagination-actived'] : ''].join(' ')}
              style={{borderRadius:page === totalPage?'':'0 0.06rem 0.06rem 0'}}
            >{totalPage}</li>
            }
            <li onClick={onNext} >
                    <button className={[styles['x-pagination-item'], styles['x-pagination-next']].join(' ')} disabled={page === totalPage}>
                         <img  src={page_right} alt={''}/>
                    </button>
            </li>
  </ul >
}
