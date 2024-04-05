import React, { useState } from "react";
import { Toast } from "antd-mobile";
import { useHistory } from "react-router-dom";
import ImgPreview from "@/components/ImgPreview";
import noFollowingImg from '@/assets/img/grow/no-following.svg';
import { SEX_LIST } from "@/units/commonData";
import { getPeopleNum } from "@/units/index";
import { followPeople } from "../../service";
import styles from "./index.module.less";

import addressIcon from "@/assets/img/profile/info/address.svg";
export type FollowingCardProps = {
  peopleCardList: any[];
  setPeopleCardList?: (value: any[]) => void;
}

const FollowingCard = (props: FollowingCardProps) => {
  const history = useHistory();
  const { peopleCardList, setPeopleCardList } = props;
  const [imgList, setImgList] = useState<{ src: string, key: number }[]>([]); // 预览图片列表
  const [previewPndex, setPreviewPndex] = useState<number>(1); // 默认打开预览图片下表
  const [visible, setVisible] = useState<boolean>(false); // 图片预览开关
  const [selectCardId, setSelectCardId] = useState<number>(0); // 选择的人物id

  const executeFollowPeople = async (id: number, value: boolean) => {
    const result = await followPeople({ user_id: id });
    if (result?.code === 200) {
      setPeopleCardList && setPeopleCardList(peopleCardList.map((item) => {
        return {
          ...item,
          is_follow: item.id === id ? value : item.is_follow
        }
      }))
      Toast.show({
        content: value ? 'Follow succeeded' : 'Unfollow succeeded',
        duration: 1000
      })
    }
  }

  const toPhotoAlbum = (id: number) => {
    setVisible(false);
    history.push(`/photoAlbum?id=${id}`)
  }

  const openImgPreview = (id: number, index: number) => {
    peopleCardList.forEach((item) => {
      if (item.id === id) {
        setImgList((item.albums || []).map((item: string, index: number) => {
          return {
            src: item,
            key: index
          }
        }))
        setPreviewPndex(index);
        setVisible(true);
      }
    })
    setSelectCardId(id);
  }

  const toProfile = (id: number) => {
    history.push(`/profile?id=${id}`)
  }

  return (
    <div id="grow-option-list" className={styles['following-card-box']}>
      <div className={styles['no-data-box']}>
        <img src={noFollowingImg} alt="" />
        <span>You are not following anyone. Don't be alone in Grown!</span>
      </div>
      <div className={styles['recommended-you']}>
        <span style={{ background: document.body.style.background }}>Recommended to you</span>
      </div>
      <div className={styles['following-card-list']}>
        {
          peopleCardList.map((item: any, index: number) => (
            <div key={item.id} className={[styles['person-card-follow']].join(' ')}>
              <div className={styles['person-card-top']}>
                <div className={styles['person-card-top-left']}>
                  <div onClick={() => toProfile(item.id)} className={styles['user-icon-box']}>
                    <img src={item?.icon} alt="" />
                  </div>
                  <div className={styles.info}>
                    <div onClick={() => toProfile(item.id)} className={styles['nick-name']}>
                      <span>{item?.nick_name || '--'}</span>
                    </div>
                    <div onClick={() => toProfile(item.id)} className={styles['user-name']}>
                      <span>@{item?.name || '--'}</span>
                    </div>
                  </div>
                </div>
                {
                  !item.is_self
                  &&
                  <div onClick={() => { executeFollowPeople(item.id, !item.is_follow) }} className={[styles['person-card-btn'], item.is_follow ? styles.active : ''].join(' ')} />
                }
              </div>
              {
                (item?.age || item?.location)
                &&
                <div className={styles['sex-address']}>
                  {
                    item?.age
                      ?
                      <div>
                        <img src={item.sex ? SEX_LIST[item.sex].icon : SEX_LIST[1].icon} alt="" />
                        <span>{item?.age || '0'}</span>
                      </div>
                      :
                      <span />
                  }
                  {
                    item?.location
                      ?
                      <div>
                        <img src={addressIcon} alt="" />
                        <span className={styles['address-box']}>{item?.location || '--'}</span>
                      </div>
                      :
                      <span />
                  }
                </div>
              }
              {
                item.intro
                &&
                <div className={styles['person-tip']}>
                  {item?.intro}
                </div>
              }
              <div className={styles.fans}>
                <div className={styles.following}>
                  <span>{getPeopleNum(item?.following_num || 0)}</span>
                  <span>Following</span>
                </div>
                <div className={styles.follower}>
                  <span>{getPeopleNum(item?.fans_num || 0)}</span>
                  <span>Followers</span>
                </div>
              </div>
              {
                item?.albums?.length
                  ?
                  <div className={styles['img-list']}>
                    {
                      (item?.albums || []).map((items: string, index: number) => {
                        return (
                          <div className={styles['img-box']} key={index} >
                            <img onClick={() => { openImgPreview(item.id, index) }} src={items} alt="" />
                          </div>
                        )
                      })
                    }
                    <div onClick={() => toPhotoAlbum(item.id)} className={styles['view-all-btn']}>
                      View all
                    </div>
                  </div>
                  :
                  <div />
              }
            </div>
          ))
        }
      </div>
      <ImgPreview
        viewAllBtnFlag={true}
        toViewAllImg={() => { toPhotoAlbum(selectCardId) }}
        imgList={imgList}
        visible={visible}
        previewPndex={previewPndex}
        setPreviewPndex={setPreviewPndex}
        setVisible={setVisible}
      />
    </div>
  )
}

export default FollowingCard;