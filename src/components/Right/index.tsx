import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { message } from "antd";
import eventbus from "@/units/eventbus";
import { useData, DataContext } from '@/reducer/index';
import useWebsocket from '@/units/websocket';
import RightWallet from "./components/Wallet";
import { ERRPR_CODE } from "@/units/commonData";
import NoticeComponent from "./components/Notice";
import Hot from "./components/Hot";
import { notificationInfo } from "./components/Notice/service";
import { composedPath, removeToken, redirectToLoginPage, getToken } from '@/units';
import VerifyPassword from "@/pages/wallet/components/VerifyPassword";
import ForgotPassword from "@/pages/wallet/components/ForgotPassword";
import tabSearchImg from "@/assets/img/grow/tab-search.svg";
import tabSearchSelectImg from "@/assets/img/grow/tab-search-select.svg";
import noticeTabSelectImg from "@/assets/img/notice/notice-tab-select.svg";
import noticeTabImg from "@/assets/img/notice/notice-tab.svg";
import tabWalletImg from "@/assets/img/grow/tab-wallet.svg";
import tabWalletSelectImg from "@/assets/img/grow/tab-wallet-select.svg";
import bottomArrowImg from "@/assets/img/header/bottom-arrow.svg";
// import bottomArrowSelectImg from "@/assets/img/right/bottom-arrow-select.svg";
import { Tooltip, Badge } from 'antd';
import editImg from "@/assets/img/right/edit.svg";
import editSelectImg from "@/assets/img/right/edit-select.svg";
import logoutImg from "@/assets/img/right/logout.svg";
import logoutSelectImg from "@/assets/img/right/logout-select.svg";
import { getUserByID, logout } from "@/units/commonService";
import styles from './index.module.less';
import { homeHistory, getAllChain, topicTipExist } from "./service";
import { defaultCurrentChain, sessionStorageKey } from "@/components/Wallets/service";
import type { NoticeItem } from "./components/Notice/data";

