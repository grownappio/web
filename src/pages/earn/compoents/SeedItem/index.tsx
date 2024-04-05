import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { message, Tooltip } from "antd";
import { Mask, Modal } from "antd-mobile";
import { composedPath } from "@/units/index";
import { useHistory } from "react-router-dom";
import { SEED_BY } from "@/units/commonData";
import { waterGrownSeed, receiveEarn, commentAnswerID, receiveAlert } from "../../service";
import styles from './index.module.less';
import amountImg from "@/assets/img/earn/seed/amount.png";
import waterImg from "@/assets/img/earn/seed/water.svg";

import toHavestImg from "@/assets/img/earn/seed/to-havest.svg";
import waterFinishImg from "@/assets/img/earn/seed/water-finish.svg";
import harvestedImg from "@/assets/img/earn/seed/harvested1.png";
import harvestedImg2 from "@/assets/img/earn/seed/harvested2.png";
import harvestedImg3 from "@/assets/img/earn/seed/harvested3.png";
import harvestedImg4 from "@/assets/img/earn/seed/harvested4.png";
import lostImg from "@/assets/img/earn/seed/lost.png";

import wateredImg from "@/assets/img/earn/seed/watered.png";
import creatorWaterImg from "@/assets/img/earn/seed/creator-water.jpg";
import waterVideo from "@/assets/video/earn/water.mp4";
import creatorWaterVideo from "@/assets/video/earn/creatorWater.mp4";
import harvestVideo from "@/assets/video/earn/harvest1.mp4";
import harvestVideo2 from "@/assets/video/earn/harvest2.mp4";
import harvestVideo3 from "@/assets/video/earn/harvest3.mp4";
import harvestVideo4 from "@/assets/video/earn/harvest4.mp4";

import creatorHarvestVideo from "@/assets/video/earn/creator-harvest1.mp4";
import creatorHarvestVideo2 from "@/assets/video/earn/creator-harvest2.mp4";
import creatorHarvestVideo3 from "@/assets/video/earn/creator-harvest3.mp4";
import creatorHarvestVideo4 from "@/assets/video/earn/creator-harvest4.mp4";
export type SeedItemProps = {
  item: any,
  seedIndex: number;
  earnTipFlag: boolean;
  seedWater: (index: number) => void;
  claimIncome: (id: number, index: number) => void;
  openHarvestTips: (value: string, id: number) => void;
  hideId?: number[];
}

let havestFlag = false;

const seedTypeList = ['Growing', 'Matured', 'Harvested', 'Lost'];

