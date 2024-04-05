import React, { useState, useEffect } from "react";
import { getLoginUrl } from "../../service";
import styles from './index.module.less';

import waterDropImg from "@/assets/img/earn/rate/water-drop.png";
import addWaterCloseImg from "@/assets/img/earn/rate/add-water-close.svg";
import bgImg from "@/assets/img/earn/rate/add-water-bg.png";


export type AddWaterMaskProps = {
  addWaterFlag: boolean;
  setAddWaterFlag: (value: boolean) => void;
}

const AddWaterMask = (props: AddWaterMaskProps) => {
  const { addWaterFlag, setAddWaterFlag } = props;
  const [waterVisible, setWaterVisible] = useState<boolean>(false);
  const toBinding = async () => {
    try {
      const result = await getLoginUrl({ platform: 1, callback_page: 'earn' })
      if (result?.code === 200) {
        sessionStorage.setItem('platform', '1');
        window.location.href = result?.data;
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    setTimeout(() => {
      setWaterVisible(addWaterFlag)
    }, 100);
  }, [addWaterFlag])
  return (
    <>
      {
        addWaterFlag
        &&
        <div className={styles['add-water-mask']} onClick={() => setAddWaterFlag(false)}>
          <div onClick={(e) => e.stopPropagation()} className={[styles['water-mask-box'], waterVisible ? styles.show : styles.hide].join(' ')}>
            <img className="absolute-center !-z-10" src={bgImg} alt="" />
            <img onClick={() => setAddWaterFlag(false)} className='absolute top-0 right-24 w-32 h-32 rounded-full' src={addWaterCloseImg} alt="" />
            <div className='text-16 text-primary font-medium mx-32'>
              Link social media accounts can permanently get watering
            </div>
            <div className='flex-center mt-18'>
              <img className="mr-3 w49 h-49" src={waterDropImg} alt="" />
              <span className="text-primary text-20 font-semibold">+1</span>
            </div>
            <div className="grid grid-cols-2 gap-x-12 mt-32">
              <button onClick={() => setAddWaterFlag(false)} className='btn-outline py-18 text-16 text-primary font-semibold outline-primary'>Next time</button>
              <button onClick={() => toBinding()} className='btn-primary py-18 text-16 font-semibold'>Go to link</button>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default AddWaterMask;