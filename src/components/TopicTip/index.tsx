import React, { useEffect, useState } from "react";
import closeSvg from "./close.svg";

interface PropsTopicTip {
  position: {top: number; left: number};
  modalVisible: boolean;
}

const range = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val))

const TopicTip = (props: PropsTopicTip) => {
  const [visible, setVisile] = useState<boolean>(false);
  const { modalVisible, position } = props;
  const handClose = () => {
    setVisile(false);
  }
  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => {
        setVisile(false);
      }, 3000);
    }
    setVisile(modalVisible)
  }, [modalVisible])
  if (!visible) {
    return <></>
  }
  return (
    <div style={{ top: position.top, left: range(position.left, 0, 60) }} className='absolute right-12'>
      <div className="inline-flex items-center px-4 rounded-4 text-12 text-white bg-black">
        <span>Between the two # is the content of the topic</span>
        <img className="w-14 h-14 pl-4 box-content" onClick={handClose} src={closeSvg} alt="" />
      </div>
    </div>
  )
}

export default TopicTip;