const userSelectData = [
  {
    id: 1,
    title: 'Edit profile',
    icon: editImg,
    iconSelect: editSelectImg,
  },
  // {
  //   id: 2,
  //   title: 'Settings',
  //   icon: settingImg,
  //   iconSelect: settingSelectImg,
  // },
  {
    id: 3,
    title: 'Log out',
    icon: logoutImg,
    iconSelect: logoutSelectImg,
  },
]
const RightComponents = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const userRef = useRef(null);

  const { dispatch } = useContext<any>(DataContext);
  const state = useData();
  const [userSelectId, setUserSelectId] = useState<number>(0);
  const [userSelectFlag, setUserSelectFlag] = useState<boolean>(false);
  const [verifyPasswordFlag, setVerifyPasswordFlag] = useState<boolean>(false);

  const [tabId, setTabId] = useState<number>(1);

  // webstock 
  const { ws, wsData, readyState, reconnect } = useWebsocket({});
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);

  const getHisTorySearchData = async () => {
    try {
      const result = await homeHistory();
      if (result?.code === 200) {
        dispatch({ type: 'changeHistorySearchData', value: result?.data || [] });
      }
    } catch (err) {
      console.log('err', err);
    }
  }

  const getUserInfoData = async () => {
    try {
      const result = await getUserByID();
      if (result?.code === 200) {
        const data = result?.data || {};
        dispatch({
          type: 'changeUserInfo', value: {
            id: data?.id,
            icon: data?.icon,
            nickName: data?.nick_name,
            name: data?.name
          }
        });

        dispatch({
          type: 'changeEarnPlan', value: data?.earn_plan
        });
      }
    } catch (err) {
      console.log('err', err);
    }
  }

  const getChainList = async () => {
    try {
      const result = await getAllChain();
      if (result?.code === 200) {
        const tempCurrentChain = result?.data[0];
        if (tempCurrentChain && tempCurrentChain.id) {
          dispatch({ type: 'changeChainCurrent', value: { id: tempCurrentChain.chain_id, icon: tempCurrentChain?.image_url, name: tempCurrentChain.name, rpcUrl: tempCurrentChain.rpc } });
          sessionStorage.setItem(sessionStorageKey[0], String(tempCurrentChain.chain_id));
          eventbus.emit('defaultChain', tempCurrentChain.chain_id);
          setVerifyPasswordFlag(true);
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getNotificationSummary = async () => {
    try {
      const result = await notificationInfo();
      if (result?.code === 200) {
        // 初始化未读数量
        dispatch({
          type: 'changeNoticeNum',
          value: result?.data?.unread_count
        })
        // 初始化关注的人是否有动态
        dispatch({
          type: 'changeFollowFlag',
          value: result?.data?.has_follow_user_new_activity
        })
        // 初始化是否有待收货的种子
        dispatch({
          type: 'changeHarvestableFlag',
          value: result?.data?.has_mature_seeds
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getTopicTop = async () => {
    try {
      const result = await topicTipExist();
      if (result?.code === 200) {
        dispatch({ type: 'changeTopicTipSwitch', value: !result?.data?.Closed })
      }
    } catch(err) {
      console.log(err);
    }
  }

  const initData = async () => {
    if (sessionStorage.getItem('searchValue')) {
      dispatch({ type: 'changeSearchValue', value: sessionStorage.getItem('searchValue') })
    }
    // 获取历史搜索
    getHisTorySearchData();
    // 获取个人信息
    getUserInfoData();
    // 获取链数据
    getChainList();
    // 获取消息通知汇总
    getNotificationSummary();
    // 获取话题提示开关
    getTopicTop();
    if (readyState?.key === 1) {
      socketLogin();
    }
    setTabId(1)
  }

  const handleClick = (event: any) => {
    if (!composedPath(event)) return
    const wasOutside = !composedPath(event).includes(userRef.current);
    // 点击其他位置需要隐藏菜单
    if (wasOutside) setUserSelectFlag(false)
  }

  const layOut = async () => {
    try {
      const result = await logout();
      if (result?.code === 200) {
        removeToken();
        sessionStorage.removeItem('returnUrl');
        // const currentHref = window.location.href;
        redirectToLoginPage('');
      }

      sessionStorage.setItem(sessionStorageKey[0], String(defaultCurrentChain.id))
      dispatch({ type: 'changeChainCurrent', value: defaultCurrentChain, });
    } catch (err) {
      console.log('err', err);
    }
  }

  const pullDownOperates = (operate: number) => {
    switch (operate) {
      case 1:
        history.push('/editProfile')
        break
      case 2:
        break
      case 3:
        layOut();
        break
    }
  }

  const pushUnreadQuantity = (value: number) => {
    dispatch({
      type: 'changeNoticeNum',
      value: value
    })
  }

  const pushNotifications = (value: NoticeItem) => {
    setNoticeList([
      value,
      ...noticeList
    ])
  }

  const followHaveTrends = () => {
    // 初始化关注的人是否有动态
    dispatch({
      type: 'changeFollowFlag',
      value: true
    })
  }

  const seedMaturation = (value: boolean) => {
    // 初始化是否有待收货的种子
    dispatch({
      type: 'changeHarvestableFlag',
      value
    })
  }

  const operationMessage = async (res: any) => {
    switch (res?.type) {
      case 5: // 推送通知 (评论，回复，点赞，关注)
        pushNotifications(res?.data)
        break;
      case 6: // // 推送未读消息数量
        pushUnreadQuantity(res?.data?.unReadCount);
        break;
      case 7: // // 种子成熟通知
        seedMaturation(res?.data?.has_mature_seeds);
        break;
      case 8: // 关注用户的动态
        followHaveTrends()
        break;

      default:
        break;
    }
  }

  const checkIsGrow = (value: string) => {
    if (value === '/grow') {
      getNotificationSummary();
    }
  }

  // 登录
  const socketLogin = () => {
    const params: {
      type: number;
      body: string;
    } = {
      type: 3,
      body: JSON.stringify({
        token: getToken()
      })
    }
    ws.current?.send(JSON.stringify(params));
  }

  useEffect(() => {
    checkIsGrow(pathname)
  }, [pathname])

  useEffect(() => {
    // 接受到socket数据， 进行业务逻辑处理
    if (Object.keys(wsData).length !== 0) {
      if (wsData?.code === 1003) {
        return
      }
      if (wsData?.code !== 200 && wsData?.code !== 1003) {
        message.error(ERRPR_CODE[wsData.code ? String(wsData.code) : '2'] || 'request failed')
        return
      }
      // 判断是否返回正常
      operationMessage(wsData);
    }
  }, [wsData])

  // 启动webstock
  useEffect(() => {
    if (readyState.key === 1) { // 连接成功
      console.log('连接成功')
      socketLogin();
    }
    // 如果是已关闭且是当前页面自动重连
    if (readyState.key === 3) {
      reconnect()
    }
  }, [readyState])

  useEffect(() => { // 登录成功 获取公共数据
    initData()
  }, [])

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    }
  }, [])



  return (
    <>
      <div className={styles['right-search']}>
        <div className={styles['to-top']}>
          {/* 个人信息 */}
          <div onClick={() => {
            setUserSelectFlag(!userSelectFlag);
          }} ref={userRef} className={[styles['user-info-box'], userSelectFlag ? styles.active : ''].join(' ')}>
            <div className={styles['user-message']}>
              <div className={styles['user-icon-box']}>
                <img className={styles['user-icon']} src={state?.userInfo?.icon} alt="" />
              </div>
              <div className={styles['user-name-s']}>
                <div className={styles.nickname}>{state?.userInfo?.nickName}</div>
                <div className={styles.username}>@{state?.userInfo?.name}</div>
              </div>
            </div>
            <div className={[styles.arrow, userSelectFlag ? styles.active : ''].join(' ')}>
              <img className={userSelectFlag ? styles.active : ''} src={bottomArrowImg} alt="" />
            </div>

            {/* 下拉选择框 */}
            {
              // userSelectFlag
              // &&
              <div className={[styles['user-select-box'], userSelectFlag ? styles.show : styles.hide].join(' ')}>
                {
                  userSelectData.map((item) => {
                    return (
                      <div onMouseEnter={() => { setUserSelectId(item.id) }}
                        onMouseLeave={() => { setUserSelectId(0); }}
                        onClick={() => { pullDownOperates(item.id) }}
                        className={styles['select-option']} key={item.id}>
                        <img src={userSelectId === item.id ? item.iconSelect : item.icon} alt="" />
                        <span>{item.title}</span>
                      </div>
                    )
                  })
                }
              </div>
            }
          </div>
          {/* 切换搜索和钱包 */}
          <div className={styles['tab-list']}>
            <div className={styles['tab-option-box']}>
              <Tooltip overlayInnerStyle={{}} title="search" color={'#112438'}>
                <div onClick={() => { setTabId(1); }} className={styles['tab-option']}>
                  <img src={tabId === 1 ? tabSearchSelectImg : tabSearchImg} alt="" />
                </div>
              </Tooltip>
            </div>
            <div className={styles.line} />
            <div className={styles['tab-option-box']}>
              <Tooltip overlayInnerStyle={{}} title="Notifications" color={'#112438'}>
                <div onClick={() => { setTabId(3); }} className={styles['tab-option']}>
                  <Badge size="small" count={state?.notice_num}>
                    <img src={tabId === 3 ? noticeTabSelectImg : noticeTabImg} alt="" />
                  </Badge>
                </div>
              </Tooltip>
            </div>
            <div className={styles.line} />
            <div className={styles['tab-option-box']}>
              <Tooltip overlayInnerStyle={{}} title="Assets" color={'#112438'}>
                <div onClick={() => { setTabId(2); }} className={styles['tab-option']}>
                  <img src={tabId === 2 ? tabWalletSelectImg : tabWalletImg} alt="" />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
        {
          tabId === 1
          &&
          <Hot />
        }
        {
          tabId === 2
          &&
          <RightWallet />
        }
        {
          tabId === 3
          &&
          <NoticeComponent noticeList={noticeList} setNoticeList={setNoticeList} />
        }
        <div className={styles['copyright-notice']}>
          <div>Terms of Service&nbsp;&nbsp;&nbsp;Privacy Policy</div>
          <div>©2023 Grown,Inc.</div>
        </div>
      </div>
      {
        verifyPasswordFlag
        &&
        <VerifyPassword />
      }
      <ForgotPassword title="Restore your wallet account" />
    </>
  )
}

export default RightComponents;