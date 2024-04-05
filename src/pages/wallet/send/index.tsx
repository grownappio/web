import React, { useState, useRef, useEffect, useContext } from "react";
import { message } from "antd";
import eventbus from "@/units/eventbus";
import { retainDecimals } from "@/units";
import { getUrlHashParam } from "@/units";
import { DataContext, useData } from "@/reducer";
import walletArrowImg from "@/assets/img/wallet/wallet-arrow.svg";
import styles from "./index.module.less";
import buttonLoading from "@/assets/img/login/button-loading.gif";
import chainActive from '@/assets/wallets/chain-active.svg';
import { getGasFee, getToKenLists, getWallet, transferToExternal, sessionStorageKey } from "@/pages/wallet/service";
import Appbar from "@/components/Appbar";
import { openPopup } from "@/components/_utils/openPopup";
import Button from "@/components/Button";
import { showActionSheet } from "@/components/_utils/Confirm";

const Send = () => {
  const state = useData();
  const chainListRef = useRef<any>()
  const copenRef = useRef<any>()
  const [params] = useState<{ [key: string]: string }>(getUrlHashParam());
  const [assetsFlag, setAssetsFlag] = useState<boolean>(false);
  const [checkPswType, setCheckPswType] = useState<number>(1); // 1 接口数据重新获取 2 获取fee数据 3 确认send
  const [account, setAccount] = useState<string>('');
  const [chain_id, setChainId] = useState<number>(Number(sessionStorage.getItem(sessionStorageKey[0])))
  const [assertIcon, setAssertIcon] = useState<string>('');
  const [assertNum, setAssertNum] = useState<number>(0)
  const [assetName, setAssetName] = useState<string>('');
  const [tokenEnable, setTokenEnable] = useState<string>(''); // 是否可以转账
  const [assertTokenID, setAssertTokenID] = useState<number>(0)
  const [toAddress, setToAddress] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');
  const [feeData, setFeeData] = useState<string>('');
  const [loadingFlag, setLoadingFlag] = useState<boolean>(false);
  const [haveContent, setHaveContent] = useState<boolean>(false);
  const [tip, setTip] = useState<string>('');
  const { dispatch } = useContext<any>(DataContext);

  const clearNoNum = (value: string) => {
    value = value.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符      
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.substring(0, value.indexOf('.') + 10); // 保留9位小数
    return value;
  }

  const spotFillZero = () => {
    // 判断第一位是否为小数点 是的话补零
    setTip('');
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

  const getWalletList = async (value: number) => {
    dispatch({ type: 'changeWalletList', value: [] })
    const result = await getWallet({
      chain_id: value,
    })
    if (result?.data === "") {
      return
    } else {
      setUserAddress(result?.data)
    }
    setCheckPswType(1);
    const TokenLists = await getToKenLists({
      chain_id: value,
    })
    if (TokenLists?.data?.length >= 1) {
      let tempwalletList = TokenLists?.data
      /*向区块链请求 资产*/
      const tempArr = tempwalletList?.map((item: any) => {
        if (params?.symbol && item.token_symbol === params.symbol) {
          setAssertIcon(item.token_icon)
          setAssetName(item.token_symbol)
          setAssertNum(item.token_balance)
          setAssertTokenID(item.token_id)
          setTokenEnable(item.token_enable)
        }
        if (!params.symbol && !item.token_address) {
          setAssertIcon(item.token_icon)
          setAssetName(item.token_symbol)
          setAssertNum(item.token_balance)
          setAssertTokenID(item.token_id)
          setTokenEnable(item.token_enable)
        }
        return (
          {
            name: item.token_symbol,
            icon: item.token_icon,
            num: item.token_balance,
            id: item.token_id,
            token_enable: item.token_enable
          }
        )
      })
      dispatch({ type: 'changeWalletList', value: tempArr || [] });
    }
  }

  const getFeeData = async () => {
    setCheckPswType(2);
    setLoadingFlag(true);
    const result = await getGasFee({
      chain_id: state.chainCurrent?.id,
      from: userAddress,
      to: toAddress,
      token_id: assertTokenID,
      amount: account,
      type: 2,
    })
    setLoadingFlag(false);
    if (checkFee(result?.data)) {
      const popup = openPopup(
        <>
          <div className="my-28 text-20 font-semibold text-center">Send</div>
          <div className="grid grid-cols-[1fr_1fr] gap-y-16 [&>*:nth-child(2n+1)]:opacity-60 [&>*:nth-child(2n)]:font-medium [&>*:nth-child(2n)]:text-right">
            <div>Fee</div>
            <div>{feeData}</div>
            <div>You'll send</div>
            <div>{` ${account} ${assetName}`}</div>
            <div>Send address</div>
            <div>{toAddress}</div>
          </div>
          <div className="grid grid-cols-[1fr_1fr] gap-x-16 mt-30">
            <button className="btn-outline py-14 text-16 font-semibold text-text outline-text/8" onClick={() => popup.close()}>Cancel</button>
            <Button className="btn-primary py-14 text-16 font-semibold" onClick={() => sedTransform().then(popup.close)}>Confirm</Button>
          </div>
        </>,
        { bodyClassName: 'p-16 pt-0', showClose: true, key: 'send' }
      )
      setFeeData(result?.data || '');
    }
  }

  const handelAssertSelect = (item: any) => {
    setAssetName(item.name);
    setAssertNum(item.num);
    setAssertIcon(item.icon);
    setAssertTokenID(item.id);
    setTokenEnable(item.token_enable);
    setAccount('');
  }

  const sedTransform = async () => {
    if (Number(account) > 0) {
      setCheckPswType(3);
      const result = await transferToExternal({
        chain_id: state.chainCurrent?.id,
        token_id: assertTokenID,
        amount: Number(account) <= assertNum ? account : assertNum.toString(),
        to: toAddress
      })
      message.success('Send succeeded');
      getWalletList(chain_id);
      setAccount('');
    }
  }

  const pasteAddress = async () => {
    const text = await navigator.clipboard.readText();
    setToAddress(text);
  }

  const setAllAmount = async () => {
    setAccount(assertNum.toString().substring(0, assertNum.toString().indexOf('.') + 10));
    // const result = await getGasFee({
    //   chain_id: state.chainCurrent?.id,
    //   from: userAddress,
    //   to: toAddress,
    //   token_id: assertTokenID,
    //   amount: account,
    //   type: 2,
    // })
    // if (result.code === 200) {
    //   const fee = result?.data.split(' ')[0];
    //   const symbol = result?.data.split(' ')[1];
    //   for (let i = 0; i < state?.walletList?.length; i += 1) {
    //     if (symbol === state?.walletList[i]?.name) {
    //       if (state?.walletList[i]?.num && Number(state?.walletList[i]?.num) >= Number(fee)) {
    //         setAccount(assertNum.toString().substring(0, assertNum.toString().indexOf('.') + 10));
    //       } else {
    //         message.warning('No enough fee')
    //       }
    //     }
    //   }
    // }
  }

  const checkFee = (feeData: string) => {
    const fee = feeData.split(' ')[0];
    const symbol = feeData.split(' ')[1];
    const totalAmount = assetName === symbol ? Number(account) + Number(fee) : fee;
    for (let i = 0; i < state?.walletList?.length; i += 1) {
      if (symbol === state?.walletList[i]?.name) {
        if (state?.walletList[i]?.num && Number(state?.walletList[i]?.num) >= Number(totalAmount)) {
          setTip('');
          return true;
        } else {
          setTip(`Requires ${fee} ${symbol} remaining to provide Gas fee.`);
          return false;
        }
      }
    }
    return false
  }

  const submitConfirm = () => {
    if (loadingFlag || !tokenEnable || !haveContent) return
    if (!assetName) {
      message.warning('Please select Asset');
      return
    }
    if (!toAddress) {
      message.warning('Please enter to address');
      return
    }

    if (!account) {
      message.warning('please enter Amount');
      return
    }

    if (Number(account) > assertNum) {
      message.warning('No enough tokens');
      return
    }
    getFeeData();
  }

  useEffect(() => {
    if (account && account !== '0' && toAddress) {
      setHaveContent(true);
    } else {
      setHaveContent(false);
    }
  }, [account, toAddress])

  useEffect(() => {
    if (!chain_id) return
    if (checkPswType === 1) {
      getWalletList(chain_id)
    }

    if (checkPswType === 2) {
      getFeeData();
    }

    if (checkPswType === 3) {
      sedTransform();
    }
  }, [state.assetTriggerPsw, chain_id])

  useEffect(() => {
    eventbus.on('defaultChain', (value) => {
      setChainId(value);
    })
  }, [])

  function onSelectAsset() {
    if (!state.walletList.length) return
    showActionSheet({
      cancelText: 'Cancel',
      actions: state.walletList.map(e => ({ text: e.name, icon: e.icon, key: e.name, onClick: () => handelAssertSelect(e) }))
    })
  }

  return (
    <div>
      <Appbar className="b-b-1" title="Send" />
      <div className={styles['send-box']}>
        {/* asset */}
        <div className={styles['assets-box']}>
          <div className={styles.title}>Asset</div>
          <div ref={copenRef}
            onClick={onSelectAsset}
            className={[styles['default_chain'], assetsFlag ? styles.active : ''].join(' ')}>
            <div ref={chainListRef} className={styles['switch-button']} >
              { assertIcon && <img src={assertIcon} alt={''} /> }
            </div>
            <span>{assetName}</span>
            <div className={styles['care-box'] + ' active-bg'}>
              <img src={walletArrowImg} alt="" />
            </div>
          </div>
        </div>
        <div className={styles['account-box']}>
          <div className={styles.title}>To address</div>
          <div className={styles['account-input']}>
            <input value={toAddress} onChange={(e: any) => { setToAddress(e.target.value) }} type="text" />
            <span onClick={pasteAddress}>Paste</span>
          </div>
        </div>
        <div className={styles['account-box']}>
          <div className={styles.title}>Amount</div>
          <div className={styles['account-input']}>
            <input value={account} onBlur={spotFillZero} onChange={(e: any) => {
              let amount = clearNoNum(e.target.value)
              setAccount(amount)
            }} type="text" />
            <div className={styles['assert-name']}>{assetName}</div>
            <span onClick={setAllAmount}>{`All`}</span>
          </div>
          <div className={styles['show-text']}>
            <span>{ Number(account) <= assertNum ? `Available:` : `Not enough tokens` }</span>
            <span>{ Number(account) <= assertNum && `${retainDecimals(assertNum, 9)} ${assetName}` }</span>
          </div>
        </div>

        <wc-fill-remain />

        { tip && <div className={styles['fee-err-tip']}>{tip}</div> }
        <div className={styles['send-tip']}>
          The current network is <span>BNB Chain Network.</span>Please confirm that the address to send assets supports <span>BNB Chain Network.</span>You will <span>lose your assets</span> if the address is wrong or does not support the current blockchain.
        </div>
        <div onClick={submitConfirm} className={[styles['confirm-btn'], (tokenEnable && haveContent) ? styles.active : ''].join(' ')}>
          { loadingFlag ? <img src={buttonLoading} alt="" /> : <span>Confirm</span> }
        </div>
        {
          !tokenEnable
          &&
          <div className={styles['err-tip']}>
            Sending this token is temporarily not supported during the closed beta.
          </div>
        }
      </div>
    </div>
  )
}

export default Send;