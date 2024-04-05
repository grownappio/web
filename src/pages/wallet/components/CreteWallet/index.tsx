import React, { useState } from "react";
import { encrypt } from "@/units/jsencrypt";
import PasswordInput from "../PasswordInput";
import closeBtn from "@/assets/img/header/close-btn.svg";
import walletCreating from "@/assets/wallets/wallet-creating.gif"
import createSuccessed from "@/assets/wallets/creat-successed.gif"
import createfailed from "@/assets/wallets/creat-failed.gif"
import styles from "./index.module.less";
import { creatWallet } from "../../service";
import { delay } from "@/units";

type walletCreateProps = {
  onCancel?: () => void;
  onSuccess?: () => void;
  chainId: number
}

const WalletCreate = (props: walletCreateProps) => {
  const { onCancel, onSuccess, chainId } = props;

  const [step, setStep] = useState<'create' | 'confirming' | 'creating' | 'completed'>('create');
  const [psw, setPsw] = useState('');
  const [successed, setSuccessed] = useState<boolean>(false);

  const confirmPassword = (psw: string) => {
    setPsw(psw)
    setStep('confirming')
  }

  const confireCreatWallet = async () => {
    setStep('creating')
    try {
      await Promise.all([creatWallet({ chain_id: chainId, password: encrypt(psw) }), delay(2000)])
      setSuccessed(true)
      setTimeout(() => onSuccess?.(), 1200)
    } catch (e) {

    }
    setStep('completed')
  }

  return (
    <div className={styles['create-wallet-box'] + ' px-24'}>
      <div>
        {
          (step === 'create' || step === 'confirming' || step === 'completed')
          &&
          <img className="w-28 h-28 absolute top-12 right-12" onClick={onCancel} src={closeBtn} alt="" />
        }
        <div className='mt-32 text-16 text-center font-[600]'>
          Create Wallet
        </div>
      </div>
      
      {
        // https://www.figma.com/file/tGSKt3fQodWNiVlKYpLjBH/Grown-%E6%89%8B%E6%9C%BA%E7%AB%AFH5%E9%80%82%E9%85%8D-%E5%AF%B9%E6%8E%A5?node-id=382%3A4326&mode=dev
        step === 'create'
        &&
        <PasswordInput confirmPassword={confirmPassword} />
      }
      {
        // https://www.figma.com/file/tGSKt3fQodWNiVlKYpLjBH/Grown-%E6%89%8B%E6%9C%BA%E7%AB%AFH5%E9%80%82%E9%85%8D-%E5%AF%B9%E6%8E%A5?node-id=382%3A6655&mode=dev
        step === 'confirming'
        &&
        <div className="mt-24 mb-40">
          <div className="mb-32 px-10 text-center opacity-80">The password is very important to protect assets, please ensure that it is properly kept and memorized before submitting.</div>
          <button className="btn-primary w-full text-16 font-[600] mb-16 py-14" onClick={confireCreatWallet}>Confirm</button>
          <button className="btn-outline w-full text-16 font-[600] bg-transparent py-14" onClick={() => setStep('create')}>Cancel</button>
        </div>
      }
      {
        // https://www.figma.com/file/tGSKt3fQodWNiVlKYpLjBH/Grown-%E6%89%8B%E6%9C%BA%E7%AB%AFH5%E9%80%82%E9%85%8D-%E5%AF%B9%E6%8E%A5?node-id=382%3A6822&mode=dev
        step === 'creating'
        &&
        <div className="mt-24 mb-24 text-center">
          <div className="mb-16 h-61 opacity-80">GrowN is creating a blockchain wallet account for you. You can use your wallet account to deposit and withdraw tokens in GrowN.</div>
          <img className="w-144 h-144" src={walletCreating} alt='' />
        </div>
      }
      {
        // https://www.figma.com/file/tGSKt3fQodWNiVlKYpLjBH/Grown-%E6%89%8B%E6%9C%BA%E7%AB%AFH5%E9%80%82%E9%85%8D-%E5%AF%B9%E6%8E%A5?node-id=382%3A7138&mode=dev
        step === 'completed'
        &&
        <div className="mt-24 mb-24 text-center">
          <div className="mb-16 h-61 text-16 opacity-80">Wallet created successfully</div>
          <img className="w-144 h-144" src={successed ? createSuccessed : createfailed} alt={''} />
        </div>
      }
    </div>
  )
}

export default WalletCreate;