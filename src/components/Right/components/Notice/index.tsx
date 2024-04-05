import React, { useEffect, useState, useRef, useContext } from "react";
import { formatPublishTime, getPlainText, characterConversionIcon } from "@/units";
import { DataContext } from "@/reducer";
import { queryNotification, notificationRead } from "./service";
import styles from "./index.module.less";
import { useHistory } from 'react-router-dom'
import { noticeBehaviorData } from "./data.d";
import type { NoticeItem } from "./data.d";

// 图标
import noticeLoadingImg from "@/assets/img/notice/notice-loading.gif";
import noticeArrowImg from "@/assets/img/notice/notice-arrow.svg";
import noticeNoDataImg from "@/assets/img/notice/notice-no-data.svg";

interface PropsNotice {
  noticeList: NoticeItem[];
  setNoticeList: (value: NoticeItem[]) => void;
}

const Notice = (props: PropsNotice) => {
  const history = useHistory()
  const noticeRef: any = useRef(null);
  const { noticeList, setNoticeList } = props;
  const { dispatch } = useContext<any>(DataContext);
  const [loadingFlag, setLoadingFlag] = useState<boolean>(true);
  const [page_num, setPageNum] = useState<number>(1);
  const [page_size] = useState<number>(20);
  const [noticeHasMoreFlag, setNoticeHasMoreFlag] = useState<boolean>(false);
  const [loadingMoreFlag, setLoadingMoreFlag] = useState<boolean>(false);

  const handleScroll = () => {
    const scrollTop = noticeRef?.current?.scrollTop;
    const windowHeight = noticeRef?.current?.clientHeight;
    const scrollHeight = noticeRef?.current?.scrollHeight;
    if (scrollTop + windowHeight >= scrollHeight - 1) {   //考虑到滚动的位置一般可能会大于一点可滚动的高度，所以这里不能用等于
      if (noticeHasMoreFlag && !loadingMoreFlag) {
        setLoadingMoreFlag(true);
        setPageNum(val => val + 1)
      }
    }
  }

  const getNoticeList = async () => {
    try {
      const params = {
        page_num,
        page_size
      }
      const result = await queryNotification(params);
      setLoadingMoreFlag(false);
      if (result?.code === 200) {
        setNoticeHasMoreFlag(result?.data?.list?.length >= page_size)
        if (page_num === 1) {
          setTimeout(() => {
            setLoadingFlag(false);
          }, 500);
          setNoticeList(result?.data?.list || []);
        } else {
          setNoticeList([
            ...noticeList,
            ...result?.data?.list || []
          ])
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  const readNotice = async () => {
    try {
      const result = await notificationRead();
      if (result?.code === 200) {
        dispatch({
          type: 'changeNoticeNum',
          value: 0
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  const toProfile = (id: number) => {
    history.push(`/profile?id=${id}`);
  }

  const getNoticeContent = (item: NoticeItem, str: string) => {
    if (item.self_is_del) return 'Content does not exist'
    if (!str) return '';
    const tempStr = str;
    const reTag = /<img(?:.|\s)*?>/g;
    // 去除图片 与 style内联样式
    return characterConversionIcon(tempStr.replace(reTag, '').replace(/style="(.*)"/gi, ''))
    // return characterConversionIcon(getPlainText(str.replace(/style="(.*)"/gi, '')));
  }

  const toViewAllNotice = () => {
    readNotice();
    history.push('/notice');
  }

  useEffect(() => {
    getNoticeList();
  }, [page_num])

  useEffect(() => {
    noticeRef?.current.addEventListener('scroll', handleScroll);
    return () => {
      noticeRef && noticeRef?.current && noticeRef?.current.removeEventListener('scroll', handleScroll);
    }
  }, [page_num, noticeHasMoreFlag, loadingMoreFlag, noticeList])

  useEffect(() => {
    readNotice();
  }, [])
  return (
    <div className={styles['side-notice-box']}>
      <div onClick={toViewAllNotice} className={styles['notice-title']}>
        <span>Notifications</span>
        <img src={noticeArrowImg} alt="" />
      </div>
      <div ref={noticeRef} className={styles['notice-content']}>
        {
          loadingFlag
            ?
            <div className={styles['loading-box']}>
              <img src={noticeLoadingImg} alt="" />
            </div>
            :
            noticeList.length
              ?
              <div className={styles['notice-list']}>
                {
                  noticeList.map((item: NoticeItem) => {
                    return (
                      <div key={item.id} className={styles['notice-option']}>
                        <div className={styles['header-icon-box']} onClick={() => toProfile(item.user_id)}>
                          <img className={styles['header-icon']} src={item?.user_icon} alt="" />
                          <img className={styles['mask-icon']} src={noticeBehaviorData[item.type]?.icon} alt="" />
                        </div>
                        <div className={styles['notice-option-right']}>
                          <div className={styles['user-name']}>
                            <span onClick={() => toProfile(item.user_id)} className={styles['nick-name']}>{item?.user_name}</span>
                            <span className={styles['time']}>{formatPublishTime(item.created_at.toString())}</span>
                          </div>
                          <div dangerouslySetInnerHTML={{
                            __html: getNoticeContent(item, `${noticeBehaviorData[item.type]?.tipContent}${getPlainText(item.content, false)}`)
                          }} className={styles['notice-content']} onClick={() => noticeBehaviorData[item.type]?.onClick?.(item)} />
                        </div>
                      </div>
                    )
                  })
                }
                {
                  !noticeHasMoreFlag && !loadingMoreFlag &&
                  <div className={styles['notice-no-more']}>No more content</div>
                }
              </div>
              :
              <div className={styles['notice-no-data']}>
                <img src={noticeNoDataImg} alt="" />
                <span>No imformation temporary</span>
              </div>
        }
      </div>
      <div onClick={toViewAllNotice} className={styles['notice-btn']}>View All</div>
    </div>
  )
}

export default Notice;