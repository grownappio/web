import React, { useState, useRef, useEffect, useMemo, useCallback, ReactNode, forwardRef, RefObject } from 'react'
import ReactQuill from 'react-quill'
import autoAnimate from '@formkit/auto-animate'
import { ReactSVG } from 'react-svg'
import RichQuillEditor from '@/components/RichQuillEditorNew'
import { checkCompletionTopic } from '@/components/RichQuillEditorNew/publicmethod'
import Emoji from '../RichInput/Emoji'
import OccupyBox from '../OccupyBox'
import UploadImage from '../UploadImage'
import styles from './index.module.less'
import './index.less'

import AaIcon from '@/assets/img/publish/Aa.svg'
import cutCiagramIcon from '@/assets/img/publish/cut-diagram.svg'
import emojiIcon from '@/assets/img/publish/emoji.svg'
import dividerIcon from '@/components/RichQuillEditorNew/img/divider.svg'
import topicIcon from '@/assets/img/publish/topic.svg'
import { isIOS } from '@/units/platform'

interface PropsAddQuestionComponent {
  value: string
  onInput: (value: string) => void
  placeholder: string
  insertTopic: (value: string) => void
  showCount?: boolean
  minlength?: number
  maxlength?: number
  children?: ReactNode
  actions?: string[]
  onFocus?(): void
  onBlur?(): void
}

let timer: NodeJS.Timeout

const isRange = (v: number, min: number, max: number) => v >= min && v <= max

function getText(html: string) {
  const el = document.createElement('div')
  el.innerHTML = html
  return el.textContent ?? ''
}

const Editor = (props: PropsAddQuestionComponent, ref: RefObject<ReactQuill>) => {
  const _ref = useRef(), quillRef = ref ?? _ref
  const occupyRef = useRef<HTMLDivElement>(null)

  const { value, onInput, insertTopic, minlength = 0, maxlength = Infinity } = props

  const textContent = getText(value)

  // children 动画
  const children = useRef<HTMLDivElement>(null)
  useEffect(() => {
    autoAnimate(children.current!)
  }, [])
  
  // 面板
  const [panel, _setPanel] = useState('')
  const setPanel = (e: string) => {e === panel ? _setPanel('') : _setPanel(e);setBottom(0)}

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
      unicode,
      alt: unicode
    })
    quill.setSelection(currentPosition + 1, 0)
  }

  // outside 隐藏面板
  useEffect(() => {
    const hidePanel = (e: Event) => e.composedPath().includes(occupyRef.current!) || setPanel('')
    window.addEventListener('touchstart', hidePanel)
    return () => window.removeEventListener('touchstart', hidePanel)
  }, [])

  // 插入分割线
  const addDivider = () => {
    const quill = quillRef.current!.getEditor()
    quill.focus()
    const currentPosition = quill.getSelection()?.index || 0
    quill.insertEmbed(currentPosition, 'AppDividerEmbed', '')
    quill.setSelection(currentPosition + 1, 0)
    quill.insertText(currentPosition + 1, '\r\n')
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
      <div id='toolbar' className={'grid grid-cols-4 gap-y-16 !p-16 !border-0 !after:!hidden ' + styles.toolbar}>
        <select className='ql-header col-span-full rounded-8 after:b-l-0'>
          <option value='4'>Text</option>
          <option value='1'>H1</option>
          <option value='2'>H2</option>
          <option value='3'>H3</option>
        </select>
        <button className='ql-bold rounded-l-8 after:b-l-0'></button>
        <button className='ql-italic'></button>
        <button className='ql-underline'></button>
        <button className='ql-strike rounded-r-8'></button>
        <button className='ql-list rounded-l-8 after:b-l-0' value='ordered'></button>
        <button className='ql-list' value='bullet'></button>
        <button className='ql-indent' value='+1'></button>
        <button className='ql-indent rounded-r-8' value='-1'></button>
        <button className='ql-blockquote rounded-l-8 after:b-l-0'></button>
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

  const [bottom, setBottom] = useState(0)

  const onScroll = useCallback(() => {
    quillRef.current!.blur()
    setBottom(0)
  }, [])

  return (
    <>
      <RichQuillEditor
        ref={quillRef}
        modules={modules}
        initialValue={value}
        placeholder={props.placeholder}
        richKeyDown={richKeyDown}
        onInput={onInput}
        onFocus={() => {
          setPanel('')
          // 解决 ios 键盘遮挡问题
          if (!isIOS) return
          clearTimeout(timer)
          timer = setTimeout(() => {
            const bottom = window.innerHeight - window.visualViewport!.height
            setBottom(bottom)
            window.addEventListener('scroll', onScroll, { once: true })
          }, 700)
          props.onFocus?.()
        }}
        onBlur={() => {
          clearTimeout(timer)
          requestAnimationFrame(() => {
            document.documentElement.scrollTop++
            document.documentElement.scrollTop--
            setBottom(0)
          })
          window.removeEventListener('scroll', onScroll)
          props.onBlur?.()
        }}
      />

      <OccupyBox ref={occupyRef} className='fixed left-0 w-full bg-white' style={{ bottom: bottom + 'px' }} safe={ bottom ? undefined : 'bottom' }>
        {
          props.showCount
          &&
          <div className={`m-16 text-right opacity-60 ${ textContent.length && !isRange(textContent.length, minlength, maxlength) && 'text-error' }`}>
            Word count: { textContent.length }
          </div>
        }

        <div ref={children}>
          {props.children}
        </div>

        <div className='flex p-12 space-x-12 b-t-1 border-text/5 bg-[#F5F6F7] [&>*]:w-26 [&>*]:h-26 [&>*]:p-4 [&>*]:rounded-4'>
          {
            [
              { key: 'Aa', icon: AaIcon },
              { key: 'img', icon: cutCiagramIcon, onClick: uploadImage },
              { key: 'emoji', icon: emojiIcon },
              { key: 'topic', icon: topicIcon, onClick: () => insertTopic('##\xa0') },
            ]
            .filter(e => !props.actions?.length || props.actions.includes(e.key))
            .map((e, i) => (
              <ReactSVG key={i} className={`active-shadow ${panel === e.key && 'text-primary'}`} src={e.icon} onClick={() => (e.onClick ?? setPanel)(e.key)} />
            ))
          }
        </div>

        <div className={`${panel !== 'Aa' && 'hidden'}`}><CustomToolbar /></div>
        {/* onSelect={selectEmojiIcon} */}
        {<Emoji className={panel !== 'emoji' ? 'hidden' : ''} inputRef={() => quillRef.current?.editor?.root} />}
      </OccupyBox>
    </>
  )
}

// @ts-ignore
export default forwardRef(Editor)
