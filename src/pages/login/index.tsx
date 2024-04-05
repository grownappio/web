import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { message } from "antd";
import { useHistory } from "react-router-dom";
import { useAliveController } from 'react-activation';
import { setToken } from "@/units/index";
import { DataContext } from '@/reducer/index';
import styles from './index.module.less';
import buttonLoading from "@/assets/img/login/button-loading.gif";
import headerIcon from "@/assets/img/header/company-icon.png";
import checkMark from "@/assets/img/header/check-mark.svg";
import emailDelete from "@/assets/img/login/email-delete.svg";
import { sendEmailCode, emailLogin } from "./service";

let timer: NodeJS.Timer | null = null;
const Login = () => {
  const { clear } = useAliveController();
  const history = useHistory();
  const { dispatch } = useContext<any>(DataContext);
  const [count, changeCount] = useState(0);
  const [loadingFlag, setLoadingFlag] = useState<boolean>(false);
  const [emailFocus, setEmailFocus] = useState<boolean>(false);
  const [codeFocus, setCodeFocus] = useState<boolean>(false);


  const [emailValue, setEmailValue] = useState<string>('');
  const [emailVerify, setEmailVerify] = useState<number>(1); // 1 正常 2 验证正确 3 验证错误

  const [code, setCode] = useState<number | string>('');
  const [codeVerify, setCodeVerify] = useState<number>(1);
  const [codeLoading, setCodeLoading] = useState<boolean>(false);

  const onGetCaptcha = async () => {
    if (codeLoading) return
    if (!verifyEmail(emailValue)) {
      message.warning('Please enter email')
      setEmailVerify(3);
    } else {
      setEmailVerify(2);
      try {
        setCodeLoading(true);
        const result = await sendEmailCode({ email: emailValue });
        setCodeLoading(false);
        if (result?.code === 200) {
          message.success('Sending succeeded');
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

  const verifyEmail = (emailValue: string) => {
    let emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // 验证邮箱的正则表达式
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

  const loginConfirm = async () => {
    if (loadingFlag) return
    if (emailValue === '') {
      message.warning('Please enter email')
      return
    }
    if (code === '') {
      message.warning('Please enter verification code')
      return
    }
    let count = 0;
    if (!verifyEmail(emailValue)) {
      setEmailVerify(3);
    } else {
      setEmailVerify(2);
      count++
    }
    if (!verifyCode(code)) {
      setCodeVerify(3);
    } else {
      setCodeVerify(2);
      count++
    }
    if (count !== 2) {
      return
    }
    setLoadingFlag(true);
    try {
      const result = await emailLogin({ email: emailValue, code });
      setLoadingFlag(false);
      if (result?.code === 200) {
        setToken(result?.data?.token);
        clear();
        dispatch({
          type: 'changeIsLoging', value: true
        });
        setTimeout(() => {
          const returnUrl = sessionStorage.getItem('returnUrl') || '';
          if (returnUrl) {
            sessionStorage.removeItem('returnUrl');
            history.replace(returnUrl.split('#')[1])
          } else {
            history.replace('/grow');
          }
        }, (100));
      }
    } catch (err) {
      setLoadingFlag(false);
    }
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyCode = event.keyCode || event.which || event.charCode;
    if (keyCode === 13) {
      loginConfirm();
    }
  }

  useLayoutEffect(() => {
    return () => {
      clearInterval(Number(timer));
    };
  }, []);
  useEffect(() => {
    if (count === 59) {
      timer = setInterval(() => {
        changeCount((preCount) => preCount - 1);
      }, 1000);
    } else if (count === 0) {
      clearInterval(Number(timer));
    }
  }, [count]);

  useEffect(() => {
    dispatch({
      type: 'changeIsLoging', value: false
    });
  }, [])



  return (
    <div className={styles.login}>
      <div className={styles['login-box']}  >
        <div className={styles['login-body']}>
          <div className={styles['header-icon']}>
            <img src={headerIcon} alt="" />
            <div className={styles['version-tip']}>Alpha</div>
          </div>
          <div className={styles['login-sub-title']}>
            Earn in a growing social network.
          </div>
          <div className={styles['login-form']}>
            <div className={[styles['login-form-input-box'], emailFocus ? styles.correct : '', emailVerify === 3 ? styles.error : ''].join(' ')}>
              <div className={[styles['form-title'], emailVerify === 3 ? styles.error : ''].join(' ')}>
                Email
              </div>
              <input onChange={(e) => { setEmailValue(e.target.value); }}
                value={emailValue}
                onBlur={() => {
                  setEmailFocus(false)
                  if (!verifyEmail(emailValue)) {
                    setEmailVerify(3);
                  } else {
                    setEmailVerify(2);
                  }
                }}
                onFocus={() => {
                  setEmailFocus(true)
                }}
                className={styles['login-form-input']}
                type="text"
                placeholder="Email address" />
              {
                emailVerify === 3
                &&
                <div className={styles['error-tip']}>Incorrect email format</div>
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
                emailVerify === 3
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
              {
                codeVerify === 3
                &&
                <div className={styles['error-tip']}>
                  Your email address is not in Grown's internal test whitelist. Please follow <span onClick={() => { window.open('https://twitter.com/grown_app') }}>Twitter @grown_app</span>, we will continue to open new internal test places.
                </div>
              }
              <div className={styles['send-code-btn']}>
                {
                  count
                    ?
                    <span>{count}s</span>
                    :
                    <span onClick={onGetCaptcha}>Send Code</span>
                }
              </div>
            </div>
          </div>
        </div>
        <div className={styles['login-bottom']}>
          <div onClick={loginConfirm} className={styles['login-btn']}>
            {
              loadingFlag
                ?
                <img src={buttonLoading} alt="" />
                :
                <span>Sign In / Sign Up</span>
            }
          </div>
          <div className={styles['login-desc']}>
            Click "Sign In/Sign Up" to agree to our <ins className={styles.sign} >Terms of Service</ins> and acknowledge that Grown's <ins className={styles.sign}>Privacy Policy</ins> applies to you.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;