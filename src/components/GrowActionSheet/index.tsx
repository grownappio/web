import React, { useEffect, useState } from "react";
import { Popup } from 'antd-mobile';

export type TypeAction = {
  key: string;
  name: JSX.Element | string;
  icon?: any;
  hide?: boolean | (() => boolean);
  onClick?: (e: TypeAction) => void
}

interface PropGrowActionSheet {
  popupVisible?: boolean;
  minHeight?: string;
  actionList: TypeAction[];
  showCancal?: boolean;
  onClose?: () => void;
  actionConfirm?: (value: string) => void;
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

const exec = <T,>(e: T | (() => T)) => e instanceof Function ? e() : e

const GrowActionSheet = (props: PropGrowActionSheet) => {
  const { popupVisible, minHeight = '40vh', actionList, showCancal = false, onClose, actionConfirm } = props;
  const [visible, setVisible] = useState(popupVisible);

  const toogle = () => {
    setVisible(!visible)
    visible ? onClose?.() : undefined
  }

  const handClick = (e: TypeAction) => {
    actionConfirm && actionConfirm(e.key);
    e.onClick?.(e)
  }

  useEffect(() => {
    setVisible(popupVisible);
  }, [popupVisible])

  return (
    <>
      {props.children ? <div className={props.className} onClick={toogle}>{ props.children }</div> : undefined}
      {/* push弹出窗 */}
      <Popup
        visible={visible}
        onMaskClick={toogle}
        style={{ zIndex: 998 }}
        bodyStyle={{
          borderTopLeftRadius: '.06rem',
          borderTopRightRadius: '.06rem',
          minHeight
        }}
      >
        <div className="flex flex-col justify-between h-full py-16">
          <div>
            {
              actionList.map((item) => 
                exec(item.hide)
                  ? undefined
                  : (
                    <div className="flex py-14 px-16 b-b-1 border-text/8 last:b-b-0 active:bg-text/8" onClick={() => handClick(item)} key={item.key}>
                      { typeof item.icon === 'string' ? <img className="mr-16" src={item.icon} alt="" /> : item.icon}
                      <span>{item.name}</span>
                    </div>
                  )
              )
            }
          </div>
          {
            showCancal &&
            <div onClick={toogle} className="py-12 m-16 mb-0 text-center rounded-6 border border-[#112438][0.08] active:bg-text/8">
              <span className="">Cancel</span>
            </div>
          }
        </div>
      </Popup>
    </>
  )
}

export default GrowActionSheet;