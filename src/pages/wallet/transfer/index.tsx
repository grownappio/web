import React, {useState, useRef, useEffect, useContext} from "react";
import { message } from "antd";
import eventbus from "@/units/eventbus";
import { retainDecimals, getUrlHashParam } from "@/units";
import {DataContext, useData} from "@/reducer";
import { desensitizedCommon } from "@/units/index";
import Appbar from "@/components/Appbar";
import styles from "./index.module.less";

import toImg from "@/assets/img/transfer/to.svg";
import fromImg from "@/assets/img/transfer/from.svg";
import switchImg from "@/assets/img/transfer/switch.svg";
import walletArrowImg from "@/assets/img/wallet/wallet-arrow.svg";
import chainActive from '@/assets/wallets/chain-active.svg';
import buttonLoading from "@/assets/img/login/button-loading.gif";

import ShowInfoModal from '@/components/ShowInfoModal';
import { getToKenLists, sessionStorageKey, transferToSpending, transferToWallet, getWallet, getGasFee, getBalance } from "../service";
import type { TypeAssetItem } from "../data.d";
import OccupyBox from "@/components/OccupyBox";
import { openPopup } from "@/components/_utils/openPopup";
import Button from "@/components/Button";

const Transfer = () => {
  const state = useData();
  const { dispatch } = useContext<any>(DataContext);
  const [type, setType] = useState<boolean>(getUrlHashParam()?.type === 'towallet' ? true : false); // false wallet-spending ----------- true spending-wallet
  const chainListRef = useRef<any>()
  const copenRef = useRef<any>()
  const [assetsFlag, setAssetsFlag] = useState<boolean>(false);
  const [selectAsset, setSelectAsset] = useState<TypeAssetItem>({
    address: '',
    balance: '',
    icon: '',
    id: 0,
    name: '',
    symbol: '',
  })
  const [params] = useState<{ [key: string]: string }>(getUrlHashParam());
  const [chain_id, setChainId] = useState<number>(Number(sessionStorage.getItem(sessionStorageKey[0])))
  const [account, setAccount] = useState<string>('');
  const [assetList, setAssetList] = useState<TypeAssetItem[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [loadingFlag, setLoadingFlag] = useState<boolean>(false);
  const [haveContent, setHaveContent] = useState<boolean>(false);
  const [checkPswType, setCheckPswType] = useState<number>(1); // 1 接口数据重新获取 2 获取fee数据 3 确认转账
  // const [transferAmount, setTransferAmount] = useState<number>(0);

  const [tip, setTip] = useState<string>('');

  const clearNoNum = (value: string) => {
    value = value.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符      
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.substring(0, value.indexOf('.') + 10); // 保留9位小数
    return value;
  }

  const checkReachingTheMinimum = (account: string) => {
    if (Number(account) < Number(selectAsset.min_transfer_amount)) {
      setTip(`Withdraw at least ${selectAsset.min_transfer_amount} ${selectAsset?.symbol}`);
      return false
    } else {
      setTip('');
      return true
    }
  }

  const spotFillZero = () => {
    // 判断第一位是否为小数点 是的话补零
    setTip('');
    if (type && account && account !== '0') { // 当为spending-wallet 判断是否达到最低金额
      checkReachingTheMinimum(account);
    }
    if (account.charAt(0) === '.') {
      setAccount(`0${account}`);
    } else {
      if (account.indexOf('.') === -1) { // 去除整数前面多余的零
        setAccount(account.replace(/^[0]+/, ''))
      } else { // 去除整数前面多余的零
        setAccount(account.replace(/^0+\./g, '0.'))
      }
    }
  }

  const getAssetList = async (value: number, state: string) => {
    try {
      setCheckPswType(1)
      const tempMethod = type ? getBalance : getToKenLists;
      const result = await tempMethod({ chain_id: value });
      if (result?.code === 200) {
        const tempData = (result?.data || []).map((item: any) => {
          return {
            address: item.token_address,
            balance: type ? item.balance : item.token_balance,
            icon: type ? item.token_image_url : item.token_icon,
            id: item.token_id,
            name: item.token_name,
            symbol: item.token_symbol,
            fee_amount: item.fee_amount,
            fee_token_id: item.fee_token_id,
            min_transfer_amount: item?.min_transfer_amount || '0'
          }
        })
        setAssetList(tempData);
        if (state === 'updata') { // 重新拉取 做余额够不够fee判断
          getFeeData(tempData);
          return
        }
        setAccount('');
        tempData.forEach((item: TypeAssetItem) => {
          if (selectAsset.id === item.id) {
            setSelectAsset(item);
          } else if (!selectAsset.id && params.symbol && params.symbol === item.symbol) { // 从币种详情页进入 默认选中该币种
            setSelectAsset(item);
          } else if (!selectAsset.id && !params.symbol && !item.address) { // 首次进去默认选中 没有address 项
            setSelectAsset(item);
          }
        });
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getAssetAddress = async (value: number) => {
    setCheckPswType(1)
    const result = await getWallet({
      chain_id: value,
    })
    if (result?.data === "") {
      message.error('Wallet not created')
      return
    }
    setWalletAddress(result?.data);
  }

  const checkFee = (feeData: string, arr: TypeAssetItem[]) => {
    const fee = feeData.split(' ')[0];
    console.log(assetList);
    const symbol = feeData.split(' ')[1];
    const totalAmount = selectAsset.symbol === symbol ? Number(account) + Number(fee) : fee;
    console.log(totalAmount);
    for (let i = 0; i < arr.length; i += 1) {
      if (symbol === arr[i].symbol) {
        if (arr[i]?.balance && Number(arr[i].balance) >= Number(totalAmount)) {
          setTip('');
          console.log(999999)
          return true
        } else {
          console.log(1111)
          setTip(`Requires ${fee} ${symbol} remaining to provide Gas fee.`);
          return false
        }
      }
    }
    return false
  }

  const getFeeData = async (arr: TypeAssetItem[]) => {
    setCheckPswType(2);
    const result = await getGasFee({
      chain_id,
      from: walletAddress,
      token_id: selectAsset.id,
      amount: account,
      type: type ? 1 : 2  // 1 to wallet 2 to spending
    })
    setLoadingFlag(false);
    if (checkFee(result?.data, arr)) {
      const feeData = result?.data || ''

      const popup = openPopup(
        <>
          <div className="my-28 text-18 font-semibold text-center">Confirm Transfer</div>
          <div className="grid grid-cols-2 justify-between gap-y-4 py-10 px-16 rounded-8 outline outline-1 outline-text/8 outline-offset-0 bg-text/6 [&>*:nth-child(2n)]:text-right">
            <span className="text-12 opacity-60">From</span>
            <span className="text-12 opacity-60">To</span>
            <span className="font-medium"> {type ? 'Spending' : 'Wallet'}</span>
            <span className="font-medium">{type ? 'Wallet' : 'Spending'}</span>
          </div>
          <div className="grid grid-cols-[1fr_1fr] gap-y-16 justify-between mt-18 mb-30 [&>*:nth-child(2n+1)]:opacity-60  [&>*:nth-child(2n)]:text-right [&>*:nth-child(2n)]:font-medium">
            <div>Account</div>
            <div>{type ? desensitizedCommon(walletAddress, 6, 6) : state.userInfo.name}</div>
            <div>Fee</div>
            <div>{feeData}</div>
            <div>You will transfer</div>
            <div>{account} {selectAsset.symbol}</div>
          </div>
          <div className="grid grid-cols-[1fr_1fr] gap-x-16">
            <button className="btn-outline py-14 text-16 font-semibold text-text outline-text/8" onClick={() => popup.close()}>Cancel</button>
            <Button className="btn-primary py-14 text-16 font-semibold" onClick={() => transferAccountsConfirm().then(popup.close)}>Confirm</Button>
          </div>
        </>,
        { bodyClassName: 'p-16 pt-0', showClose: true, key: 'transfer' }
      )
    }
  }

  // 切换住转账方
  const switchType = () => {
    setTip('');
    setCheckPswType(1);
    setType(!type);
  }

  // 确认转账
  const transferAccountsConfirm = async () => {
    const tempParmas: {
      chain_id: number,
      token_id: number,
      amount: string,
      password?: string
    } = {
      chain_id,
      token_id: selectAsset.id,
      amount: account.toString(),
    }
    setCheckPswType(3)
    const tempMethod = type ? transferToWallet : transferToSpending;
    await tempMethod(tempParmas);
    message.success('Transfer successful');
    getAssetList(chain_id, 'init');
    setAccount('');
    dispatch({type: 'changeIfTransfer', value:true});
  }

  const setAllAmount = async () => {
    setAccount(selectAsset.balance.substring(0, selectAsset.balance.indexOf('.') + 10));
    if (type) { // 当为spending-wallet 判断是否达到最低金额
      checkReachingTheMinimum(selectAsset.balance.substring(0, selectAsset.balance.indexOf('.') + 10));
    }
    // if (type) { // spending-wallet
    //   for (let i = 0; i < assetList.length; i += 1) {
    //     if (selectAsset.fee_token_id === assetList[i].id) {
    //       if (selectAsset?.fee_amount && Number(selectAsset.fee_amount) < Number(assetList[i].balance)) {
    //         setAccount(selectAsset.balance.substring(0, selectAsset.balance.indexOf('.') + 10))
    //       } else {
    //         message.warning('No enough fee')
    //       }
    //     }
    //   }
    // } else { // wallet-spending
    //   const result = await getGasFee({
    //     chain_id,
    //     from: walletAddress,
    //     token_id: selectAsset.id,
    //     amount: selectAsset.balance,
    //     type: type ? 1 : 2  // 1 to wallet 2 to spending
    //   })
    //   if (result.code === 200) {
    //     const fee = result?.data.split(' ')[0];
    //     const symbol = result?.data.split(' ')[1];
    //     for (let i = 0; i < assetList.length; i += 1) {
    //       if (symbol === assetList[i].symbol) {
    //         if (selectAsset?.balance && selectAsset.balance >= fee) {
    //           // const amount = (Number(selectAsset.balance) - Number(fee)).toString()
    //           setAccount(selectAsset.balance.substring(0, selectAsset.balance.indexOf('.') + 10));
    //         } else {
    //           message.warning('No enough fee')
    //         }
    //       }
    //     }
    //   }
    // }
  }

  const submitConfirm = async () => {
    // 没有内容 已经点击 spending-wallet时为达到最低提现金额
    if (loadingFlag || !haveContent || (type && !checkReachingTheMinimum(account))) return
    // 检查手续费
    if (!selectAsset.symbol) {
      message.warning('Please select Asset');
      return
    }
    if (!account) {
      message.warning('please enter Amount');
      return
    }

    if (Number(account) <= 0) {
      message.warning('The transfer amount must be greater than zero');
      return
    }
    if (Number(account) > Number(selectAsset.balance)) {
      message.warning('No enough tokens');
      return
    }
    setLoadingFlag(true);
    if (type) {
      // 更新asset数据
      await getAssetList(chain_id, 'updata');
    } else {
      await getFeeData(assetList);
    }
  }

  useEffect(() => {
    if (account && account !== '0') {
      setHaveContent(true);
    } else {
      setHaveContent(false);
    }
  }, [account])

  useEffect(() => {
    // getWalletChains();
    if (!chain_id) return
    if (checkPswType === 1) {
      getAssetAddress(chain_id);
      getAssetList(chain_id, 'init');
    }

    if (checkPswType === 2) {
      getFeeData(assetList);
    }

    if (checkPswType === 3) {
      transferAccountsConfirm();
    }
  }, [state.assetTriggerPsw, type, chain_id])

  useEffect(() => {
    // 监听右边栏获取默认chain_id接口执行完毕
    eventbus.on('defaultChain', (value) => {
      setChainId(value);
    })
  }, [])

  return (
    <div>
      <Appbar title="Transfer" />
      <div className={styles['transfer-box']}>
        <div className={styles['from-and-to']}>
          <div className={styles['from-box']}>
            <div className={styles['icon-box']}>
              <img src={fromImg} alt="" />
            </div>
            <span>From</span>
            <div style={{
              top: `${!type ? 15 / 100 : 64 / 100}rem`
            }} className={[styles.name].join(' ')}>Wallet</div>
          </div>
          <div className={styles['to-box']}>
            <div className={styles['icon-box']}>
              <img src={toImg} alt="" />
            </div>
            <span>To</span>
            <div style={{
              top: `${!type ? 64 / 100 : 15 / 100}rem`
            }} className={[styles.name].join(' ')}>Spending</div>
          </div>
          <img onClick={switchType} className={styles['switch-img']} src={switchImg} alt="" />
        </div>
        {/* asset */}
        <div className={styles['assets-box']}>
          <div className={styles.title}>Asset</div>
          <div ref={copenRef} onClick={(e) => { setAssetsFlag(!assetsFlag) }} className={[styles['default_chain'], assetsFlag ? styles.active : ''].join(' ')}>
            {
              selectAsset.symbol
              &&
              <div ref={chainListRef} className={styles['switch-button']} >
                <img src={selectAsset.icon} alt={''} />
              </div>
            }
            <span>{selectAsset.symbol}</span>
            <div className={styles['care-box'] + ' active-bg'}>
              <img src={walletArrowImg} alt="" />
            </div>
            {
              assetList && (assetList.length > 0) && assetsFlag &&
              <div className={styles['chain-list']}>
                {
                  assetList.map((item: any, index: number) => {
                    return (
                      <div key={index} className={[styles['option-item'], selectAsset.symbol === item.symbol ? styles.active : ''].join(' ')}
                        onClick={() => {
                          setTip('');
                          setAccount('');
                          setSelectAsset(item);
                        }}>
                        <div className={styles['option-left']}>
                          <img src={item.icon} alt={''} />
                          <span>{item.symbol}</span>
                        </div>
                        {
                          selectAsset?.id === item.id &&
                          <img src={chainActive} alt={''} />
                        }
                      </div>
                    )
                  })
                }
              </div>
            }
          </div>
        </div>
        <div className={styles['account-box']}>
          <div className={styles.title}>Amount</div>
          <div className={styles['account-input']}>
            <input value={account} onBlur={spotFillZero} onChange={(e: any) => setAccount(clearNoNum(e.target.value))} type="text" />
            <span onClick={setAllAmount}>All</span>
          </div>
          {
            selectAsset.symbol
            &&
            <div className={styles['show-text']}>
              <span>Available:</span>
              <span>{retainDecimals(selectAsset.balance, 9)} {selectAsset.symbol}</span>
            </div>
          }
          {
            tip
            &&
            <div className={styles['transfer-tip']}>{tip}</div>
          }
        </div>
        <OccupyBox className="fixed left-0 right-0 bottom-0 px-16">
          <div onClick={submitConfirm} className={[styles['confirm-btn'], (haveContent) ? styles.active : ''].join(' ')}>
            { loadingFlag ? <img src={buttonLoading} alt="" /> : <span>Confirm</span> }
          </div>
        </OccupyBox>
      </div>
    </div>
  )
}

export default Transfer;