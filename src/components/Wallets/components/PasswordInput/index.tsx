import React, { useState, useEffect } from "react";
import { message } from "antd";
import passwordOpen from "@/assets/img/wallet/password-open.svg";
import passwordClose from "@/assets/img/wallet/password-close.svg";
import styles from './index.module.less';

export type PasswordInputProps = {
  confirmPassword: (value: string) => void;
}

const PasswordInput = (props: PasswordInputProps) => {
  const { confirmPassword } = props;

  const [pswValue, setpswValue] = useState<string>('');
  const [pswType, setPswType] = useState<boolean>(false);
  const [pswVerify, setPswVerify] = useState<number>(1); // 1 正常 2 验证正确 3 验证错误

  const [pswConfirmValue, setpswConfirmValue] = useState<string>('');
  const [pswConfirmType, setPswConfirmType] = useState<boolean>(false);
  const [pswConfirmVerify, setPswConfirmVerify] = useState<number>(1); // 1 正常 2 验证正确 3 验证错误

  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
  const [passcodeFocus, setPasscodeFocus] = useState<boolean>(false);
  const reg1 = new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z]).+$/);

  const enterEmpty=()=>{
    if(pswValue===''||pswConfirmValue===''){
      return false
    }else {
      return true
    }
  }

  const verifyPassWord=(pws:string,confire:string)=>{
    if (pws.length<6) {
      setPswVerify(3);
      return false
    } else if(!reg1.test(pws)) {
      setPswVerify(2);
      return false
    }else {
      setPswVerify(1)
    }
    if (confire!==''&&confire!==pws) {
      setPswConfirmVerify(3);
      return false
    }else {
      setPswConfirmVerify(1);
      return true
    }
  }


  const pswConfirm = () => {
    if (pswValue.length < 6) {
      message.warning('The password must be at least 6 characters long.');
      return
    }
    if (pswValue !== pswConfirmValue) {
      message.warning('The passwords entered twice are inconsistent');
      return
    }
    if(!verifyPassWord(pswValue,pswConfirmValue)){
      return;
    }
    confirmPassword(pswValue);
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const keyCode = event.keyCode || event.which || event.charCode;
    if (keyCode === 13) {
      pswConfirm();
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    };
  }, [pswValue, pswConfirmValue]);

  return (
      <div>
        <div className={styles['password-form']}>
          <div className={styles['password-form-placeholder']}>
            For the first time, You need to set up a wallet password
          </div>
          <div className={[styles['password-form-input-box'], passwordFocus ? styles.correct : '', pswVerify === 3 ? styles.error : ''].join(' ')}>
            <div className={[styles['form-title'], pswVerify === 3 ? styles.error : ''].join(' ')}>
              Create your wallet password
            </div>
            <input
                onChange={(e) => {
                  let tempValue = e.target.value;
                  setpswValue(tempValue);
                  if ((tempValue.length >=6)) {
                    verifyPassWord(tempValue,'')
                  }
                }}
                value={pswValue}
                onBlur={() => {
                  setPasswordFocus(false)
                  verifyPassWord(pswValue,pswConfirmValue)
                }
                }
                onFocus={()=>{setPasswordFocus(true)}}
                className={styles['password-form-input']}
                type={pswType ? 'text' : 'password'}
                placeholder="Enter password"
            />
            <img onClick={() => {setPswType(!pswType)}} className={styles['psw-type-img']} src={pswType ? passwordOpen : passwordClose} alt=""/>
            {
                pswVerify === 2
                &&
                <div className={styles['error-tip']}>Password contains at least Letters and numbers.</div>
            }
            {
                pswVerify === 3
                &&
                <div className={styles['error-tip']}>The password must be at least 6 characters long.</div>
            }
          </div>

          <div className={[styles['password-form-input-box'], passcodeFocus ? styles.correct : '', pswConfirmVerify === 3 ? styles.error : ''].join(' ')}>
            <div className={[styles['form-title'], pswConfirmVerify === 3 ? styles.error : ''].join(' ')}>
              Confirm your passcode
            </div>
            <input
                onChange={(e) => {
                  let tempValue = e.target.value;
                  setpswConfirmValue(tempValue);
                  if ((tempValue.length >= pswValue.length)) {
                    verifyPassWord(pswValue,tempValue)
                  }
                }}
                value={pswConfirmValue}
                onBlur={() => {
                  setPasscodeFocus(false)
                  verifyPassWord(pswValue,pswConfirmValue)
                }}
                onFocus={()=>{
                  setPasscodeFocus(true)
                }}
                className={styles['password-form-input']}
                type={pswConfirmType ? 'text' : 'password'}
                placeholder="Confirm your passcode"
            />
            <img onClick={() => {setPswConfirmType(!pswConfirmType)}} className={styles['psw-type-img']} src={pswConfirmType ? passwordOpen : passwordClose} alt=""/>
            {
                pswConfirmVerify === 3
                &&
                <div className={styles['error-tip']}>The two entered passwords do not match.</div>
            }
          </div>
          <div onClick={()=>{
            if(enterEmpty()){
              pswConfirm()
            }
          }} className={[styles['password-btn'], enterEmpty() ? styles.active : ''].join(' ')}>
            <span>Submit</span>
          </div>
        </div>
      </div>
  )
}

export default PasswordInput;