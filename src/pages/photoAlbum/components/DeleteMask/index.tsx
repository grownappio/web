import React, { useState, useEffect } from "react";
import delMaskCloseImg from "@/assets/img/profile/photoAlbum/del-mask-close.svg";
import styles from './index.module.less';

export type DeleteMaskProps = {
  delMaskFlag: boolean;
  setDelMaskFlag: (value: boolean) => void;
  delImg: () => void;
}

const DeleteMask = (props: DeleteMaskProps) => {
  const { delMaskFlag, setDelMaskFlag, delImg } = props;
  const [delVisible, setDelVisible] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setDelVisible(delMaskFlag)
    }, 100);
  }, [delMaskFlag])
  return (
    <>
      {
        delMaskFlag
        &&
        <div className={styles['del-mask']} onClick={() => {
          setDelMaskFlag(false);
        }}>
          <div onClick={(e) => {
            e.stopPropagation();
          }} className={[styles['del-mask-box'], delVisible ? styles.show : styles.hide].join(' ')}>
            <img className={styles['del-img']} onClick={() => {
              setDelMaskFlag(false);
            }} src={delMaskCloseImg} alt="" />
            <div className={styles.title}>Delete photo?</div>
            <div className={styles.tip}>Do you want to delete this photo?</div>
            <div className={styles.btns}>
              <div onClick={() => {
                setDelMaskFlag(false);
              }} className={styles.option}>Cancel</div>
              <div onClick={() => {
                delImg();
              }} className={styles.option}>Delete</div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default DeleteMask;