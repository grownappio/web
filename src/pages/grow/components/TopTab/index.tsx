import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Badge } from "antd-mobile";
import { useData } from "@/reducer";
import GrowDropDown from "@/components/GrowDropDown";
import classnames from 'classnames';
import styles from "./index.module.less";
import { ReactSVG } from "react-svg";
import { openPopup } from "@/components/_utils/openPopup";
import PersonalCenter from "@/pages/personalCenter";

import tabSearchImg from "@/assets/img/grow/tab-search.svg";
import tabWalletImg from "@/assets/img/grow/tab-wallet.svg";

export type PropsTopTab = {
  currentTabID: number;
  isShadow: boolean;
  changeCurrentId: (value: number) => void;
}

export type TypeDropItem = {
  id: number;
  title: string;
}

export type TypeDropItemGrow = {
  id: number;
  title: string;
}

const TopTab = (props: PropsTopTab) => {
  const history = useHistory();
  const { currentTabID, changeCurrentId, isShadow } = props;
  const state = useData();
  
  const [dropList] = useState<TypeDropItemGrow[]>([
    { id: 2, title: 'Hot' },
    { id: 0, title: 'New' },
  ])

  function openPersonal() {
    const popup = openPopup(<PersonalCenter state={state} history={history} onBack={() => popup.close()} />, { position: 'left', bodyClassName: 'w-full', history })
  }

  return (
    <div className={classnames({
      [styles['top-tab-box']]: true,
      [styles['show-shadow']]: isShadow
    })}>
      <img className={styles['tab-user-icon']} src={state?.userInfo?.icon} alt="" onClick={openPersonal} />
      <div className={styles['tab-list']}>
        <div className={classnames({
          [styles['tab-drop-list']]: true,
          [styles.active]: currentTabID === 0 || currentTabID === 2
        })}>
          <GrowDropDown title={currentTabID ? 'Hot' : 'New'} onChange={(id: number) => {
            if (id === currentTabID) return
            changeCurrentId(id)
          }}
            list={dropList}
          />
        </div>
        <div onClick={() => {
          if (currentTabID === 4) {
            return
          }
          changeCurrentId(4)
        }} className={classnames({
          [styles['tab-option']]: true,
          [styles.active]: currentTabID === 4
        })}>
          {
            (state.follow_flag)
              ?
              <Badge content={Badge.dot}>
                <span>Following</span>
              </Badge>
              :
              <span>Following</span>
          }
        </div>
      </div>
      <div className='absolute right-16 flex items-center space-x-16 opacity-60 [&>*]:w-24 [&>*]:h-24'>
        <ReactSVG src={tabSearchImg} onClick={() => history.push('/search')} />
        <ReactSVG src={tabWalletImg} onClick={() => history.push('/wallet')} />
      </div>
    </div>
  )
}

export default TopTab;