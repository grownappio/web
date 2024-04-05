import React from "react";
import styles from "./index.module.less";
import loadingWhite from "@/assets/img/loading-white.gif";
import { NativeProps, withNativeProps } from "antd-mobile/es/utils/native-props";

const Loading  = (props: NativeProps) => {
  return withNativeProps(props,
    <div className={styles['loading-box']}>
      <img src={loadingWhite} alt="" />
    </div>
  )
}
export default Loading;