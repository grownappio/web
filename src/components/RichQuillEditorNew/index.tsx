import React, { useEffect, forwardRef, useState, ForwardedRef, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import 'react-quill/dist/quill.snow.css';
// @ts-ignore
import ImageResize from 'quill-image-resize-module-react';
import { RichTopicBlot, AppDividerEmbed, EmojiBlot } from './custom';
import { getToken } from "@/units";
import { message } from 'antd';
import { NativeProps, withNativeProps } from "antd-mobile/es/utils/native-props";
import "./index.less";

let quill: ReturnType<ReactQuill['getEditor']>
let upLoadNum = 0

Quill.register(AppDividerEmbed);
// 自定义话题
Quill.register(RichTopicBlot);

export type RichQuillProps = {
  maxImage?: number;
  initialValue: any;
  placeholder?: string;
  onInput: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  richKeyDown?: (e: any) => void;
  modules: any;
} & NativeProps

// 注册图片缩放功能
// todo
// Quill.register('modules/imageResize', ImageResize);

const RichQuill = (props: RichQuillProps, quillRef: ForwardedRef<ReactQuill>) => {
  const { initialValue = '', placeholder = '', modules, maxImage = 100, onInput, onFocus, onBlur, richKeyDown } = props;
  const [quillModule, setQuillModule] = useState<any>({});
  function handelImageUpload() {
    if (upLoadNum === 0) {
      upLoadNum = [...quill.getContents().ops || []].filter((item: any) => { return item['insert']['image'] }).length
    }
    if (upLoadNum !== [...quill.getContents().ops || []].filter((item: any) => { return item['insert']['image'] }).length) {
      message.warning(`请等待图片上传成功`)
    }
    if (maxImage && upLoadNum >= maxImage) {
      message.warning(`图片的数量不能大于${maxImage}`)
      return
    } else {
      upLoadNum++
    }
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      // @ts-ignore
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);
      // 自定义图片上传接口
      const response = await fetch(`${process.env.API_ROOT}app/file/upload`, {
        method: 'POST',
        headers: {
          'token': getToken()
        },
        body: formData
      });
      if (response.ok) {
        const res: any = JSON.parse(await response.text());
        if (res?.code === 200) {
          const currentPosition = quill.getSelection()?.index || 0
          quill.insertEmbed(currentPosition, 'image', res?.data?.url);
          quill.setSelection(currentPosition + 1, 0);
        } else {
          upLoadNum--
          message.warning('Failed to upload image')
        }
      } else {
        console.log('Failed to upload image');
      }
    };

  }

  useEffect(() => {
    setQuillModule({
      ...modules,
      // todo
      // imageResize: {
      //   parchment: Quill.import('parchment'),
      //   modules: ['Resize', 'DisplaySize'],
      // },
    })
  }, [modules])

  useEffect(() => {
    if (quillModule.toolbar) {
      if (typeof quillRef === 'function') return
      quill = quillRef?.current!.getEditor()!
      if (!quill) return
      upLoadNum = 0
      const toolbar = quill.getModule('toolbar')
      toolbar.addHandler('image', handelImageUpload)
      setTimeout(() => { // 自定义图片会清楚图片自身的width 晚点注册
        Quill.register(EmojiBlot);
      }, 1000);
    }
  }, [quillModule])

  useEffect(() => {
    if (!quill) return
    // @ts-ignore
    quill.root.onfocus = onFocus
    // @ts-ignore
    quill.root.onblur = onBlur
  }, [Math.random()])

  if (!quillModule.toolbar) {
    return <></>
  }

  return withNativeProps(props,
    <ReactQuill
      ref={quillRef}
      placeholder={placeholder}
      onKeyDown={(e) => richKeyDown && richKeyDown(e)}
      className="!p-16 !pt-20 !text-14 leading-[1.5]"
      value={initialValue}
      onChange={(value: string) => {
        onInput(value);
      }}
      modules={quillModule}
    />
  )
}

export default forwardRef(RichQuill);
