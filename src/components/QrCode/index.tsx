import React from "react";
import QRCode from 'qrcode.react';
import { NativeProps, withNativeProps } from "antd-mobile/es/utils/native-props";

export type QrcodeAddress = {
  value: string;
} & NativeProps

const Qrcode = (props: QrcodeAddress) => {
  const { value } = props;
  return withNativeProps(props,
    <QRCode
      id="qrCode"
      value={value}
      fgColor="#000000" // 二维码的颜色
      level="L"
      style={{ margin: 'auto', height: '1.67rem', width: '1.67rem', border: '.1rem solid rgba(52, 208, 38, 0.08)' }}
    />
  )
}

export default Qrcode;