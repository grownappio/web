import React from "react";
import close from "@/assets/img/close.png"

import styles from "./index.module.less";

export type PropsReconfirm = {
  leaveVisable: boolean;
  title?: string;
  content: string;
  setisleaveVisable: (value: boolean) => void;
  onOk: () => void;
}

const ReconfirmModal = (props: PropsReconfirm) => {
  const { leaveVisable, setisleaveVisable, onOk, title = '提示', content } = props;
  return (
    <>
      {
        leaveVisable
        &&
        <div className={styles['popup-window-cover']} onClick={(event) => {
          event.preventDefault();
          if (event.target === event.currentTarget) {
            setisleaveVisable(false)
          }
        }}>
          <div className={styles['popup-window']}>
            <div className={styles['leave-box']}>
              <img className={styles['leave-close']}
                onClick={() => { setisleaveVisable(false) }}
                src={close} alt="Load failed!" />
            </div>
            <div className={styles['popup-box']}>
              <div className={styles['title']}>{title}</div>
              <div className={styles.content}>{content}</div>
              <div className={styles['button-box']} >
                <div className={styles['button-cancel']}
                  onClick={() => { setisleaveVisable(false) }}>
                  <span>{'Cancel'}</span>
                </div>
                <div className={styles['button-continue']}
                  onClick={onOk} >
                  <span>{'Continue'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default ReconfirmModal;