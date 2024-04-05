import { NativeProps, withNativeProps } from "antd-mobile/es/utils/native-props";
import React from "react";

type PropsDelModalTip = {
  seedStatus: number;
  content: string;
} & NativeProps

const DelModalTip = (props: PropsDelModalTip) => {
  const { seedStatus, content } = props; 
  return withNativeProps(props,
    <div>
      <p className='text-16 '>Are you sure to delete this {content}?</p>
      {
        (seedStatus === 2 || seedStatus === 1) &&
        <p className='px-28 text-14 mt-8 text-[#F11F29]'><span>Deleting it now will make you lose seed earnings</span></p>
      }
    </div>
  )
}

export default DelModalTip;