import React from "react";
import { useHistory } from "react-router-dom";
import { useData } from "@/reducer";
import { openPopup } from "@/components/_utils/openPopup";
import PersonalCenter from "@/pages/personalCenter";
import styles from './index.module.less';

import BannerImg from "@/assets/img/earn/banner/banner.png";
import liImg from '../../img/li.svg'
import capImg from '../../img/cap.svg'
import walletImg from '../../img/wallet.svg'
import qImg from '../../img/q.svg'
import fbImg from '../../img/fb.svg'
import { showActionSheet } from "@/components/_utils/Confirm";
import { useRequest } from "ahooks";
import { userBalance } from "@/components/Left/service";

const actions = [
  {
    key: 1,
    text: 'How to play',
    icon: qImg,
    onClick: () => window.open('https://grown.gitbook.io/grown-whitepaper/')
  },
  {
    key: 2,
    text: 'Feedback',
    icon: fbImg,
  },
]

const Banner = () => {
  const history = useHistory()
  const state = useData()
  
  const { data } = useRequest(() => userBalance({ chain_id: 80001 }))
  
  function openPersonal() {
    const popup = openPopup(<PersonalCenter state={state} history={history} onBack={() => popup.close()} />, { position: 'left', bodyClassName: 'w-full', history })
  }

  function openMenu() {
    showActionSheet({ cancelText: 'Cancel', actions })
  }

  return (
    <div className={styles['banner-box']}>
      <div className="absolute flex px-16 py-8 w-full [&_img]:rounded-full">
        <img className="w-32 h-32 b-1 border-[#ECEDEF] shadow-lg" src={state.userInfo.icon} alt="" onClick={openPersonal} />
        <div className="flex-1"></div>
        <img className="w-32 h-32" src={liImg} onClick={openMenu} />
        <div className="flex items-center ml-12 p-2 rounded-full bg-white/60 text-[#7C6043]">
          {/* todo */}
          {/* <img className="ml-10 mr-8 w-20 h-20" src={capImg} /> */}
          <img className="ml-4 mr-6 w-24 h-24" src={data?.data[1].token_image_url} />
          <span className="font-bold">{ data?.data[1].balance }</span>
          <img className="ml-12 p-4 w-28 h-28 bg-white" src={walletImg} onClick={() => history.push('/wallet')} />
        </div>
      </div>
      <img className="h-252 object-cover" src={BannerImg} alt="" />
    </div>
  )
}

export default Banner;