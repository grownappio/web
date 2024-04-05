import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {formatToLocalTime, retainDecimals} from "@/units";
import { Tooltip } from "antd";
import { DataContext, useData } from '@/reducer/index';
import { userBalance } from "@/components/Left/service";
import { TypeProgressItem } from "../../data";
import styles from "./index.module.less";
import { sessionStorageKey, getFundRecords } from "@/components/Wallets/service";

import earn from "@/assets/wallets/earn.svg";
import transferImg from '@/assets/wallets/transfer.svg';
import recordNoDate from "@/assets/wallets/no-date.svg";
import gas from "@/assets/img/wallet/gass.svg";
const Spending = () => {

  const history = useHistory();
  const state = useData();
  const { dispatch } = useContext<any>(DataContext);
  const [currentList, setCurrentList] = useState<TypeProgressItem[]>([]);
  const getAsserts = async () => {
    const currentChainID = Number(sessionStorage.getItem(sessionStorageKey[0]))
    const result = await userBalance({ chain_id: currentChainID ? currentChainID : 97 });
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
    const currentChainID = Number(sessionStorage.getItem(sessionStorageKey[0]));
    const params: any = {
      chain_id: currentChainID,
      page_num: 1,
      page_size: 200,
      status: -1,
      status_filter: [2]
    }
    const result = await getFundRecords(params)
    if (result?.code === 200) {
      setCurrentList((result?.data?.list || []).map((item: any) => {
        return {
          explore_url: item.explore_url,
          type: item.type,
          amount: item.amount,
          token_symbol: item.token_symbol,
          created_at: item.created_at,
          timestamp:item.timestamp,
        }
      }));
    }
  }

  const toAllRecord = () => {
    history.push('/spendingRecord');
  }

  useEffect(() => {
    getAsserts();
    getProgressTransfer();
  }, [sessionStorage.getItem(sessionStorageKey[0])])

  useEffect(()=>{
        if(state.if_transfer===true){
          getProgressTransfer()
          dispatch({type: 'changeIfTransfer', value:false});
        }
  },[state.if_transfer])

  return (
    <div className={styles['spending-box']}>
      <div className={styles['default_chain']}>
        <img src={state.chainCurrent.icon} alt={''} />
        <span>{state.chainCurrent?.name}</span>
      </div>
      <div className={styles['wallet-list']}>
        {
          (state?.SpendingwalletList || []).map((item, index) => {
            return (
              <div key={index} className={styles['wallet-option']}>
                <div className={styles['option-left']}>
                  <img src={item.icon} alt="" />
                  <span>{item.name}</span>
                </div>
                {
                  item.num.length > 10
                    ?
                    <Tooltip title={retainDecimals(item?.num || 0, 9)} color={'#112438'}>
                      <div className={styles.num}>{retainDecimals(item?.num || 0, 9)}</div>
                    </Tooltip>
                    :
                    <div className={styles.num}>{retainDecimals(item?.num || 0, 9)}</div>
                }
              </div>
            )
          })
        }
      </div>
      {/* In progress */}
      <div className={styles['progress-box']}>
        <div className={styles['progress-box-header']}>
          <div className={styles.title}>In progress</div>
          <div onClick={toAllRecord} className={styles['to-all-record-btn']}>All records</div>
        </div>
            <div className={[styles['detailed-list'], currentList?.length>0 ? styles.active : ''].join(' ')}
            >
              {
                currentList?.length>0
                    ?
                  currentList.map((item) => {
                    return (
                      <div onClick={() => {
                        if(item.explore_url===''&&item.source_id===0){return}
                        if(item.explore_url===''){history.push(`/allSeeds`)}else {window.open(item.explore_url)}}}
                         key={item.token_symbol}
                         className={styles['detailed-option']}>
                        <img src={item.type === 4 ? earn:(item.type ===3? gas:transferImg)} alt={''} />
                        <div className={styles.time}>{formatToLocalTime(item.timestamp)}</div>
                        {
                          item.amount.length > 10
                            ?
                            <div className={styles.amount}>{item.amount} ${item.token_symbol}</div>
                            :
                            <div className={styles.amount}>{Number(item.amount) <= 0 ? item.amount : `+${item.amount}`}{` ${item.token_symbol}`}</div>
                        }
                      </div>
                    )
                  })
                  :
                  <div className={styles["transform-noDate"]}>
                    <img  src={recordNoDate} alt={''}/>
                    <span>Temporarily no data</span>
                  </div>
              }
            </div>
      </div>
    </div>
  )
}

export default Spending;