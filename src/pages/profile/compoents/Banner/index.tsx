import React from "react";
import { useHistory } from "react-router-dom";
import UploadImage from "@/components/UploadImage";
import styles from "./index.module.less";

import cameraImg from "@/assets/img/profile/banner/camera.svg";
import uploadSmallImg from "@/assets/img/profile/banner/upload-small.svg";
import numberImg from "@/assets/img/profile/banner/img-number.svg";
import profileReturnImg from "@/assets/img/profile/banner/profile-return.svg";
import bannerBgImg from "@/assets/img/profile/banner/banner-bg.png";
import loadingImg from "@/components/ImgComponent/img/img-loaing.gif";

export type ProfileBannerProps = {
  bgm_pic: string;
  album_num: numberImg;
  isSelf: boolean;
  bannerLoading: boolean;
  imgUploadSuccess: (e: any) => void;
  toPhotoAlbum: () => void;
  openPreview: () => void;
}

const ProfileBanner = (props: ProfileBannerProps) => {
  const { album_num, bgm_pic, isSelf, imgUploadSuccess, toPhotoAlbum, openPreview, bannerLoading } = props;
  const history = useHistory();

  async function upload() {
    await UploadImage().then(imgUploadSuccess)
  }

  if (bannerLoading) {
    return (
      <div className={styles['img-loading']}>
        <img src={loadingImg} alt="" />
      </div>
    )
  }

  return (
    <div onClick={() => {
      if (bgm_pic) {
        openPreview()
      }
    }} className={styles['profile-banner-box']}>
      <div className={styles['banner-img']}>
        <img className={styles['bg-img']} src={!bgm_pic ? bannerBgImg : bgm_pic} alt="" />
      </div>
      {
        !bgm_pic && isSelf
        &&
        <img className={styles['upoload-big']} src={cameraImg} alt="" onClick={upload} />
      }
      <div className={styles['btn-list']}>
        {
          isSelf
          &&
          <div onClick={(e) => e.stopPropagation()} className={[styles['btn-option'], bgm_pic ? styles.bac : ''].join(' ')}>
            <img src={uploadSmallImg} alt="" onClick={upload} />
          </div>
        }
        <div onClick={(e) => {
          e.stopPropagation();
          if (!album_num) return
          toPhotoAlbum();
        }} className={[styles['btn-option'], bgm_pic ? styles.bac : ''].join(' ')}>
          <img src={numberImg} alt="" />
          <span>{album_num}</span>
        </div>
      </div>
      <div className={styles['background-shaow']} />
      <img onClick={(e) => {
        e.stopPropagation();
        history.goBack();
      }} className={styles['profile-return-img']} src={profileReturnImg} alt="" />
    </div>
  )
}

export default ProfileBanner;