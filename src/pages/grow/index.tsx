import React, { useState, useEffect, useContext } from "react";
import { DataContext } from '@/reducer/index';
// import { useHistory } from "react-router-dom";
import { homeHistory, homeQaList, queryFollowing, updateLastRequestTime } from "./service";

// import LeftComponent from './components/Left';
// import RightComponent from './components/Right';
import TopTab from './components/TopTab';
import ContentComponent from './components/Content';
import FollowingCard from "./components/FollowingCard";

import FollowSkeletonImg from './follw-skeleton.svg'
import { Popup } from "antd-mobile";
import PersonalCenter from "../personalCenter";

let bottomLoadFlag = true;

export default function Grow() {
  const { dispatch } = useContext<any>(DataContext);
  const [currentTabID, setCurrentTabID] = useState<number>(2);
  const [pageNum, setPageNum] = useState<number>(1);
  const [isShadow, setIsShadow] = useState<boolean>(false);
  const [blendList, setBlendList] = useState<any>([]);
  const [blendLoading, setBlendLoading] = useState<boolean>(true);
  const [blendHasMoreFlag, setBlendHasMoreFlag] = useState<boolean>(false);
  const [loadingMoreFlag, setLoadingMoreFlag] = useState<boolean>(false);
  // followimg
  const [displayFollowingCard, setDisplayFollowingCard] = useState<boolean>(false); // 是否展示待关注人员列表
  const [peopleCardList, setPeopleCardList] = useState<any[]>([]); // 人员列表
  
  const [personalVisible, setPersonalVisible] = useState(false)

  const getHistoryData = async () => {
    const result = await homeHistory();
    if (result?.code === 200) {
      dispatch({ type: 'changeHistorySearchData', value: result?.data || [] });
    }
  }
  // 获取hot 和 new 的数据
  const getBlendData = async (type: number, page: any) => {
    setDisplayFollowingCard(false);
    const result = await homeQaList({ type, page });
    setLoadingMoreFlag(false);
    if (result?.code === 200) {
      setBlendHasMoreFlag(!!result.data?.length)
      if (pageNum === 1) {
        setTimeout(() => {
          setBlendLoading(false);
          setBlendList(result?.data || []);
        }, 500);
      } else {
        setBlendList([
          ...blendList,
          ...(result?.data || [])
        ]);
      }
    }
  }

  // 获取following数据
  const getFollowingData = async (page: any) => {
    const result = await queryFollowing({ page });
    if (result?.data?.not_follow_anyone) { // 未关注任何人 获取人物card列表
      setBlendLoading(false);
      setDisplayFollowingCard(true);
      setPeopleCardList((result?.data?.cards || []).map((item: any) => {
        return {
          ...item,
          albums: (item?.albums || []).splice(0, 4)
        }
      }))
    } else {
      setDisplayFollowingCard(false);
      setBlendHasMoreFlag(((result?.data || []).length && (result?.data || []).length >= 80))
      if (pageNum === 1) {
        setTimeout(() => {
          setBlendLoading(false);
          setBlendList(result?.data || []);
        }, 500);
      } else {
        setBlendList([
          ...blendList,
          ...(result?.data || [])
        ]);
      }
    }
  }

  const handleScroll = () => {
    var scrollTop = document?.documentElement?.scrollTop;
    var windowHeight = document?.documentElement?.clientHeight;
    var scrollHeight = document?.documentElement?.scrollHeight;
    if (scrollTop > 12) {
      setIsShadow(true);
    } else {
      setIsShadow(false);
    }
    if (scrollTop + windowHeight >= scrollHeight - 250) {   //考虑到滚动的位置一般可能会大于一点可滚动的高度，所以这里不能用等于
      if (blendHasMoreFlag && !loadingMoreFlag && bottomLoadFlag) {
        setLoadingMoreFlag(true);
        bottomLoadFlag = false;
        setTimeout(() => {
          bottomLoadFlag = true;
          setPageNum(val => val + 1)
        }, 500);
      }
    }
  }

  const checkFollowingTime = async () => {
    try {
      const result = await updateLastRequestTime();
      if (result?.code === 200) {
        dispatch({
          type: 'changeFollowFlag',
          value: false
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (currentTabID === 4) { // 获取following 数据
      checkFollowingTime()
      getFollowingData({ page_num: pageNum });
    } else {
      getBlendData(currentTabID, { page_num: pageNum, page_size: 16 });
    }
    setPageNum(pageNum);
  }, [pageNum, currentTabID])

  const changeCurrentId = (value: number) => {
    setBlendList([]);
    setCurrentTabID(value);
    setPageNum(1);
    setBlendLoading(true);
    setIsShadow(false);
    document.documentElement.scrollTo(0, 0);
  }

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [pageNum, blendHasMoreFlag, currentTabID, loadingMoreFlag, blendList, peopleCardList])

  useEffect(() => {
    getHistoryData();
  }, [])

  return (
    <>
      <TopTab isShadow={isShadow} currentTabID={currentTabID} changeCurrentId={changeCurrentId} />
      <div className='pt-44 px-12'>
        {
          displayFollowingCard
            ?
            <FollowingCard setPeopleCardList={setPeopleCardList} peopleCardList={peopleCardList} />
            :
            <ContentComponent
              blendLoading={blendLoading}
              loadingMoreFlag={loadingMoreFlag}
              blendHasMoreFlag={blendHasMoreFlag}
              blendList={blendList}
              setBlendList={setBlendList}
              skeleton={currentTabID === 4 ? <img className="mt-12" src={FollowSkeletonImg} alt="" /> : undefined}
            />
        }
      </div>
    </>
  );
}
