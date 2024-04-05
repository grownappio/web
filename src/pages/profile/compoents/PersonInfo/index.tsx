import React from "react";
import { useHistory } from "react-router-dom";
import { SEX_LIST } from "@/units/commonData";

import defaultHeaderIcon from "@/assets/img/profile/info/default-header.svg";
import addressIcon from "@/assets/img/profile/info/address.svg";
import specialityImg from "@/assets/img/profile/info/speciality.svg";
import likeImg from "@/assets/img/profile/info/like.svg";

import styles from "./index.module.less";
import type { TypeuserInfo } from "../../data.d";

export type PersonInfoProps = {
  userInfo: TypeuserInfo;
  isSelf: boolean;
  followPeople: () => void;
  children: JSX.Element[]
}

const PersonInfo = (props: PersonInfoProps) => {
  const { userInfo, isSelf, followPeople } = props;
  const history = useHistory();
  return (
    <div className={styles['person-info'] + ' p-12 pt-0 bg-white'}>
      <div className={styles.information}>
        <div className={styles['header-icon'] + ' float-left'}>
          <img className='rounded-full' src={userInfo.icon ? userInfo.icon : defaultHeaderIcon} alt="" />
        </div>
        {
          isSelf
            ?
            <button className="float-right mt-12 py-6 px-14 rounded-6 text-primary border-primary border-1" onClick={() => history.push('/editProfile')}>
              Edit Profile
            </button>
            :
            <button className={`float-right mt-12 py-6 px-14 rounded-6 ${userInfo.is_follow ? 'text-[#11243899] bg-[#F1F2F3]' : 'text-white bg-primary'}`} onClick={() => followPeople()}>
              { userInfo.is_follow ? 'Following' : 'Follow' }
            </button>
        }
        <div className={styles['information-content']}>
          <p className="text-20 font-bold">{userInfo?.nick_name || '--'}</p>
          <p className="text-12 opacity-60">@{userInfo?.name || '--'}</p>
          <div className={styles['sex-address']}>
            <div>
              <img src={userInfo.sex ? SEX_LIST[userInfo.sex].icon : SEX_LIST[1].icon} alt="" />
              <span>{userInfo?.age || '0'}</span>
            </div>
            <div>
              <img src={addressIcon} alt="" />
              <span>{userInfo?.location || '--'}</span>
            </div>
          </div>
          {
            userInfo.intro
            &&
            <p className="mt-12 py-8 px-12 text-12 rounded-4 bg-text/5">{ userInfo.intro }</p>
          }
        </div>
      </div>
      {/* 专长 */}
      {
        userInfo?.expertises
        &&
        <div className={styles.list + ' !mt-20'}>
          <img className="mr-12 w-30 h-30 rounded-6" src={specialityImg} alt="" />
          {
            userInfo?.expertises.split(',').slice(0, 3).map((item, i) => 
              <div key={i} className={styles.option}>{item}</div>
            )
          }
        </div>
      }
      {/* 爱好 */}
      {
        userInfo?.interests
        &&
        <div className={styles.list}>
          <img className="mr-12 w-30 h-30 rounded-6" src={likeImg} alt="" />
          {
            userInfo?.interests.split(',').slice(0, 3).map((item, i) => 
              <div key={i} className={styles.option}>{item}</div>
            )
          }
        </div>
      }

      { props.children }
    </div>
  )
}

export default PersonInfo;