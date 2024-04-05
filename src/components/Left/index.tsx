import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { composedPath } from '@/units/index';
import { useData } from "@/reducer";
import styles from "./index.module.less";
import headerIcon from "@/assets/img/header/company-icon.png";
import publishTriangle from "@/assets/img/publish/publish-triangle.svg";
import homeImg from '@/assets/img/header/tab/home.svg';
import homeSelectImg from '@/assets/img/header/tab/home-select.svg';
import exploreImg from '@/assets/img/header/tab/explore.svg';
import exploreSelectImg from '@/assets/img/header/tab/explore-select.svg';
import assetsImg from '@/assets/img/header/tab/assets.svg';
import assetsSelectImg from '@/assets/img/header/tab/assets-select.svg';
import profileImg from '@/assets/img/header/tab/profile.svg';
import profileSelectImg from '@/assets/img/header/tab/profile-select.svg';
import addQuestionImg from "@/assets/img/publish/add-question.svg";
import addQuestionSelectImg from "@/assets/img/publish/add-question-enter.svg";
import answerQuestionsImg from "@/assets/img/publish/answer-questions.svg";
import answerQuestionsSelectImg from "@/assets/img/publish/answer-questions-enter.svg";


const tabList = [
  {
    id: 1,
    title: 'Home',
    icon: homeImg,
    selectIcon: homeSelectImg,
    path: '/grow',
    children: ['/grow', '/addQuestion', '/answerQuestions']
  },
  {
    id: 2,
    title: 'Earn',
    icon: exploreImg,
    selectIcon: exploreSelectImg,
    path: '/Earn',
    children: ['/Earn', '/allSeeds'],
    isEarn: true
  },
  // {
  //   id: 3,
  //   title: 'Notification',
  //   icon: notificationImg,
  //   selectIcon: notificationSelectImg,
  //   children: ['/Notification']
  // },
  {
    id: 4,
    title: 'Assets',
    icon: assetsImg,
    selectIcon: assetsSelectImg,
    path: '/wallet',
    children: ['/wallet', '/transfer', '/assetSend', 'spendingRecord', '/walletRecord', '/spendingRecord']
  },
  {
    id: 5,
    title: 'Profile',
    icon: profileImg,
    selectIcon: profileSelectImg,
    path: '/profile',
    children: ['/profile', '/photoAlbum', '/editProfile', '/follow']
  },
]

const publishSelectData = [
  {
    id: 1,
    title: 'Add question',
    icon: addQuestionImg,
    iconSelect: addQuestionSelectImg,
    path: '/addQuestion'
  },
  {
    id: 2,
    title: 'Answer questions',
    icon: answerQuestionsImg,
    iconSelect: answerQuestionsSelectImg,
    path: '/answerQuestions'
  }
]

const Header = () => {
  const history = useHistory();
  const state = useData();
  const publishRef = useRef(null);
  const { pathname } = useLocation();
  const [currentId, setCurrentId] = useState<number>(1);

  const [publishSelectId, setPublishSelectId] = useState<number>(0);
  const [publishSelectFlag, setPublishSelectFlag] = useState<boolean>(false);

  const getCurrentId = (value: string) => {
    const tempData = tabList.find((item) => {
      return item.children.indexOf(value) !== -1
    })
    setCurrentId(tempData?.id || 1)
  }

  const handleClick = (event: any) => {
    if (!composedPath(event)) return
    const wasOutside = !composedPath(event).includes(publishRef.current);
    // 点击其他位置需要隐藏菜单
    if (wasOutside) setPublishSelectFlag(false)
  }

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    }
  }, [])

  useEffect(() => {
    getCurrentId(pathname)
  }, [pathname])

  return (
    <div className={styles['header-box']}>
      <div onClick={() => { history.push('/grow') }} className={styles['header-icon']}>
        <img src={headerIcon} alt="" />
        <div className={styles['version-tip']}>Alpha</div>
      </div>
      <div onMouseEnter={() => { setPublishSelectFlag(true); }}
        onMouseLeave={() => { setPublishSelectFlag(false); }}
        ref={publishRef}
        className={[styles['publish-btn-box'], publishSelectFlag ? styles.active : ''].join(' ')}>
        <div className={styles['btn-name']}>Publish</div>
        <div className={styles['btn-icon']}>
          <img src={publishTriangle} alt="" />
        </div>
        <div className={[styles['publish-select-box'], publishSelectFlag ? styles.show : styles.hide].join(' ')}>

          {
            publishSelectData.map((item) => {
              return (
                <div onMouseEnter={() => {
                  setPublishSelectId(item.id)
                }} onMouseLeave={() => {
                  setPublishSelectId(0);
                }} onClick={() => {
                  if (item.path === pathname) return
                  history.push(item.path)
                }} className={styles['select-option']} key={item.id}>
                  <img src={publishSelectId === item.id ? item.iconSelect : item.icon} alt="" />
                  <span>{item.title}</span>
                </div>
              )
            })
          }

        </div>

      </div>
      <div className={styles['header-left']}>
        <div className={styles['header-tab-list']}>
          {
            tabList.map((item: any) => {
              return (
                <div key={item.id} onClick={() => {
                  if (item.path && item.path !== pathname) {
                    // setCurrentId(item.id);
                    history.push(item.path);
                  }
                }} className={[styles['tab-option'], currentId === item.id ? styles.active : ''].join(' ')}>
                  <img src={currentId === item.id ? item.selectIcon : item.icon} alt="" />
                  <div className={styles['title']}>
                    {item.title}
                    {
                      item.isEarn && state.harvestable_flag
                      &&
                      <div className={styles['harvest-tip']}>Harvestable</div>
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Header;