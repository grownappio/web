import React from 'react';
import styles from './index.module.less';
import delMaskCloseImg from "@/assets/img/profile/photoAlbum/del-mask-close.svg";

interface ModalProps {
  maskVisible: boolean;
  setMaskVisible: (value: boolean) => void;
  onConfirm?: () => void;
  [key: string]: any;
}

const ForgotPassword = (props: ModalProps) => {
  const {setMaskVisible, onConfirm, maskVisible } = props;

  if (!maskVisible) {
    return <></>;
  }

  return (
    <div className={[styles['modal'], styles['confirm-creation']].join(' ')}>
      <div className={styles.mask}>
        <div onClick={(e) => e.stopPropagation()} className={'modal-box'}>
          <img onClick={() => {
            setMaskVisible(false)
          }} className={styles['close-icon']} src={delMaskCloseImg} alt="" />
          <div className={styles['title']}>Confirm creation?</div>
          <div className={styles['tip-content']}>
            <div>The password is very important to protect </div>
            <div>assets, please ensure that it is properly kept </div>
            <div>and memorized before submitting. </div>
          </div>

          <div className={styles['footer']}>
            <div className={styles['action-btn']}>
              <button onClick={() => {
                setMaskVisible(false);
              }}>Cancel</button>
              <button onClick={onConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword;
