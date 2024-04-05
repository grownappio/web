import React from "react";
import { useHistory } from "react-router-dom";
import { useAliveController } from 'react-activation';

import latestImg from '@/assets/img/grow/latest.svg';
import latestSelectImg from '@/assets/img/grow/latest-select.svg';

import subscriptionImg from '@/assets/img/grow/subscription.svg';
import subscriptionSelectImg from '@/assets/img/grow/subscription-select.svg';

import followingImg from '@/assets/img/grow/following.svg';
import followingSelectImg from '@/assets/img/grow/following-select.svg';

import styles from './index.module.less';

const routerTabList=[
    {
        id: 0,
        name: 'Latest',
        img: latestImg,
        selectImg: latestSelectImg
    },
    {
        id: 1,
        name: 'Subscription',
        img: subscriptionImg,
        selectImg: subscriptionSelectImg
    },
    {
        id: 3,
        name: 'Following',
        img: followingImg,
        selectImg: followingSelectImg
    },
]

export type GrowLeftProps = {
    currentTabID: number;
    isSearch: boolean;
    setCurrentTabID: (value: number) => void;
    switchToHome: () => void;
}

const GrowLeft = (props: GrowLeftProps) => {
    const { clear } = useAliveController();
    const { currentTabID,  setCurrentTabID, isSearch } = props;
    const history = useHistory();
    return (
        <div className={styles['left-tab']}>
              {
                  routerTabList.map((item, index)=>{
                      return(
                          <div key={index}
                                className={[styles['tab-item'], (currentTabID === item.id && !isSearch) ? styles.active:''].join(' ')}
                                onClick={()=>{
                                    if (item.id === 3) {
                                        return
                                    }
                                    if (isSearch) {
                                        clear();
                                        setTimeout(() => {
                                            sessionStorage.setItem('leftTabId', String(item.id))
                                            history.goBack();
                                        }, 100);
                                    }
                                    setCurrentTabID(item.id)
                                }}
                          ><img src={ (currentTabID === item.id && !isSearch) ? item.selectImg : item.img} alt={''}/>{item.name}</div>
                      )
                  })
              }
          </div>
    )
}

export default GrowLeft;