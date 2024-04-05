import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Popup } from "antd-mobile";
import { useData } from "@/reducer";
import styles from "./index.module.less";
import closeImg from "@/assets/img/earn/choosePlan/close.svg";
import everyoneImg from "@/assets/img/earn/choosePlan/everyone.png";
import creatorImg from "@/assets/img/earn/choosePlan/creator.png";
import selectImg from "@/assets/img/earn/choosePlan/select.svg";
import creatorMaskImg from "@/assets/img/earn/choosePlan/creator-mask.png";
import everyoneMaskImg from "@/assets/img/earn/choosePlan/everyone-mask.png";
import reduceImg from "@/assets/img/earn/choosePlan/reduce.svg";
import increaseImg from "@/assets/img/earn/choosePlan/increase.svg";
import { earnPlanExist } from "../../service";

const planList = [
  {
    id: 1,
    icon: () => <img className="-mb-8 w-120 h-51 -z-10" src={everyoneImg} alt="" />,
    name: 'Active Earning Plan',
    title: 'For everyone',
    seedingCap: 75,
    waterCap: 75,
    growingTime: '20h',
    maturedTime: '8h',
    maskIcon: everyoneMaskImg
  },
  {
    id: 2,
    icon: () => <img className="-mt-14 -mb-16 w-151 h-73 -z-10" src={creatorImg} alt="" />,
    name: 'Creation Earning Plan',
    title: 'For Creator',
    seedingCap: 50,
    waterCap: 200,
    growingTime: '24h',
    maturedTime: '12h',
    maskIcon: creatorMaskImg
  },
]

export type ChoosePlanProps = {
  chooseVisible: boolean;
  setChooseVisible: (value: boolean) => void;
  switchEarningMethods: (value: number) => void;
}

const ChoosePlan = (props: ChoosePlanProps) => {
  const { chooseVisible, setChooseVisible, switchEarningMethods } = props;
  const state = useData();
  const [btnFlag, setBtnFlag] = useState<boolean>(false);
  const [tipFlag, setTipFlag] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<number>(1);
  const [chooseVisble1, setChooseVisble1] = useState<boolean>(false);

  const checkIsWhiteList = async () => {
    const { data } = await earnPlanExist({ earn_plan: 2 });
    if (data?.exist) {
      setTipFlag(false);
      setCurrentId(2);
      setBtnFlag(true);
    } else {
      setTipFlag(true);
    }
  }

  useEffect(() => {
    if (!chooseVisible) {
      setBtnFlag(false);
    }
    setTimeout(() => {
      setChooseVisble1(chooseVisible)
    }, 100);
  }, [chooseVisible])

  useEffect(() => {
    setCurrentId(state.earn_plan);
  }, [state.earn_plan])
   
  return (
    <>
      <Popup visible={chooseVisible} onClose={() => setChooseVisible(false)}>
        <div className="pt-32 px-24 rounded-t-8" style={{ backgroundImage: 'linear-gradient(180deg, #FFF2CF 0, rgba(255, 251, 240, 0.00) 80px)' }}>
          <img className='absolute top-12 right-12 w-28 h-28 opacity-85' onClick={() => setChooseVisible(false)} src={closeImg} alt="" />
          <div className={styles.title}>Choose your earn plan</div>
          
          <Swiper className={styles['plan-list'] + ' mySwiper !pb-60 overflow-visible'} pagination={{ horizontalClass: '!bottom-20', bulletActiveClass: '!bg-primary !opacity-100' }} modules={[Pagination]} slidesPerView={1} spaceBetween={16}>
            {
              planList.map((item) => (
                <SwiperSlide onClick={() => {
                  if (item.id === state.earn_plan) {
                    setBtnFlag(false);
                  } else if (item.id === 1) {
                    setBtnFlag(true);
                  }
                  if (item.id === 1) {
                    setTipFlag(false);
                  }
                  if (item.id === 2) {
                    if (state.earn_plan !== 2) {
                      checkIsWhiteList();
                    }
                  }
                  setCurrentId(item.id);
                }} key={item.id} className={[styles['plan-option'], currentId === item.id ? styles.active : ''].join(' ')}>
                  <div className='relative flex justify-center'>
                    {item.icon()}
                    <img className='absolute bottom-0 -right-8 -mb-14 w-72 h-72 -z-10' src={item.maskIcon} alt="" />
                    { item.id === state.earn_plan && <img className='absolute -left-18 -bottom-31 w-56 h-56' src={selectImg} alt='' /> }
                  </div>
                  <div className={styles['plan-content']}>
                    <div className={styles['content-title']}>{item.title}</div>
                    <div className={styles.line} />
                    <div className={styles.name}>{item.name}</div>
                      <div className="relative grid grid-cols-[1fr_2em] gap-y-8 [&>*:nth-child(odd)]:opacity-60 [&>*:nth-child(even)]:font-medium">
                        <div>Seeding income cap</div>
                        <div>
                          <span>{item.seedingCap}</span>
                          { item.id !== currentId && <img className="absolute -right-6 translate-y-8" src={item.id === 1 ? increaseImg : reduceImg} alt="" /> }
                        </div>
                        <div>Water reward cap</div>
                        <div>
                          <span>{item.waterCap}</span>
                          { item.id !== currentId && <img className="absolute -right-6 translate-y-8" src={item.id === 2 ? increaseImg : reduceImg} alt="" /> }
                        </div>
                        <div>Growing Time</div>
                        <div>
                          <span>{item.growingTime}</span>
                          { item.id !== currentId && <img className="absolute -right-6 translate-y-8" src={item.id === 2 ? increaseImg : reduceImg} alt="" /> }
                        </div>
                        <div>Matured Time</div>
                        <div>
                          <span>{item.maturedTime}</span>
                          { item.id !== currentId && <img className="absolute -right-6 translate-y-8" src={item.id === 2 ? increaseImg : reduceImg} alt="" /> }
                        </div>
                      </div>
                  </div>
                </SwiperSlide>
              ))
            }
          </Swiper>

          <button className={`btn-primary mb-16 py-14 w-full text-16 font-semibold ${!btnFlag && 'disabled'}`} onClick={() => switchEarningMethods(currentId)}>
            Change Plan
          </button>
        </div>
      </Popup>
      {
        (tipFlag && chooseVisible)
        &&
        <div className='fixed top-14  left-0 w-full z-[10000]'>
          <div className="mx-16 p-12 bg-text text-white rounded-8">
            Temporarily only open to whitelist users. If you are a creator, please contact us via <a className="text-[#1B90EE] underline" href="https://twitter.com/grown_app" target="_blank">Twitter @grown_app</a>
          </div>
        </div>
      }
    </>
  )
}

export default ChoosePlan;