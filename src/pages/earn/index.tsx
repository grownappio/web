import React, { useEffect, useState } from "react";
import { message } from "antd";
import { CaretDownFilled } from "@ant-design/icons";
import Loading from "@/components/Loading";
import { useHistory } from "react-router-dom";
import SeedListComponent from "./compoents/SeedList";
import Banner from './compoents/Banner';
import Rate from './compoents/Rate';
import styles from "./index.module.less";

import { getProgressBar, getEarnList, getOneSeed, platformBind } from "./service";
import type { TypeSeedItem, TypeProgressBar } from './data.d';
import { formatToLocalTime } from "@/units";
import Options from "@/components/Options";

let timer: any = null;
let timeOffset = 0; // 本地系统与线上服务器时间差

const sortArr = [{
  label: 'time',
  value: 'time',
}, {
  label: 'state',
  value: 'state',
}]


const Earn = () => {
  // const state = useData();
  const history = useHistory();
  const [progressBarData, setProgressBarData] = useState<TypeProgressBar>({
    seeding_income: 0, // 固定收益
    water_reward: 0, // 浮动浇水奖励
    earn_ing: 0, // 总收入
    water_remain: 0, // 剩余水量
    seeding_income_cap: 0, // 固定收益上限
    water_reward_cap: 0, // 浇水奖励上限
    earn_ing_cap: 0, // 总收入上限
    water_cap: 0, // 总水量
    next_to_water: '', // 恢复浇水时间
  });
  const [seedList, setSeedList] = useState<TypeSeedItem[]>([]);
  const [hideId, setHideId] = useState<number[]>([]);
  const [currentType, setType] = useState<string>('state');
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

  const updataOneSeed = async (item: TypeSeedItem) => {
    const result = await getOneSeed({ id: item.id });
    if (result?.data.status !== 4) {
      for (let i = 0; i < seedList.length; i += 1) {
        if (seedList[i].id === item.id && result?.data.times === seedList[i].times && result?.data?.status !== 4) {
          return
        }
      }
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
      // 种子从列表种移除
      setHideId([item.id]);
      setTimeout(() => {
        setSeedList(seedList.filter((items) => {
          return item.id !== items.id
        }))
      }, 200);
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

  // 领取收益
  const claimIncome = async (id: number, index: number) => {
    setHideId([id])
    setTimeout(() => {
      const tempData = JSON.parse(JSON.stringify(seedList));
      tempData.splice(index, 1)
      setSeedList(tempData);
      getRateData();
    }, 200);
  }

  const getRateData = async () => {
    try {
      const result = await getProgressBar();
      if (result?.code === 200) {
        setProgressBarData(
          {
            ...result?.data,
            next_to_water: formatToLocalTime(result?.data.next_to_water),
          } || {});
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getSeedList = async () => {
    try {
      const result = await getEarnList({
        can_receive: currentType === 'state',
        created_desc: currentType === 'time',
      })
      setLoadingFlag(false);
      // 接口调用前时间
      const beforeInterfaceCallTime = Math.floor(new Date().getTime() / 1000);
      const interfaceCallTime = Math.floor(new Date().getTime() / 1000) - beforeInterfaceCallTime; // 接口总体调用时间
      timeOffset = result?.data?.time_now + interfaceCallTime - Math.floor(new Date().getTime() / 1000); // 算出系统时间与本地电脑时间的时间差
      const tempData = (result?.data?.list).map((item: any) => {
        const tempItem = getSeeditemData({
          ...item,
          growing_time: formatToLocalTime(item.growing_time),
          matured_time: formatToLocalTime(item.matured_time),
          next_time: formatToLocalTime(item.next_time),
          created_at: formatToLocalTime(item.created_at),
        });
        return tempItem;
      })
      setSeedList(tempData);
    } catch (err) {
      console.log(err)
    }
  }

  // 浇水 
  const seedWater = (index: number) => {
    const tempData = JSON.parse(JSON.stringify(seedList));
    tempData[index].if_water = true;
    setSeedList(tempData);
    getRateData();
  }

  const getOuathToken = () => {
    const search = window.location.search;
    if (search.indexOf('oauth_token') === -1) return { oauthObj: '', oauth_verifier: '' }
    const tempData = search.split('?')[1].split('&');
    const tempObj: { [key: string]: string } = {}
    tempData.forEach((item) => {
      tempObj[item.split('=')[0]] = item.split('=')[1]
    })
    return tempObj;
  }

  const bindingExternalProjects = async (oauthObj: any) => {
    try {
      const platform = Number(sessionStorage.getItem('platform'));
      const result = await platformBind({
        platform,
        token: oauthObj.oauth_token,
        verify: oauthObj.oauth_verifier
      })
      if (result?.code === 200) {
        getRateData();
        window.history.pushState({}, '0', `${window.location.origin}${window.location.pathname}#/Earn`);
        message.success('Binding successful')
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    startTimer(seedList);
    return () => {
      clearInterval(timer);
      timer = null;
    }
  }, [seedList])

  useEffect(() => {
    const oauthObj: any = getOuathToken();
    if (oauthObj.oauth_token && oauthObj.oauth_verifier) { // 判断是否是绑定玩推特返回页
      bindingExternalProjects(oauthObj); // 绑定推特
    }
    getRateData();
  }, [])

  useEffect(() => {
    setLoadingFlag(true);
    getSeedList();
  }, [currentType])
  return (
    <div className={styles['earn-box']}>
      <Banner />
      <Rate getRateData={getRateData} progressBarData={progressBarData} />

      <div className="flex justify-between items-center mx-12 mt-26 mb-14">
        <div className="text-primary text-18 font-semibold">Seeds</div>
        <Options className="active-shadow" value={currentType} onChange={setType} options={sortArr} />
      </div>
      {
        loadingFlag
          ?
          <Loading />
          :
          <SeedListComponent className="mx-12" hideId={hideId} seedWater={seedWater} claimIncome={claimIncome} showList={seedList} />
      }
      {
        !loadingFlag
        &&
        <div onClick={() => history.push('/allSeeds')} className={styles['view-all-btn']}>View all</div>
      }
    </div>
  )
}

export default Earn;