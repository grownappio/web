import React, { useState, useEffect } from "react";
import delMaskCloseImg from "@/assets/img/profile/photoAlbum/del-mask-close.svg";
import styles from './index.module.less';

export type DeleteMaskProps = {
  maskFlag: boolean;
  confirmText?: string;
  cancelText?: string;
  title?: string;
  tip?: string;
  setMaskFlag: (value: boolean) => void;
  onOk?: () => void;
  handCancel?: () => void;
}

const DeleteMask = (props: DeleteMaskProps) => {
  const { maskFlag, setMaskFlag, onOk, handCancel, cancelText = 'Cancel', confirmText = 'Delete', title = 'prompt', tip = 'Do you want to delete this photo?' } = props;
  const [maskVisible, setMaskVisible] = useState<boolean>(false);
  const cancel = () => {
    setMaskFlag(false);
    handCancel && handCancel();
  }
  useEffect(() => {
    setTimeout(() => {
      setMaskVisible(maskFlag)
    }, 100);
  }, [maskFlag])
  return (
    <>
      {
        maskFlag
        &&
        <div className={styles['del-mask']} onClick={() => {
          setMaskFlag(false);
        }}>
          <div onClick={(e) => {
            e.stopPropagation();
          }} className={[styles['del-mask-box'], maskVisible ? styles.show : styles.hide].join(' ')}>
            <img className={styles['del-img']} onClick={() => {
              setMaskFlag(false);
            }} src={delMaskCloseImg} alt="" />
            <div className={styles.title}>{title}</div>
            <div className={styles.tip}>{tip}</div>
            <div className={styles.btns}>
              <div onClick={cancel} className={styles.option}>{cancelText}</div>
              <div onClick={() => {
                onOk && onOk();
              }} className={styles.option}>{confirmText}</div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default DeleteMask;