import React, { useContext, useEffect, useState } from "react";
import { DataContext, useData } from '@/reducer/index';
import {formatToLocalTime, retainDecimals} from "@/units";
import { userBalance } from "@/components/Left/service";
import styles from "./index.module.less";
import {ClassNameType, getFundRecords, sessionStorageKey, transformInstance} from "../../service";
import { useHistory } from "react-router-dom";
// import transform from '@/assets/wallets/transform.svg'
import earn from '@/assets/wallets/earn.svg';
import transferImg from '@/assets/wallets/transfer.svg';
import { defaultCurrentChain, RecordStatus, RecordType } from "@/pages/wallet/service";
import recordNoDate from "@/assets/img/wallet/record-nodate.svg"
import gas from "@/assets/img/wallet/gass.svg";
import arrowImg from '@/assets/img/arrow.svg'
import OccupyBox from "@/components/OccupyBox";
import { ReactSVG } from "react-svg";
import Tokens from "../Tokens";
import TransformItem from "../TransformItem";
export type SpendingProps = {
  toTransfer: () => void;
}

const Spending = (props: SpendingProps) => {
  const { toTransfer } = props;
  const history = useHistory();
  const state = useData();
  const { dispatch } = useContext<any>(DataContext);
  const [currentList, setCurrentList] = useState<transformInstance[]>([]);

  const getAsserts = async () => {
    const currentChainID = Number(sessionStorage.getItem(sessionStorageKey[0]))
    const result = await userBalance({ chain_id: currentChainID ? currentChainID : defaultCurrentChain.id });
    if (result?.code === 200) {
      dispatch({
        type: 'changeSpendingwalletList', value: result?.data?.map((item: any) => {
          return (
            {
              id: item.token_id,
              icon: item.token_image_url,
              name: item.token_symbol,
              num: item.balance,
            }
          )
        })
      });
    }
  }

  const getProgressTransfer = async () => {
    const currentChainID = Number(sessionStorage.getItem(sessionStorageKey[0]))
    const result = await getFundRecords({
      chain_id: currentChainID ? currentChainID : defaultCurrentChain.id,
      page_num: 1,
      page_size: 200,
      // todo7
      // status: 2,
      status_filter: [1]
    })
    if (result?.code === 200) {
      setCurrentList(result?.data?.list);
    }
  }

  useEffect(() => {
    getAsserts()
    getProgressTransfer()
    dispatch({type: 'changeIfTransfer', value:true});
  }, [sessionStorage.getItem(sessionStorageKey[0])])

  return (
    <div className={styles['spending-box']}>
      <div className={styles['default_chain']}>
        <img src={state.chainCurrent.icon} alt={''} />
        <span>{state.chainCurrent?.name}</span>
      </div>
      <Tokens list={state?.SpendingwalletList || []} />
      <div className={styles['record-body']}>
        <div className={styles["in-progress"]}>
          <div className={styles['title']}>In progress</div>
          <div className={styles['all-records']}
            onClick={() => { history.push('/spendingRecord') }}>All records</div>
        </div>
        <div>
          {
            currentList?.length > 0
              ?
              currentList?.map(item => <TransformItem item={item} key={item.id} />)
              :
              <wc-fill-remain class='flex-center'>
                <img className="w-166" src={recordNoDate} alt='' />
              </wc-fill-remain>
          }
        </div>

        <OccupyBox className="fixed inset-x-0 bottom-0 py-10 px-16 shadow-[0px_-2px_8px] shadow-text/8 bg-white">
          <button className="btn-primary py-12 w-full" onClick={toTransfer}>Transfer</button>
        </OccupyBox>
      </div>

    </div>
  )
}

export default Spending;