import React, { useEffect, useState } from "react";
import { PhotoProvider, PhotoSlider } from 'react-photo-view';
import ImgComponent from "@/components/ImgComponent";
import viewPictureIcon from "./viewpicture.svg";
import styles from "./index.module.less";

export type PropsImgList = {
  imgList: any[];
  isHide?: boolean;
}

const ImgList = (props: PropsImgList) => {
  const { imgList, isHide = false } = props;
  // const [imgAnswerStyle, setImgAnswerStyle] = useState({
  //   width: '1.1rem',
  //   height: '1.1rem'
  // })
  // 1 一张图片 高/宽 <= 1   
  // 2 一张图片 1 < 高/宽 < 1.2 
  // 3 一张图片 高/宽 >= 1.2
  // 4 二张图片 或者 四张
  // 5 三张或者大于等于五张
  const [imgType, setImgType] = useState<number>(4);
  const [classArr] = useState<string[]>(['one', 'two', 'three', 'four', 'five'])
  const [previewPndex, setPreviewPndex] = useState<number>(1);
  const [visible, setVisible] = useState<boolean>(false);
  const [imgHide, setImgHide] = useState<boolean>(false);
  const [paddingBottomValue, setPaddingBottomValue] = useState<number>(0);

  useEffect(() => {
    setImgHide(isHide);
  }, [isHide])

  useEffect(() => {
    if (imgList.length === 2 || imgList.length === 4) {
      setImgType(3)
    }

    if (imgList.length === 3 || imgList.length >= 5) {
      setImgType(4)
    }
  }, [])
  return (
    <>
      <div
        className={
          [
            styles['img-list'],
            styles[classArr[imgType]],
            imgHide ? styles.hide : ''
          ].join(' ')}
      >
        {
          imgHide
          &&
          <div onClick={(e) => {
            e.stopPropagation();
            setImgHide(false)
          }} className={styles['hide-mask']}>
            <span>view picture</span>
            <img src={viewPictureIcon} alt="" />
          </div>
        }
        {
          (imgList || []).map((items: string, index: number) => {
            return (
              <div key={`${items}${index}`} style={{ paddingBottom: imgList.length === 1 ? `${paddingBottomValue * 100}%` : 0 }} className={[styles['img-warp'], index >= 9 ? styles.none : ''].join(' ')}>
                <ImgComponent
                  onClick={() => {
                    setPreviewPndex(index);
                    setVisible(true);
                  }}
                  className={styles['img-box']}
                  // style={imgAnswerStyle}
                  src={items}
                  onLoad={() => {
                    if (imgList && imgList.length === 1) {
                      const imgObj = new Image();
                      imgObj.src = items;
                      imgObj.onload = () => {
                        const proportion = imgObj.naturalHeight / imgObj.naturalWidth;
                        if (proportion <= 1) {
                          setImgType(0)
                          setPaddingBottomValue(proportion)
                        } else if (proportion > 1 && proportion < 1.2) {
                          setPaddingBottomValue(proportion)
                          setImgType(1)
                        } else {
                          setImgType(2)
                        }
                      }
                    }
                  }} />
                {
                  imgList.length > 9 && index === 8
                  &&
                  <div className={styles['img-mask']}>+{imgList.length - 8}</div>
                }
              </div>
            )
          })
        }
      </div>
      <PhotoProvider>
        <PhotoSlider
          images={imgList.map((item: string, index: number) => ({ src: item, key: index }))}
          visible={visible}
          onClose={() => setVisible(false)}
          index={previewPndex}
          onIndexChange={setPreviewPndex}
        />
      </PhotoProvider>
    </>
  )
}

export default ImgList