import React, { useState, useEffect } from 'react';
import { ImgHTMLAttributes } from "react";
// 下面这两个是导入默认的图片
import errorImg from './img/error-img.svg';
import styles from "./index.module.less";
import { withNativeProps } from 'antd-mobile/es/utils/native-props';

/**
 * 图片占位组件属性
 */
export interface IImagProps<T> extends ImgHTMLAttributes<T> {
  /**
   * 加载中的图片
   */
  loadingImg?: string,
  /**
   * 失败加载的图片
   */
  errorImg?: string,
  /**
   * 图片正常显示的地址
   */
  src: string,
  /**
   * 图片样式
   */
  style?: any,
  className?: string,
  onLoad?: () => void;
  onClick?: () => void;
}
export default function Img(props: IImagProps<any>) {
  // 图片地址
  const [src, setSrc] = useState(props.loadingImg as string)
  // 是否第一次加载，如果不使用这个会加载两次
  const [isFlag, setIsFlag] = useState(false);
  const [type, setType] = useState<number>(1); // 1 加载中 2 加载成功 3 加载失败
  /**
   * 图片加载完成
   */
  const handleOnLoad = () => {
    // 判断是否第一次加载
    if (isFlag) return;
    // 创建一个img标签
    const imgDom = new Image();
    imgDom.src = props.src;
    // 图片加载完成使用正常的图片
    imgDom.onload = function () {
      setIsFlag(true)
      setSrc(props.src)
      setTimeout(() => {
        setType(2)
        if (props?.onLoad) {
          props?.onLoad();
        }
      }, 600);
    }
    // 图片加载失败使用图片占位符
    imgDom.onerror = function () {
      setIsFlag(true)
      setType(3)
      setSrc(props.errorImg as string)
    }
  }
  // 图片预加载
  useEffect(() => {
    handleOnLoad();
  }, [src])

  useEffect(() => {
    setSrc(props.src)
  }, [props.src])

  return (
    <>
      {
        type === 1
        &&
        withNativeProps(props, (
          <div {...props} className={styles['loading-box']}>
            <div className="wave" />
          </div>
        ))
      }
      {
        type === 2
        &&
        withNativeProps(props, (
          <img {...props} className='w-full h-full object-cover' alt="" onLoad={handleOnLoad} />
        ))
      }
      {
        type === 3
        &&
        withNativeProps(props, (
          <img {...props} className={styles['error-box']} onLoad={handleOnLoad} alt='' />
        ))
      }
    </>
  )
}
// 设置默认的图片加载中的样式和失败的图片
Img.defaultProps = {
  errorImg: errorImg
}
