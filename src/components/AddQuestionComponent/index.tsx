import React, { useState, useRef, useEffect, useMemo, useCallback, ReactNode } from 'react'
import ReactQuill from 'react-quill'
import autoAnimate from '@formkit/auto-animate'
import { useData } from '@/reducer'
import { composedPath } from '@/units'
import { ReactSVG } from 'react-svg'
import { colorData } from '../RichQuillEditorNew/data.d'
import RichQuillEditor from '@/components/RichQuillEditorNew'
import { checkCompletionTopic } from '@/components/RichQuillEditorNew/publicmethod'
import TopicTip from '@/components/TopicTip'
import Emoji from '../RichInput/Emoji'
import OccupyBox from '../OccupyBox'
import styles from './index.module.less'

import AaIcon from '@/assets/img/publish/Aa.svg'
import cutCiagramIcon from '@/assets/img/publish/cut-diagram.svg'
import emojiIcon from '@/assets/img/publish/emoji.svg'
import dividerIcon from '@/components/RichQuillEditorNew/img/divider.svg'
import topicIcon from '@/assets/img/publish/topic.svg'
import UploadImage from '../UploadImage'

interface PropsAddQuestionComponent {
  text: string
  insertTopic: (value: string) => void
  changeText: (value: string) => void
  children?: ReactNode
}

const AddQuestionComponent = (props: PropsAddQuestionComponent) => {
  const { text, changeText, insertTopic } = props
  const quillRef = useRef<ReactQuill>(null)
  
  // children 动画
  const children = useRef<HTMLDivElement>(null)
  useEffect(() => {
    autoAnimate(children.current!)
  }, [])
  
  // 新的富文本逻辑
  const [panel, setPanel] = useState('Aa')

  const uploadImage = async () => {
    const url = await UploadImage()
    const quill = quillRef.current!.getEditor()
    quill.focus()
    const currentPosition = quill.getSelection()?.index || 0
    quill.insertEmbed(currentPosition, 'image', url)
    quill.setSelection(currentPosition + 1, 0)
  }

  // 点击表情，将表情添加到输入框
  const selectEmojiIcon = (unicode: string, src: string) => {
    const quill = quillRef.current!.getEditor()
    quill.focus()
    const currentPosition = quill.getSelection()?.index || 0
    quill.insertEmbed(currentPosition, 'simpleImg', {
      url: src,
      class: 'iconImgDiv',
      id: 'icon',
      unicode
    })
    quill.setSelection(currentPosition + 1, 0)
  }

  // 插入分割线
  const addDivider = () => {
    const quill = quillRef.current!.getEditor()
    quill.focus()
    const currentPosition = quill.getSelection()?.index || 0
    quill.insertEmbed(currentPosition, 'AppDividerEmbed', '')
    quill.setSelection(currentPosition + 1, 0)
    quill.insertText(currentPosition + 1, '\r\n')
    quill.insertText(currentPosition + 1, '\r\n')
  }

  function onFocus() {
    setPanel('')
  }

  function onBlur() {
    
  }

  const richKeyDown = (e: any) => {
    switch (e.key) {
      case '#':
        checkCompletionTopic(quillRef)
        break
    }
  }

  // 自定义的 toolbar
  const CustomToolbar = useCallback(() => (
      <div id='toolbar' className={'grid grid-cols-4 gap-y-16 !p-16 !border-0 divide-y-0 divide-x-1 divide-text/5 ' + styles.toolbar}>
        <select className='!text-18 ql-header col-span-full rounded-8'>
          <option value='4'>Text</option>
          <option value='1'>H1</option>
          <option value='2'>H2</option>
          <option value='3'>H3</option>
        </select>
        <button className='ql-bold rounded-l-8'></button>
        <button className='ql-italic'></button>
        <button className='ql-underline'></button>
        <button className='ql-strike rounded-r-8'></button>
        <button className='ql-list rounded-l-8' value='ordered'></button>
        <button className='ql-list' value='bullet'></button>
        <button className='ql-indent' value='+1'></button>
        <button className='ql-indent rounded-r-8' value='-1'></button>
        <button className='ql-blockquote rounded-l-8'></button>
        <button className='ql-code-block'></button>
        <button className={'ql-divider'}>
          <img onClick={addDivider} src={dividerIcon} alt='' />
        </button>
        <button className='ql-link rounded-r-8'></button>
        {/* <select className='ql-color'>
          {colorData.map((item) => {
            return <option key={item} value={item}></option>
          })}
        </select>
        <select className='ql-background'>
          {colorData.map((item) => {
            return <option key={item} value={item}></option>
          })}
        </select> */}
      </div>
    ),
    []
  )

  const modules = useMemo(
    () => ({
      toolbar: {
        container: '#toolbar'
      }
    }),
    []
  )

  const pasteHtml = (e: any) => {
    // 取消默认粘贴行为
    e.preventDefault()
    // 获取剪贴板数据
    const text = (e.originalEvent || e).clipboardData.getData('text/plain')
    const doc = new DOMParser().parseFromString(text, 'text/html')
    // 过滤 HTML 标记
    const sanitizedText = doc.body.textContent || ''
    // 在元素中插入过滤后的纯文本
    document.execCommand('insertText', false, sanitizedText)
  }

  return (
    <div className={styles['question-box']}>

      {/* 问题描述 */}
      <RichQuillEditor
        ref={quillRef}
        modules={modules}
        initialValue={text}
        placeholder='Describe the question for more answers.(Optional)'
        richKeyDown={richKeyDown}
        onInput={changeText}
      />

      <div ref={children} className='overflow-hidden'>
        {props.children}
      </div>

      <OccupyBox className='fixed bottom-0 w-full bg-white'>
        <div className='flex p-12 space-x-12 b-t-1 b-b-1 border-text/5 bg-[#F5F6F7] [&>*]:w-20 [&>*]:h-20 [&>*]:p-4 [&>*]:box-content [&>*]:rounded-4'>
          <ReactSVG className={`mr-10 active-shadow ${panel === 'Aa' && 'text-primary'}`} src={AaIcon} onClick={() => setPanel('Aa')} />
          <img className='' src={cutCiagramIcon} alt='' onClick={uploadImage} />
          <ReactSVG className={`active-shadow ${panel === 'emoji' && 'text-primary'}`} src={emojiIcon} onClick={() => setPanel('emoji')} />
          <img className='' src={topicIcon} alt='' onClick={() => insertTopic('##\xa0')} />
        </div>

        <div className={`${panel !== 'Aa' && 'hidden'}`}><CustomToolbar /></div>
        {panel === 'emoji' && <Emoji onSelect={selectEmojiIcon} />}
      </OccupyBox>
    </div>
  )
}

export default AddQuestionComponent
