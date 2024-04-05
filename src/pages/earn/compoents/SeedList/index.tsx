import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Radio } from "antd";
import { useData } from "@/reducer";
import { useHistory } from "react-router-dom";
import ShowInfoModal from '@/components/ShowInfoModal';
import SeedItem from "@/pages/earn/compoents/SeedItem";
import emptyLand from "@/assets/img/earn/empty-land.svg";
import styles from './index.module.less';
import { earnExist, earnTipClose } from "../../service";
import { NativeProps, withNativeProps } from 'antd-mobile/es/utils/native-props';

// 将某元素查到数组中的某位置
export function insertBefore<T>(list: T[], from: T, to?: T): T[] {
  const copy = [...list];
  const fromIndex = copy.indexOf(from);
  if (from === to) {
    return copy;
  }
  copy.splice(fromIndex, 1);
  const newToIndex = to ? copy.indexOf(to) : -1;
  if (to && newToIndex >= 0) {
    copy.splice(newToIndex, 0, from);
  } else {
    // 没有 To 或 To 不在序列里，将元素移动到末尾
    copy.push(from);
  }
  return copy;
}

// 判断是否数组相等
export function isEqualBy<T>(a: T[], b: T[], key: keyof T) {
  const aList = a.map((item) => item[key]);
  const bList = b.map((item) => item[key]);
  let flag = true;
  aList.forEach((i, idx) => {
    if (i !== bList[idx]) {
      flag = false
    }
  })
  return flag;
}
export type DropPageProps = {
  showList: any[];
  hideId: number[];
  className?: string;
  seedWater: (index: number) => void;
  claimIncome: (id: number, index: number) => void;
} & NativeProps

const SeedList = (props: DropPageProps) => {
  const { showList = [], seedWater, claimIncome, hideId } = props;
  const history = useHistory();
  const state = useData();
  const seedItemRef = useRef<any>([]);
  const [earnTipFlag, setEarnTipFlag] = useState<boolean>(false); // false 正常打开 true 不打开收获提示框
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [tipCheckVal, setTipCheckVal] = useState<boolean>(false);
  const [harvestTip, setHarvestTip] = useState<string>('');
  const [tipEarnId, setTipEarnId] = useState<number>(0);

  const handleOnClickRadio = () => setTipCheckVal(!tipCheckVal);
  // todo
  // const sortedList = useMemo(() => showList.slice().sort((a, b) => a.id - b.id), [showList]);
  const sortedList = showList;

  const getEarnTipFlag = async () => {
    try {
      const result = await earnExist();
      if (result?.code === 200) {
        setEarnTipFlag(result?.data?.Closed);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const confirmHarvest = async () => {
    setConfirmModalVisible(false);
    seedItemRef && seedItemRef?.current && seedItemRef.current[tipEarnId].confirmHarvest(tipEarnId);
    // 当天不在展示改弹窗
    if (tipCheckVal) {
      const result = await earnTipClose();
      if (result?.code === 200) {
        setEarnTipFlag(true);
      }
    }
  }

  const openHarvestTips = (tip: string, id: number) => {
    setConfirmModalVisible(true);
    setHarvestTip(tip);
    setTipEarnId(id);
  }

  useEffect(() => {
    getEarnTipFlag();
  }, [])

  return withNativeProps(props,
    <>
      <div className={styles.list + ' ' + props.className}>
        {sortedList.map((item) => {
          const index = showList.findIndex((e) => e === item);
          return (
              <SeedItem ref={(ref) => {
                if (ref) {
                  seedItemRef.current[item.id] = ref;
                }
              }} openHarvestTips={openHarvestTips} earnTipFlag={earnTipFlag} hideId={hideId} claimIncome={claimIncome} seedWater={seedWater} key={item.id} item={item} seedIndex={index} />
          );
        })}
        <div onClick={() => history.push(state.earn_plan === 1 ? '/grow' : '/answerQuestions')} className={styles['empty-land']}>
          <div className={styles['empty-land-top']}>
            <div className={styles['empty-land-btn-box']}>
              <img src={emptyLand} alt="" />
              <span>Empty Land</span>
            </div>
            <div className={styles.tip}>Earning</div>
          </div>
          <div className={styles['empty-land-bottom']}>
            <div>To seed</div>
          </div>
        </div>
      </div>
      <ShowInfoModal
        open={confirmModalVisible}
        title="Harvest Tips"
        onCancel={() => setConfirmModalVisible(false)}
        onConfirm={confirmHarvest}
      >
        <div className={styles['harvest-tip-box']}>
          <div className={styles.tip}>{harvestTip}</div>
          <div className={styles['radio-box']}><Radio checked={tipCheckVal} onClick={handleOnClickRadio}>Do not remind today</Radio></div>
        </div>
      </ShowInfoModal>
    </>
  );
};
export default React.memo(SeedList);