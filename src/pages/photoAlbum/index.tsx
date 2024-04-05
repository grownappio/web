import React, { useState, useEffect, useRef } from "react";
import { message } from "antd";
import UploadImage from "@/components/UploadImage";
import ImgPreview from "@/components/ImgPreview";
import ImageCropper from "@/components/ImageCropper";
import { getUrlHashParam } from "@/units/index";
import HeaderTop from "@/components/HeaderTop";
import GrowMask from "@/components/GrowMask";
import uploadPhotoImg from "@/assets/img/profile/photoAlbum/upload-photo.svg";
import setCoverImg from "@/assets/img/profile/photoAlbum/set-cover.svg";
import deleteImg from '@/assets/img/grow/editAndDel/del.svg';
import reportImg from "@/assets/img/profile/photoAlbum/report.svg";
import moreImg from './more.svg'
import loadingMoreGif from "@/assets/img/grow/loading-more.gif";
import ImgComponent from "@/components/ImgComponent1";

import styles from './index.module.less';
import { queryBlbum, delAlbum, setCover, addAlbum } from "./service";
import { Confirm, showActionSheet } from "@/components/_utils/Confirm";
import { useData } from "@/reducer";
import Appbar from "@/components/Appbar";

export type TypeImg = {
  id: number;
  Pic: string;
  PicHeight?: number;
  UserID?: number;
  is_cover?: boolean;
  updated_at?: string;
  created_at?: string;
}

const PhotoAlbum = () => {
  const imgBoxRef = useRef(null);
  const [params] = useState<any>(getUrlHashParam());
  const isSelf = useData().userInfo.id == getUrlHashParam().id

  // 设置封面
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [cropperVisible, setCropperVisible] = useState<boolean>(false);
  const [uploadUrlId, setUploadUrlId] = useState<number>(0);

  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewVis, setPreviewVis] = useState(false)

  const [imgList, setImgList] = useState<TypeImg[]>([]);

  const getImgList = async () => {
    const result = await queryBlbum({
      id: params?.id ? Number(params.id) : 0,
      page: {
        page_size: 999,
        page_num: 1
      }
    });
    setImgList(result?.data || []);
  }


  const delImg = async ({ id }: TypeImg) => {
    await Confirm({
      title: 'Delete photo?',
      content: 'Do you want to delete this photo?',
    })
    await delAlbum({ id })
    setImgList(imgList.filter((item) => item.id !== id))
  }

  const setCover$ = (item: TypeImg) => {
    setUploadUrlId(item.id);
    setUploadUrl(item.Pic);
    setCropperVisible(true);
    setPreviewVis(false)
  }

  const cropperSuccess = async (url: string) => {
    setCropperVisible(false);
    await setCover({
      id: uploadUrlId,
      cover_addr: url
    })
    message.success('Added successfully');
    // 移动到首位
    const i = imgList.findIndex(e => e.id === uploadUrlId)
    ~i && imgList.unshift(...imgList.splice(i, 1))
    setImgList(imgList.slice());
  }

  const upload = async () => {
    const url = await UploadImage();
    let image = new Image();
    image.src = url!;
    image.onload = async () => {
      const imgHeight = (402 * image.height) / image.width;
      const result = await addAlbum({
        addr: url,
        height: imgHeight,
        is_cover: false
      })
      if (result?.code === 200) {
        const tempImgList = JSON.parse(JSON.stringify(imgList));
        tempImgList.splice(1, 0, {
          id: result?.data || -2,
          Pic: url,
          PicHeight: imgHeight,
          is_cover: false
        })
        setImgList(tempImgList);
      }
    }
  }

  const showActions = (item: TypeImg) => {
    showActionSheet({
      cancelText: 'Cancel',
      actions: isSelf && item.id !== -1
        ? [
          { text: 'Set as cover', icon: setCoverImg, key: 1, onClick: () => setCover$(item) },
          { text: 'Delete', icon: deleteImg, key: 2, onClick: () => delImg(item) },
        ]
        : []
    })
  }

  useEffect(() => {
    getImgList();
  }, [])

  return (
    <div className={styles['photo-album-box']}>
      <Appbar
        title='Photo album'
        right={isSelf && <span className="text-primary" onClick={upload}>Upload</span>}
      />
      <div ref={imgBoxRef} className={styles['img-list']}>
        <div className={styles['album-img-box']}>
          <div>
            {/* todo */}
            {/* {
              isSelf
              &&
              <div style={{ top: 0, left: 0, }} className={'flex-column-ele'}>
                <div onClick={(e) => {e.stopPropagation(); upload()}} className={styles['upload-photo']}>
                  <img src={uploadPhotoImg} alt="" />
                  <span>Upload photo</span>
                </div>
              </div>
            } */}

          </div>

          <wc-waterfall cols={2} gap={12}>
            {
              imgList.map((e, i) => (
                <div key={e.id}>
                  <ImgComponent className='min-h-128 bg-white rounded-8' src={e.Pic} onClick={() => { setPreviewIndex(i); setPreviewVis(true)}} />
                  <img className='absolute top-8 right-8 w-32 h-32 rounded-8 backdrop-blur-sm' src={moreImg} onClick={() => showActions(e)} />
                </div>
              )) 
            }
          </wc-waterfall>
        </div>
      </div>
      <ImageCropper isCover={true} url={uploadUrl} onSuccess={cropperSuccess} modalVisible={cropperVisible} setModalVisible={setCropperVisible} aspectRatio={861 / 320} />
      <ImgPreview
        imgList={imgList.map((item) => ({ key: item.id, src: item.Pic }))}
        visible={previewVis}
        previewPndex={previewIndex}
        setPreviewPndex={setPreviewIndex}
        setVisible={setPreviewVis}
        toolbarRender={() => (
          isSelf
          &&
          <>
            <img className="w-40 h-40 p-10 rounded-full bg-white/10 brightness-[50]" src={setCoverImg} onClick={() => setCover$(imgList[previewIndex])} />
            <img className="w-40 h-40 p-10 rounded-full bg-white/10 brightness-[50] ml-12" src={deleteImg} onClick={() => delImg(imgList[previewIndex])} />
          </>
        )}
      />
    </div>
  )
}

export default PhotoAlbum;