import React, { ReactNode } from "react";
import { PhotoProvider, PhotoSlider } from 'react-photo-view';
import { OverlayRenderProps } from "react-photo-view/dist/types";
import 'react-photo-view/dist/react-photo-view.css';
import viewAllImg from "./view-all-img.svg";
import "./index.less";

export type ImgPreviewProps = {
  imgList: { src: string, key: number }[];
  visible: boolean;
  previewPndex: number;
  setPreviewPndex: (value: number) => void;
  setVisible: (value: boolean) => void;
  viewAllBtnFlag?: boolean;
  toViewAllImg?: () => void;
  toolbarRender?(ctx: OverlayRenderProps): ReactNode;
}

const ImgPreview = (props: ImgPreviewProps) => {
  const { imgList, previewPndex, setPreviewPndex, visible, setVisible, viewAllBtnFlag = false, toViewAllImg, toolbarRender } = props;
  return (
    <div className="img-preview">
      <PhotoProvider>
        <PhotoSlider
          toolbarRender={(ctx) => {
            return (
              <>
                { toolbarRender?.(ctx) }
                {
                  viewAllBtnFlag
                  &&
                  <div onClick={() => toViewAllImg && toViewAllImg()} className={'view-all-box'}>
                    <img src={viewAllImg} alt="" />
                    <span>View all</span>
                  </div>
                }
              </>
            );
          }}
          images={imgList}
          visible={visible}
          onClose={() => setVisible(false)}
          index={previewPndex}
          onIndexChange={setPreviewPndex}
        />
      </PhotoProvider>
    </div>
  )
}

export default ImgPreview;