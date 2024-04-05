import React, { useState } from "react";
import PasswordInput from "../PasswordInput";
import closeBtn from "@/assets/img/header/close-btn.svg";
import closeBtnHover from "@/assets/img/header/close-btn-hover.svg";
import walletCreating from "@/assets/wallets/wallet-creating.gif"
import createSuccessed from "@/assets/wallets/creat-successed.gif"
import createfailed from "@/assets/wallets/creat-failed.gif"
import styles from "./index.module.less";
import {creatWallet} from "../../service";
import {encrypt} from "@/units/jsencrypt";

type walletCreateProps = {
  closeWalletCreate?: () => void;
  callResult?: (last: boolean) => void;
  chainId: number
}

const WalletCreate = (props: walletCreateProps) => {
  const { closeWalletCreate, callResult, chainId } = props;

  const [createStep, setCreateStep] = useState<number>(1);
  // const [params] = useState<any>(getUrlHashParam());
  const [psw, setPsw] = useState<string>();
  const [returnFlag, setReturnFlag] = useState<boolean>(false);

  const [ifTipsMask, setTipsMask] = useState<boolean>(false);

  const [ifSuccessed, setSuccessed] = useState<boolean>(false);
  const [ifWaitting, setWaitting] = useState<boolean>(true);

  const confirmPassword = (psw: string) => {
    setPsw(psw)
    setTipsMask(true)
  }

  const confireCreatWallet = async () => {
    if (psw) {
      setTipsMask(false)
      setCreateStep(2)
      const timeBefore = new Date().getTime()
      setWaitting(false)
      const result = await creatWallet({
        chain_id: chainId,
        password: encrypt(psw),
      })
      if (result.code === 200) {
        setSuccessed(true)
        const timeAfter = new Date().getTime()
        const gap = 5000 - (timeAfter - timeBefore)
        if (gap > 0) {
          setTimeout(() => {
            setCreateStep(3)
            if (result.code === 200) {
              setTimeout(() => { getResult(true) }, 1000)
            } else {
              setTimeout(() => { getResult(false) }, 1000)
            }
          }, (gap))
        } else {
          setCreateStep(3)
          if (result.code === 200) {
            setTimeout(() => { getResult(true) }, 1000)
          } else {
            setTimeout(() => { getResult(false) }, 1000)
          }
        }
      }
    }
  }

  const getResult = (result: boolean) => {
    if (result) {
      callResult?.(true)
    } else {
      callResult?.(false)
    }
    setWaitting(true)

    setTimeout(() => {
      // setCreateStep(1)
      returnPage()
    }, 2000)
  }

  const returnPage = () => {
    if (closeWalletCreate) {
      closeWalletCreate()
    }
  }

  return (
      <div className={styles['create-wallet-box']}>
        <div className={styles['create-wallet-header']}>
          {
              createStep === 1
              &&
              <img
                  onClick={() => {
                    returnPage();
                  }}
                  onMouseEnter={() => {
                    setReturnFlag(true)
                  }}
                  onMouseLeave={() => {
                    setReturnFlag(false)
                  }}
                  src={returnFlag ? closeBtnHover : closeBtn} alt="" />
          }
          <div className={styles['create-wallet-title']}>
            Create Wallet
          </div>
        </div>

        {
            createStep === 1
            &&
            <PasswordInput confirmPassword={confirmPassword} />
        }
        {
            createStep === 2
            &&
            <div className={styles['create-body2']}>
              <div className={styles['create-content']}>
                <span>Grown is creating a blockchain wallet account</span>
                <span>for you. You can use your wallet account to</span>
                <span>deposit and withdraw tokens in Grown.</span>
              </div>
              <div className={styles['create-status']}>
                <img src={walletCreating} alt={''} />
              </div>
            </div>
        }
        {
            createStep === 3
            &&
            <div className={styles['create-body3']}>
              <div className={styles['create-content']}>
                <span>Wallet created successfully</span>
              </div>
              <div className={styles['create-status']}>
                {
                  ifWaitting ?
                      <img src={walletCreating} alt={''} />
                      :
                      <img src={ifSuccessed ? createSuccessed : createfailed} alt={''} />
                }
              </div>
            </div>
        }
        {
            ifTipsMask &&
            <div className={styles['tips-mask']}>
              <div className={styles['tips-body']}>
                <div className={styles['tips-confirm']}>
                  <div className={styles['content']}>
                    The password is very important to protect assets, please ensure that it is properly kept and memorized before submitting.
                  </div>
                  <div className={styles['button']}>
                    <div className={styles['cancel']}
                         onClick={() => { setTipsMask(false) }}>Cancel</div>
                    <div className={styles['confirm']}
                         onClick={async () => { await confireCreatWallet() }}>Confirm</div>
                  </div>
                </div>
              </div>
            </div>
        }
      </div>
  )
}

export default WalletCreate;