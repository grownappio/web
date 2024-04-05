import React, { useState } from "react";
import styles from './index.module.less';
interface PropsDropDownBtn {
  btnList: any[];
  btnClick?: (value: string) => void;
}

const DropdownBtn = (props: PropsDropDownBtn) => {
  const { btnList, btnClick } = props;
  const [hoverKey, setHoverKey] = useState<string>('');
  return (
    <div className={styles['drop-down-btn-list']}>
      {
        btnList.map((item) => {
          return (
            <div key={item.key} onMouseEnter={() => {
              setHoverKey(item.key);
            }} onMouseLeave={() => {
              setHoverKey('');
            }} onClick={() => {
              btnClick && btnClick(item.key);
            }} className={styles['btn-option']}>
              <img src={hoverKey === item.key ? item.iconHover : item.icon} alt="" />
              <span>{item.name}</span>
            </div>
          )
        })
      }
    </div>
  )
}

export default DropdownBtn;