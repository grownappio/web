import React, { useState, useEffect } from "react";
import HeaderTop from "@/components/HeaderTop";
import SeedListComponent from "./compoents/SeedList";
import Loading from "@/components/Loading";
import loadingMoreGif from "@/assets/img/grow/loading-more.gif";
import AllSeedTab from "./compoents/AllSeedTab";
import Nodata from "@/pages/grow/components/Nodata";
import styles from "./allSeeds.module.less";

import { getEarnList, getOneSeed } from "./service";
import type { TypeSeedItem } from './data.d';
import { formatToLocalTime } from "@/units";
import { InfiniteScroll } from "antd-mobile";
import { useSearchQuerys } from "@/hooks/useSearchQuerys";
import Appbar from "@/components/Appbar";

let timer: any = null;
let timeOffset = 0; // 本地系统与线上服务器时间差

const AllSeed = () => {
  const qs = useSearchQuerys({ earn_status: 0 })
  const [seedList, setSeedList] = useState<TypeSeedItem[]>([]);
  const [hasMoreFlag, setHasMoreFlag] = useState<boolean>(false);
  const [loadingMoreFlag, setLoadingMoreFlag] = useState<boolean>(false);
  const [pageNum] = useState({ value: 1 });
  const [isShadow, setIsShadow] = useState<boolean>(false);
  const [hideId, setHideId] = useState<number[]>([]);
  const [loadingFlag, setLoadingFlag] = useState<boolean>(true);

  const getSeeditemData = (tempItem: TypeSeedItem) => {
    if (tempItem.status === 1) {
      tempItem.time = getSurplusTime(tempItem.growing_time, tempItem, 1, tempItem.status);
      tempItem.updateTime = getSurplusTime(tempItem.next_time, tempItem, 2, tempItem.status);
    }
    if (tempItem.status === 2) {
      tempItem.time = getSurplusTime(tempItem.matured_time, tempItem, 1, tempItem.status);
      tempItem.updateTime = getSurplusTime(tempItem.next_time, tempItem, 2, tempItem.status);
    }
    return tempItem;
  }

  const updataEarnItem = async (id: number) => {
    const result = await getOneSeed({ id });
    if (result?.code === 200) {
      setSeedList(seedList.map((items: TypeSeedItem) => {
        if (items.id === id) {
          return result?.data;
        }
        return items
      }))
    }
  }

  const updataOneSeed = async (item: TypeSeedItem) => {
    const result = await getOneSeed({ id: item.id });
    if (result?.code === 200) {
      for (let i = 0; i < seedList.length; i += 1) {
        if (seedList[i].id === item.id && result?.data.times === seedList[i].times && result?.data?.status !== 4) {
          return
        }
      }
      if ((qs.earn_status === 0) || result?.data.status === qs.earn_status) {
        setSeedList(seedList.map((items: TypeSeedItem) => {
          if (items.id === item.id) {
            const tempItem = getSeeditemData({
              ...result?.data,
              growing_time: formatToLocalTime(result?.data?.growing_time),
              matured_time: formatToLocalTime(result?.data?.matured_time),
              next_time: formatToLocalTime(result?.data?.next_time),
              created_at: formatToLocalTime(result?.data?.created_at),
            });
            return tempItem;
          }
          return items
        }))
      } else {
        setHideId([item.id]);
        setTimeout(() => {
          setSeedList(seedList.filter((items) => {
            return item.id !== items.id
          }))
        }, 200);
      }
    }
  }

  const getSurplusTime = (time: string, item: TypeSeedItem, type: number, status: number) => {
    const newNow = new Date().getTime() / 1000 + timeOffset;
    const newLeftTime = new Date(time).getTime() / 1000 - newNow;

    if (newLeftTime <= 0 && type === 2 && status === 1) { // 状态为 生长中 更新时间到 调用接口更新数据
      updataOneSeed(item)
    }
    if (newLeftTime <= 0 && type === 1 && status === 2) { // 状态为成熟 阶段更新不会刷新数据 成熟时间到达 更新数据
      updataOneSeed(item)
    }
    const hours = Math.floor(newLeftTime / 60 / 60 % 24) < 0 ? 0 : Math.floor(newLeftTime / 60 / 60 % 24);
    const minutes = Math.floor(newLeftTime / 60 % 60) < 0 ? 0 : Math.floor(newLeftTime / 60 % 60)
    const seconds = Math.floor(newLeftTime % 60) < 0 ? 0 : Math.floor(newLeftTime % 60)
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
  }

  // 启动定时器
  const startTimer = (arr: TypeSeedItem[]) => {
    let flag = false;
    // 判断是否需要启动定时器
    arr.forEach((item: TypeSeedItem) => {
      if (item.status === 1 || item.status === 2) {
        flag = true
      }
    })

    if (flag && timer === null) {
      timer = setInterval(() => {
        if (!seedList.length) {
          clearInterval(timer);
          timer = null;
        }
        setSeedList(seedList.map((item: TypeSeedItem) => {
          const tempItem = getSeeditemData(item);
          return tempItem;
        }));
      }, 1000)
    }
  }

  const claimIncome = async (id: number, index: number) => {
    if (qs.earn_status === 0) {
      updataEarnItem(id);
    } else {
      setHideId([id]);
      setTimeout(() => {
        const tempData = JSON.parse(JSON.stringify(seedList));
        tempData.splice(index, 1)
        setSeedList(tempData);
      }, 200);
    }
  }

  const changeCurrentId = (value: number) => {
    setSeedList([]);
    setIsShadow(false);
    setLoadingFlag(true);
    qs.earn_status = value
    pageNum.value = 1
  }

  // 浇水 
  const seedWater = async (index: number) => {
    const tempData = JSON.parse(JSON.stringify(seedList));
    tempData[index].if_water = true;
    setSeedList(tempData);
  }

  const getSeedList = async () => {
    try {
      // 接口调用前时间
      const beforeInterfaceCallTime = Math.floor(new Date().getTime() / 1000);
      const { data } = await getEarnList({ ...qs, page: { page_size: 20, page_num: pageNum.value } });
      setLoadingMoreFlag(false);
      const interfaceCallTime = Math.floor(new Date().getTime() / 1000) - beforeInterfaceCallTime; // 接口总体调用时间
      timeOffset = data?.time_now + interfaceCallTime - Math.floor(new Date().getTime() / 1000);
      setHasMoreFlag(!!data?.list.length);
      if (pageNum.value === 1) {
        setTimeout(() => {
          setLoadingFlag(false);
        }, 500);
        setSeedList((data?.list).map((item: any) => {
          const tempItem = getSeeditemData({
            ...item,
            growing_time: formatToLocalTime(item.growing_time),
            matured_time: formatToLocalTime(item.matured_time),
            next_time: formatToLocalTime(item.next_time),
            created_at: formatToLocalTime(item.created_at),
          });
          return tempItem;
        }));
      } else {
        setSeedList([
          ...seedList,
          ...(data?.list).map((item: any) => {
            const tempItem = getSeeditemData({
              ...item,
              growing_time: formatToLocalTime(item.growing_time),
              matured_time: formatToLocalTime(item.matured_time),
              next_time: formatToLocalTime(item.next_time),
              created_at: formatToLocalTime(item.created_at),
            });
            return tempItem;
          })
        ]);
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const onScroll = () => setIsShadow(window.scrollY > 45)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function loadMore() {
    pageNum.value++
    setLoadingMoreFlag(true)
    await new Promise(s => setTimeout(s, 1000))
    await getSeedList()
  }

  useEffect(() => {
    pageNum.value = 1;
    getSeedList();
  }, [qs.earn_status])

  useEffect(() => {
    startTimer(seedList);
    return () => {
      clearInterval(timer);
      timer = null;
    }
  }, [seedList])

  return (
    <div className={styles['all-seed-box']}>
      <Appbar className={`sticky top-0 b-b-1 z-10 ${isShadow && 'shadow-sm'}`} title='All seeds' />
      <AllSeedTab value={qs.earn_status} onChange={changeCurrentId} />
      {
        loadingFlag
          ?
          <Loading className="mx-12" />
          :
          <>
            <SeedListComponent className="mx-12" hideId={hideId} seedWater={seedWater} claimIncome={claimIncome} showList={seedList} />
            <InfiniteScroll loadMore={loadMore} hasMore={hasMoreFlag}>
              {
                !hasMoreFlag && seedList.length !== 0 && !loadingMoreFlag
                &&
                <div className={styles['no-more']}>No more </div>
              }
              {
                loadingMoreFlag
                &&
                <div className={styles['no-more']}>
                  <img src={loadingMoreGif} alt="" />
                </div>
              }
              {
                seedList.length === 0
                &&
                <Nodata type={6} />
              }
            </InfiniteScroll>
          </>
      }
    </div>
  )
}

export default AllSeed;