import Appbar from '@/components/Appbar'
import { characterConversionIcon } from '@/units'
import { Popup } from 'antd-mobile';
import React from 'react'

import questionIcon from "@/assets/img/publish/question-icon.svg";

const getText = (str: string) => {
  if (!str) return
  // 去除图片 与 style内联样式
  return characterConversionIcon(str.replace(/\s+style="[^"]*"/g, ''))
}

const QuestionPopup = ({ title = '', description = '', onClose = () => {}, visible = false }) => {
  return (
    <Popup visible={visible} position="right" bodyStyle={{ width: '100%' }}>
      <Appbar onBack={onClose} />
      <div className="flex m-16 mt-12">
        <img className="mt-1 mr-16 w-20 h-20" src={questionIcon} alt="" />
        <div className="flex-1">
          <div className='text-16 font-medium line-clamp-4' dangerouslySetInnerHTML={{ __html: title || '' }} />
          <div className="ql-editor grow-ql-editor mt-16" dangerouslySetInnerHTML={{ __html: getText(description) || '' }} />
        </div>
      </div>
    </Popup>
  )
}

export default QuestionPopup