const SeedItem = (props: SeedItemProps, ref: any) => {
  const waterVideoRef: any = useRef(null);
  const maturedVideoRef: any = useRef();
  const history = useHistory();
  const { item, seedIndex, seedWater, claimIncome, hideId = [], openHarvestTips } = props;
  const earnRef = useRef(null);
  const [earnFlag, setEarnFlag] = useState<boolean>(false);

  const [waterFlag, setWaterFlag] = useState<boolean>(false);

  const handleClick = (event: any) => {
    if (!composedPath(event)) return
    const wasOutside = !composedPath(event).includes(earnRef.current);
    // 点击其他位置需要隐藏菜单
    if (wasOutside) setEarnFlag(false);
  }

  const getAnswerId = async (id: number) => {
    try {
      const result = await commentAnswerID({ comment_id: id })
      if (result.code === 200) {
        history.push(`/growDetail?id=${result?.data?.answer_id}&commentId=${id}`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const waterTimeUpdata = () => {
    if (!waterVideoRef.current.posterSetted) {
      waterVideoRef.current.pause();
      waterVideoRef.current.currentTime = 0;
      waterVideoRef.current.posterSetted = true;
    }
  }

  const maturedTimeUpdata = () => {
    if (!maturedVideoRef.current.posterSetted) {
      maturedVideoRef.current.pause();
      maturedVideoRef.current.currentTime = 0;
      maturedVideoRef.current.posterSetted = true;
    }
  }

  const getHarvestSrc = (type: number) => {
    let tempVideo = type === 1 ? harvestVideo : harvestedImg;
    const totalPrice = item.fix_earn + item.float_earn
    if (totalPrice > 0 && totalPrice <= 5) {
      if (type === 1 && item.seed_type === 1) {
        tempVideo = harvestVideo;
      }

      if (type === 1 && item.seed_type === 2) {
        tempVideo = creatorHarvestVideo;
      }
      if (type === 2) {
        tempVideo = harvestedImg;
      }
    }
    if (totalPrice > 5 && totalPrice <= 20) {
      if (type === 1 && item.seed_type === 1) {
        tempVideo = harvestVideo2;
      }

      if (type === 1 && item.seed_type === 2) {
        tempVideo = creatorHarvestVideo2;
      }
      if (type === 2) {
        tempVideo = harvestedImg2;
      }
    }
    if (totalPrice > 20 && totalPrice <= 45) {
      if (type === 1 && item.seed_type === 1) {
        tempVideo = harvestVideo3;
      }

      if (type === 1 && item.seed_type === 2) {
        tempVideo = creatorHarvestVideo3;
      }
      if (type === 2) {
        tempVideo = harvestedImg3;
      }
    }
    if (totalPrice > 45) {
      if (type === 1 && item.seed_type === 1) {
        tempVideo = harvestVideo4;
      }

      if (type === 1 && item.seed_type === 2) {
        tempVideo = creatorHarvestVideo4;
      }
      if (type === 2) {
        tempVideo = harvestedImg4;
      }
    }
    return tempVideo
  }

  useImperativeHandle(ref, () => ({
    confirmHarvest,// 这里运用了es6的简写，（实际等于： resetSharePopup：resetSharePopup）
  }));

  const confirmHarvest = async (id: number) => {
    const result = await receiveEarn({ earn_id: id });
    if (result?.code === 200) {
      maturedVideoRef.current.posterSetted = true;
      maturedVideoRef?.current?.play();
    } else {
      havestFlag = false;
    }
  }

  const clickToHarvest = async () => {
    if (havestFlag) return
    havestFlag = true;
    // maturedVideoRef?.current?.play(); return
    const result = await receiveAlert({ earn_id: item.id });
    if (result?.code === 200) {
      if (result?.data?.can_receive && !result?.data?.alert) {
        confirmHarvest(item.id);
      }
      if (result?.data?.can_receive && result?.data?.alert) {
        havestFlag = false;
        openHarvestTips(result?.data?.alert, item.id)
      }
      if (!result?.data?.can_receive) {
        havestFlag = false;
        message.error(result?.data.alert);
      }
    } else {
      havestFlag = false;
    }
  }

  useEffect(() => {
    waterVideoRef && waterVideoRef.current && waterVideoRef.current.addEventListener('timeupdate', waterTimeUpdata)
    maturedVideoRef && maturedVideoRef.current && maturedVideoRef.current.addEventListener('timeupdate', maturedTimeUpdata)

    return () => {
      waterVideoRef && waterVideoRef.current && waterVideoRef.current.removeEventListener('timeupdate', waterTimeUpdata)
      maturedVideoRef && maturedVideoRef.current && maturedVideoRef.current.removeEventListener('timeupdate', maturedTimeUpdata)
    }
  }, [item])


  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    }
  }, [])

  return (
    <div className={[styles['seed-item'], hideId.indexOf(item.id) !== -1 ? styles.hide : '', (seedIndex + 1) % 4 === 0 && seedIndex !== 0 ? styles['seed-left'] : ''].join(' ')}>
      <div
        className={[
          styles['seed-body'],
          item.status === 1 ? styles.growing : '',
          item.status === 2 ? styles.matured : '',
          item.status === 3 ? styles.harvested : '',
          item.status === 4 ? styles.lost : '',
        ].join(' ')}
        onClick={() => setEarnFlag(e => !e)}
      >
        {
          item.status === 1
          &&
          <video
            onEnded={() => {
              setWaterFlag(false);
            }}
            ref={waterVideoRef}
            autoPlay={item.if_water ? false : true}
            poster={item.seed_type === 1 ? wateredImg : creatorWaterImg}
            className={styles['water-video']}
            preload="none"
            muted={true}
            src={item.seed_type === 1 ? waterVideo : creatorWaterVideo} />
        }

        {
          item.status === 2
          &&
          <video
            onEnded={() => {
              havestFlag = false;
              claimIncome(item.id, seedIndex);
            }}
            ref={maturedVideoRef}
            autoPlay={true}
            className={styles['water-video']}
            preload="none"
            muted={true}
            src={getHarvestSrc(1)} />
        }
        {
          item.status === 3
          &&
          <img className={styles['seed-img']} src={getHarvestSrc(2)} alt="" />
        }
        {
          item.status === 4
          &&
          <img className={styles['seed-img']} src={lostImg} alt="" />
        }
        <div className={styles['seed-tag']}>
          <div className={styles['seed-type']}>{seedTypeList[item.status - 1]}</div>
          {
            (item.status === 1 || item.status === 2)
            &&
            <div className={styles['seed-time']}>{item.time}</div>
          }
        </div>
        {
          item.status !== 4
          &&
          <div className={styles['earn-amount-box']}>
            <div className={styles.title}>Earning</div>
            <div ref={earnRef} className={styles.amount}>
              <span>{(item.fix_earn + item.float_earn).toFixed(2)}</span>
              <img src={amountImg} alt="" />
            </div>

            {
              <Mask className="flex flex-col justify-center px-32" visible={earnFlag} onMaskClick={() => setEarnFlag(e => !e)}>
                <div className="bg-white py-24 px-16 rounded-8">
                  {
                    item.status !== 3
                    &&
                    <div className="mb-24 p-10 text-text/40 text-center b-1 border-[#EBEBEB] rounded-4">Update time countdown {item.updateTime}</div>
                  }
                  <div className="grid grid-cols-[1fr_1fr] gap-y-14 my-12 text-16 [&>*:nth-child(2n+1)]:font-medium [&>*:nth-child(2n)]:text-right [&>*:nth-child(2n)]:text-primary">
                    <span>Seeding income</span>
                    <span>{item.fix_earn.toFixed(2)}</span>
                    <span>Water reward</span>
                    <span>{item.float_earn.toFixed(2)}</span>
                    {item.status === 3 && <span>Lost</span>}
                    {item.status === 3 && <span>{item.lost > 0 ? -item.lost.toFixed(2) : item.lost.toFixed(2)}</span>}
                    <span className="pt-14 b-t-1 border-text/8">Earning</span>
                    <span className="pt-14 b-t-1 border-text/8">{item.status === 3 ? item.received.toFixed(2) : (item.fix_earn + item.float_earn).toFixed(2)}</span>
                  </div>
                  <button className="btn-primary mt-30 py-14 w-full text-16 font-semibold" onClick={() => setEarnFlag(e => !e)}>OK</button>
                </div>
              </Mask>
            }
          </div>
        }
      </div>
      <div className={styles['seed-by']}>Seed By</div>
      <div onClick={() => {
        switch (item.type) {
          case 1:
            history.push(`/questionDetail?id=${item.qac_id}`)
            break;
          case 2:
            history.push(`/growDetail?id=${item.qac_id}`)
            break;
          case 3:
            getAnswerId(item.qac_id);
            break;
          default:
            break;
        }
      }} className={styles.source}>{SEED_BY[item.type]} #<Tooltip title={item.type === 3 ? item.uuid : item.qac_id} color={'#112438'}>{item.type === 3 ? item.uuid : item.qac_id}</Tooltip></div>
      <div className={styles.time}>{item.created_at}</div>
      {/* 点击按钮 */}
      { // 浇水按钮
        item.status === 1
        &&
        <div className={styles['water-btn-box']}>
          <div onClick={async () => {
            if (item.if_water || waterFlag) return
            try {
              // waterVideoRef.current.posterSetted = true;
              // waterVideoRef?.current?.play(); return
              setWaterFlag(true);
              const result = await waterGrownSeed({ earn_id: item.id });
              if (result?.code === 200) {
                waterVideoRef.current.posterSetted = true;
                waterVideoRef?.current?.play();
                seedWater && seedWater(seedIndex);
              } else {
                setWaterFlag(false);
              }
            } catch (err) {
              console.log(err)
            }
          }} className={[styles['water-btn'], item.if_water ? styles['is-water'] : 'no-water'].join(' ')}>
            <div className={styles['btn-left']}>Water</div>
            <div className={styles['icon-box-hidden']}>
              <div>
                <img className="block px-10 w-28 h-full box-content" src={waterImg} alt="" />
                <img className="block px-8 w-32 h-full box-content" src={waterFinishImg} alt="" />
              </div>
            </div>
          </div>
        </div>
      }

      { // 收获按钮
        item.status === 2
        &&
        <div className={styles['water-btn-box']}>
          <div onClick={clickToHarvest} className={[styles['water-btn'], styles['to-havest']].join(' ')}>
            <div className={styles['btn-left']}>To Harvest </div>
            <div className={styles['icon-box-hidden']}>
              <div>
                <img className="block px-8 w-32 h-full box-content" src={toHavestImg} alt="" />
                <img className="block px-8 w-32 h-full box-content" src={waterFinishImg} alt="" />
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default forwardRef(SeedItem);