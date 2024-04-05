import React, { useState, useContext, useEffect } from 'react';
// import { setWalletToken } from "@/units/index";
import { useLocation } from "react-router-dom";
import { message } from "antd";
import { useData, DataContext } from "@/reducer";
import { encrypt } from "@/units/jsencrypt";
import delMaskCloseImg from "@/assets/img/profile/photoAlbum/del-mask-close.svg";
import { sendEmailCode, checkEmail, checkEmailCode, forgotPassword } from "./service";
import { sessionStorageKey } from "../../service";
import ConfirmCreation from "./components/ConfirmCreation";
import styles from './index.module.less';

import checkMark from "@/assets/img/header/check-mark.svg";
import emailDelete from "@/assets/img/login/email-delete.svg";
import passwordOpen from "@/assets/img/wallet/password-open.svg";
import passwordClose from "@/assets/img/wallet/password-close.svg";
import walletCreating from "@/assets/wallets/wallet-creating.gif";
import createSuccessed from "@/assets/wallets/creat-successed.gif";
import createfailed from "@/assets/wallets/creat-failed.gif"
// import buttonLoading from "@/assets/img/login/button-loading.gif";

let timer: NodeJS.Timer | null = null;

interface ModalProps {
  title: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  [key: string]: any;
}

const ForgotPassword = (props: ModalProps) => {
  const state = useData();
  const { pathname } = useLocation();
  const { dispatch } = useContext<any>(DataContext);
  const { title = 'title', onCancel, onConfirm } = props;
  const [chain_id] = useState<number>(Number(sessionStorage.getItem(sessionStorageKey[0])));

  const [step, setStep] = useState<number>(1); // 1 验证邮箱 2 验证密码 3 成功动画

  // 验证邮箱
  const [emailFocus, setEmailFocus] = useState<boolean>(false);
  const [codeFocus, setCodeFocus] = useState<boolean>(false);
  const [emailValue, setEmailValue] = useState<string>('');
  const [emailVerify, setEmailVerify] = useState<number>(1); // 1 正常 2 验证正确 3 验证格式错误 4 与用户登录邮箱不匹配 
  const [code, setCode] = useState<number | string>('');
  const [codeVerify, setCodeVerify] = useState<number>(1);
  const [codeLoading, setCodeLoading] = useState<boolean>(false);
  const [count, changeCount] = useState(0);
  const [emailMatchFlag, setEmailMatchFlag] = useState<boolean>(false); // 邮箱是否通过 匹配本人邮箱验证

  // 验证密码
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
  const [passcodeFocus, setPasscodeFocus] = useState<boolean>(false);
  const reg1 = new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z]).+$/);
  const [pswVerify, setPswVerify] = useState<number>(1); // 1 正常 2 验证正确 3 验证错误
  const [pswValue, setpswValue] = useState<string>('');
  const [pswType, setPswType] = useState<boolean>(false);
  const [pswConfirmVerify, setPswConfirmVerify] = useState<number>(1); // 1 正常 2 验证正确 3 验证钱包导入错误
  const [pswConfirmValue, setpswConfirmValue] = useState<string>('');
  const [pswConfirmType, setPswConfirmType] = useState<boolean>(false);

  // 验证钱包导入
  const [ifSuccessed, setSuccessed] = useState<boolean>(false);
  const [ifWaitting, setWaitting] = useState<boolean>(true);

  // 二次弹窗
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);

  const handleClose = () => {
    dispatch({ type: 'changeForgotPasswordVisible', value: false })
  };
  const handleOnCancel = () => {
    onCancel && onCancel();
    setEmailFocus(false);
    setEmailValue('');
    setCode('');
    setCodeVerify(1)
    setCodeFocus(false);
    setPasswordFocus(false);
    setPasscodeFocus(false);
    setPswVerify(1);
    setpswValue('');
    setPswType(false);
    setPswConfirmVerify(1);
    setpswConfirmValue('');
    setPswConfirmType(false);
    setConfirmModalVisible(false);
    setStep(1);
    changeCount(0);
    handleClose();
  }
  const verifyEmail = (emailValue: string) => {
    let emailRegExp = /^[a-zA-Z0-9][a-zA-Z0-9_]{0,18}[a-zA-Z0-9]@([0-9a-zA-Z]+[-_]*[0-9a-zA-Z]+.)+[0-9a-zA-Z]{2,6}$/; // 验证邮箱的正则表达式
    if (!emailRegExp.test(emailValue)) {
      return false
    } else {
      return true
    }
  }
  const verifyCode = (code: number | string) => {
    if (code) {
      return true;
    } else {
      return false;
    }
  }
  const handleOnConfirm = () => {
    dispatch({ type: 'changeAssetTriggerPsw', value: state.assetTriggerPsw + 1 })
    onConfirm && onConfirm();
    handleOnCancel();
  }
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyCode = event.keyCode || event.which || event.charCode;
    if (keyCode === 13) {
      if (step === 1) {
        confirmEmail();
      } else if (step === 2) {
        if (enterEmpty()) {
          pswConfirm()
        }
      }
    }
  }
  const onGetCaptcha = async () => {
    if (codeLoading) return
    if (!verifyEmail(emailValue)) {
      message.warning('Please enter email');
      setEmailVerify(3);
    } else if (!emailMatchFlag) {
      message.warning('Email does not match');
    } else {
      setEmailVerify(2);
      try {
        setCodeLoading(true);
        const result = await sendEmailCode({ email: emailValue });
        setCodeLoading(false);
        if (result?.code === 200) {
          message.success('Sending succeeded')
          setCodeVerify(1);
          changeCount(59);
        } else if (result?.code === 1019) {
          setCodeVerify(3)
        }
      } catch (err) {
        console.log('err', err);
      }
    }
  }
  const confirmEmail = async () => {
    if (emailValue === '') {
      message.warning('Please enter email')
      return
    }
    if (code === '') {
      message.warning('Please enter verification code');
      return
    }
    let count = 0;
    if (!verifyEmail(emailValue)) { // 验证email
      setEmailVerify(3);
    } else if (!emailMatchFlag) {
      message.warning('Email does not match')
    } else {
      setEmailVerify(2);
      count++
    }
    if (!verifyCode(code)) { // 验证密码
      setCodeVerify(3);
    } else {
      setCodeVerify(2);
      count++
    }
    if (count !== 2) {
      return
    }
    try {
      const result = await checkEmailCode({ chain_id, email: emailValue, code })
      if (result?.code === 200) {
        setStep(2);
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 验证密码
  const verifyPassWord = (pws: string, confire: string) => {
    if (pws.length < 6) {
      setPswVerify(3);
      return false
    } else if (!reg1.test(pws)) {
      setPswVerify(2);
      return false
    } else {
      setPswVerify(1)
    }
    if (confire !== '' && confire !== pws) {
      setPswConfirmVerify(3);
      return false
    } else {
      setPswConfirmVerify(1);
      return true
    }
  }

  const enterEmpty = () => {
    if (pswValue === '' || pswConfirmValue === '') {
      return false
    } else {
      return true
    }
  }

  // 验证密码
  const pswConfirm = async () => {
    if (pswValue.length < 6) {
      message.warning('The password must be at least 6 characters long.');
      return
    }
    if (pswValue !== pswConfirmValue) {
      message.warning('The passwords entered twice are inconsistent');
      return
    }
    if (!verifyPassWord(pswValue, pswConfirmValue)) {
      return;
    }
    setConfirmModalVisible(true);
  }

  const getResult = (result: boolean) => {
    if (result) {
      setSuccessed(true)
    } else {
      setSuccessed(false)
    }
    setWaitting(false)

    setTimeout(() => {
      handleOnConfirm();
    }, 2000)
  }

  // 重置密码
  const startResetPsw = async () => {
    try {
      const result = await forgotPassword({ chain_id, password: encrypt(pswValue), email: emailValue, code });
      setConfirmModalVisible(false);
      setStep(3)
      if (result?.code === 200) {
        setTimeout(() => { getResult(true) }, 1000);
      } else {
        setTimeout(() => { getResult(false) }, 1000);
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (count === 59) {
      timer = setInterval(() => {
        changeCount((preCount) => preCount - 1);
      }, 1000);
    } else if (count === 0) {
      clearInterval(Number(timer));
    }
  }, [count]);

  if (!state.forgotPasswordVisible || pathname === '/login') {
    return <></>;
  }

  return (
    <div className={[styles['modal'], styles['forgot-password-box']].join(' ')}>
      <div className={styles.mask}>
        <div onClick={(e) => e.stopPropagation()} className={'forgot-password-modal-box'}>
          <img onClick={handleOnCancel} className={styles['close-icon']} src={delMaskCloseImg} alt="" />
          <div className={styles['title']}>{title}</div>
          {
            step !== 3
            &&
            <div className={styles['sub-title']}>Step{step}/2: {step === 1 ? 'Verify your email' : 'Reset password'}</div>
          }
          {/* 验证邮箱 */}
          {
            step === 1
            &&
            <div className={styles['login-form']}>
              <div className={[styles['login-form-input-box'], emailFocus ? styles.correct : '', (emailVerify === 3 || emailVerify === 4) ? styles.error : ''].join(' ')}>
                <div className={[styles['form-title'], (emailVerify === 3 || emailVerify === 4) ? styles.error : ''].join(' ')}>
                  Email
                </div>
                <input onChange={(e) => { setEmailValue(e.target.value); }}
                  value={emailValue}
                  onBlur={async () => {
                    setEmailFocus(false)
                    if (!verifyEmail(emailValue)) {
                      setEmailVerify(3);
                    } else {
                      const result = await checkEmail({ email: emailValue });
                      if (result?.code === 200) {
                        setEmailVerify(2);
                        setEmailMatchFlag(true);
                      } else if (result?.code === 2010) {
                        setEmailMatchFlag(false);
                        setEmailVerify(4)
                      }
                    }
                  }}
                  onFocus={() => {
                    setEmailFocus(true)
                  }}
                  className={styles['login-form-input']}
                  type="text"
                  placeholder="Email address" />
                {
                  (emailVerify === 3 || emailVerify === 4)
                  &&
                  <div className={styles['error-tip']}> {emailVerify === 3 ? 'Incorrect email format' : 'Email does not match'} </div>
                }
                {
                  emailVerify === 2
                  &&
                  <div className={styles['email-correct']}>
                    {
                      <img src={checkMark} alt={''} />
                    }
                  </div>
                }
                {
                  (emailVerify === 3 || emailVerify === 4)
                  &&
                  <div className={styles['email-correct']} onClick={() => { setEmailVerify(1); setEmailValue('') }}>
                    {
                      <img src={emailDelete} alt={''} />
                    }
                  </div>
                }
              </div>

              <div className={[styles['login-form-input-box'], codeFocus ? styles.correct : '', codeVerify === 3 ? styles.error : ''].join(' ')}>
                <div className={[styles['form-title'], codeVerify === 3 ? styles.error : ''].join(' ')}>
                  Verification code
                </div>
                <input
                  value={code}
                  onChange={(e) => {
                    let tempValue = e.target.value;
                    if (tempValue.length > 6) {
                      tempValue = tempValue.slice(0, 6)
                    }
                    setCode(tempValue);
                  }}
                  onBlur={() => {
                    setCodeFocus(false)
                  }}
                  onFocus={() => {
                    setCodeFocus(true)
                  }}
                  className={styles['login-form-input']}
                  type="text"
                  placeholder="Email verification code"
                  onKeyDown={(e) => { onKeyDown(e) }}
                />
                <div className={styles['send-code-btn']}>
                  {
                    count
                      ?
                      <span>{count}秒</span>
                      :
                      <span onClick={onGetCaptcha}>Send Code</span>
                  }
                </div>
              </div>
            </div>
          }

          {
            step === 2
            &&
            <div className={styles['login-form']}>
              <div className={[styles['password-form-input-box'], passwordFocus ? styles.correct : '', pswVerify === 3 ? styles.error : ''].join(' ')}>
                <div className={[styles['form-title'], pswVerify === 3 ? styles.error : ''].join(' ')}>
                  Set a new wallet password
                </div>
                <input
                  onChange={(e) => {
                    let tempValue = e.target.value;
                    setpswValue(tempValue);
                    if ((tempValue.length >= 6)) {
                      verifyPassWord(tempValue, '')
                    }
                  }}
                  value={pswValue}
                  onBlur={() => {
                    setPasswordFocus(false)
                    verifyPassWord(pswValue, pswConfirmValue)
                  }
                  }
                  onFocus={() => { setPasswordFocus(true) }}
                  className={styles['password-form-input']}
                  type={pswType ? 'text' : 'password'}
                  placeholder="Enter password"
                />
                <img onClick={() => { setPswType(!pswType) }} className={styles['psw-type-img']} src={pswType ? passwordOpen : passwordClose} alt="" />
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
                  Confirm your password
                </div>
                <input
                  onChange={(e) => {
                    let tempValue = e.target.value;
                    setpswConfirmValue(tempValue);
                    if ((tempValue.length >= pswValue.length)) {
                      verifyPassWord(pswValue, tempValue)
                    }
                  }}
                  value={pswConfirmValue}
                  onBlur={() => {
                    setPasscodeFocus(false)
                    verifyPassWord(pswValue, pswConfirmValue)
                  }}
                  onFocus={() => {
                    setPasscodeFocus(true)
                  }}
                  className={styles['password-form-input']}
                  type={pswConfirmType ? 'text' : 'password'}
                  placeholder="Confirm your passcode"
                />
                <img onClick={() => { setPswConfirmType(!pswConfirmType) }} className={styles['psw-type-img']} src={pswConfirmType ? passwordOpen : passwordClose} alt="" />
                {
                  pswConfirmVerify === 3
                  &&
                  <div className={styles['error-tip']}>The two entered passwords do not match.</div>
                }
              </div>
            </div>
          }

          {
            step === 3
            &&
            <div className={styles['create-body3']}>
              <div className={styles['create-content']}>
                <span>Grown is restoring wallet account for you.</span>
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
            step !== 3
            &&
            <div className={[styles['enter-btn'], styles.active].join(' ')} onClick={() => {
              if (step === 1) {
                confirmEmail();
              } else {
                if (enterEmpty()) {
                  pswConfirm()
                }
              }
            }}>Submit</div>
          }
        </div>
      </div>
      <ConfirmCreation onConfirm={startResetPsw} maskVisible={confirmModalVisible} setMaskVisible={setConfirmModalVisible} />
    </div>
  )
}

export default ForgotPassword;
