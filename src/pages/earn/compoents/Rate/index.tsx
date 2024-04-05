import React, { useState, useRef, useEffect, useContext } from "react";
import { message } from "antd";
import AddWaterMask from "../AddWaterMask";
import { DataContext } from "@/reducer";
import type { TypeProgressBar } from "../../data.d";
import { composedPath } from "@/units/index";
import styles from './index.module.less';
import waterImg from "@/assets/img/earn/rate/water.png";
import ChoosePlan from "../ChoosePlan";
import capImg from "@/assets/img/earn/rate/cap.png";
import upgradeImg from "@/assets/img/earn/rate/upgrade.svg";
import questionImg from "@/assets/img/earn/rate/question.svg";
import addWaterImg from "@/assets/img/earn/rate/add-water.svg";
import { updateEarnList } from "../../service";
import { Modal } from "antd-mobile";

let timer: any = null;

export type RateProps = {
  progressBarData: TypeProgressBar;
  getRateData: () => void;
}

const Rate = (props: RateProps) => {
  const { dispatch } = useContext<any>(DataContext);
  const { progressBarData, getRateData } = props;
  const [refillTime, setRefillTime] = useState<string>('');
  const [chooseVisible, setChooseVisible] = useState<boolean>(false);
  const [addWaterFlag, setAddWaterFlag] = useState<boolean>(false);

  const switchEarningMethods = async (earn_plan: number) => {
    const result = await updateEarnList({ earn_plan });
    if (result?.code === 200) {
      message.success('Switching successful');
      dispatch({
        type: 'changeEarnPlan', value: earn_plan
      });
      getRateData();
      setChooseVisible(false);
    }
  }

  const getSurplusTime = (time: string) => {
    const newNow = new Date().getTime() / 1000;
    const newLeftTime = new Date(time).getTime() / 1000 - newNow;
    if (newLeftTime <= 0) {
      getRateData();
    }
    const hours = Math.floor(newLeftTime / 60 / 60 % 24);
    const minutes = Math.floor(newLeftTime / 60 % 60)
    return `${hours}h ${minutes + 1}min`
  }

  function showEarnPopup() {
    Modal.alert({
      confirmText: 'OK',
      closeOnMaskClick: true,
      content: (
        <div className="grid grid-cols-[1fr_1fr] gap-y-14 my-12 text-16 [&>*:nth-child(2n+1)]:font-medium [&>*:nth-child(2n)]:text-right [&>*:nth-child(2n)]:text-primary">
          <span>Seeding income</span>
          <span>{(progressBarData?.seeding_income).toFixed(2)}</span>
          <span>Water reward</span>
          <span>{(progressBarData?.water_reward).toFixed(2)}/{progressBarData?.seeding_income_cap}</span>
          <span className="pt-14 b-t-1 border-text/8">Earning</span>
          <span className="pt-14 b-t-1 border-text/8">{(progressBarData?.water_reward + progressBarData?.seeding_income).toFixed(2)}/{progressBarData?.earn_ing_cap}</span>
        </div>
      )
    })
  }
  
  function showQ() {
    Modal.alert({
      confirmText: 'OK',
      closeOnMaskClick: true,
      content: (
        <div className="mt-12 text-14 text-text/80 text-center space-y-12">
          <p>Earning include planting rewards and watering rewards, updated hourly.</p>
          <p>Seeding income gradually increases during growing time.</p>
          <p>Watering reward can only be obtained after watering, and the reward are calculated according to the effect of high-quality content and encouraging behaviors.</p>
        </div>
      )
    })
  }

  // 启动定时器
  const startTimer = () => {
    if (timer !== null) return
    timer = setInterval(() => {
      setRefillTime(getSurplusTime(progressBarData.next_to_water))
    }, 1000 * 60)
  }

  useEffect(() => {
    setRefillTime(getSurplusTime(progressBarData.next_to_water))
    startTimer();
    return () => {
      clearInterval(timer);
      timer = null;
    }
  }, [progressBarData])

  return (
    <div className={styles['rate-box']}>
      <div className={styles['today-cap']}>
        <div className={styles['cap-container']}>
          <div className={styles['cap-left']}>
            <img src={capImg} alt="" />
          </div>
          <div className={styles['cap-num']}>
            <span>DAILY EARNING CAP</span>
            <span className={styles['total-num']}><span>{(progressBarData?.seeding_income + progressBarData?.water_reward).toFixed(2)}</span><span>/{progressBarData?.earn_ing_cap}</span></span>
          </div>
          <div className={styles['cap-right']} onClick={showEarnPopup}>
            <div className={styles['hidden']}>
              <div style={{ width: `${progressBarData?.seeding_income / progressBarData?.earn_ing_cap * 100}%` }} className={styles['seeding-income']}>
                {
                  progressBarData?.seeding_income > 14
                  &&
                  progressBarData?.seeding_income.toFixed(2)
                }
              </div>
              <div style={{ width: `${((progressBarData?.water_reward + progressBarData?.seeding_income) / progressBarData?.earn_ing_cap) * 100}%` }} className={styles['water-reward']}>
                {
                  progressBarData?.water_reward > 14
                  &&
                  <span style={{ marginLeft: `${progressBarData?.seeding_income / progressBarData?.earn_ing_cap * 100}%` }}>{progressBarData?.water_reward.toFixed(2)}</span>
                }
              </div>
            </div>
          </div>
        </div>
        <img onClick={() => setChooseVisible(true)} className={styles['upgrade-img']} src={upgradeImg} alt="" />
        <div className={styles['question-box']}>
          <img onClick={showQ} className={styles['question-img']} src={questionImg} alt="" />
        </div>
      </div>

      <div className={[styles['today-cap'], styles['watering-time']].join(' ')}>
        <div className={styles['cap-container']}>
          <div className={styles['cap-left']}>
            <img src={waterImg} alt="" />
          </div>
          <div className={styles['cap-num']}>
            <span>WATERING TIMES</span>
            <div className={styles['total-num']}><span>{(progressBarData.water_remain).toFixed(1)}</span><span>/{(progressBarData.water_cap).toFixed(1)}</span></div>
          </div>
          <div className={styles['cap-right']}>
            <div style={{ width: `${progressBarData.water_remain / progressBarData.water_cap * 100}%` }} className={styles['seeding-income']}>
              {
                progressBarData.water_remain > 1
                &&
                (progressBarData.water_remain).toFixed(1)
              }
            </div>
            {
              progressBarData.water_cap !== progressBarData.water_remain
              &&
              <div className={[styles['refill-in'], progressBarData.water_remain === progressBarData.water_cap ? styles.fill : ''].join(' ')}>
                <span>Refill in</span>
                <span>{refillTime}</span>
              </div>
            }
          </div>
        </div>
        {
          !progressBarData.is_bind_twitter
          &&
          <img onClick={() => setAddWaterFlag(true)} className={styles['upgrade-img']} src={addWaterImg} alt="" />
        }
        <div className="w-32"></div>
      </div>
      {
        !progressBarData.is_bind_twitter
        &&
        <AddWaterMask addWaterFlag={addWaterFlag} setAddWaterFlag={setAddWaterFlag} />
      }
      <ChoosePlan switchEarningMethods={switchEarningMethods} chooseVisible={chooseVisible} setChooseVisible={setChooseVisible} />
    </div>
  )
}

export default Rate