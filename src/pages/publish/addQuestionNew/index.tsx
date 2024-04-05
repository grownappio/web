import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import { useLocalStorage } from 'react-use'
import { useData } from '@/reducer'
import { iconConversionCharacter, checkTextHaveContent, getUrlHashParam, characterConversionIcon, delay } from '@/units'
import { setBrowerTabTitle } from '@/utils'
import { Prompt, useHistory } from 'react-router-dom'
import { closeTopicTip, dataLenTrim } from '../utils'
// import { tipExist, tipClose } from '../service'
// import closeTipIcon from '@/assets/img/publish/close-tip.svg'
// import topicIcon from '@/assets/img/publish/topic.svg'
import { qaHomeAdd, questionDetail, qaHomeEdit } from '../service'
import Appbar from '@/components/Appbar'
import TopicTip from '@/components/TopicTip'
import Editor from '@/components/Edtor'
import SeedButton from '@/components/SeedButton'

import CloseImg from "@/assets/img/profile/photoAlbum/del-mask-close.svg";

const AddQuestion = () => {
  const history = useHistory()
  const state = useData()
  const [params] = useState<{ [key: string]: string }>(getUrlHashParam())
  const [title, setTitle] = useState<string>('Add question')
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const [data, setData] = useState<any>({ question_detail: { description: '', context: '' } })
  const [questionTitle, setQuestionTitle] = useState<string>('')
  const [text, setText] = useState<string>('')
  const [actions, setActions] = useState<string[]>([])
  const [focused, setFocused] = useState(false)
  
  const [posted, setPosted] = useState(false)
  const isTips = useLocalStorage('add_question_new', true)
  const [topicTipVisbile, setTopicTipVisbile] = useState<boolean>(false)
  const [topicTipPosition, setTopicTipPosition] = useState({ top: 0, left: 0 })

  const len = dataLenTrim(questionTitle)
  const isDisabled = len < 10 || len > 200 || !/[?？]/.test(questionTitle)
  const error = (questionTitle.length && isDisabled) || (focused && !questionTitle.length)

  // const keepLastIndex = (obj: any, len: number) => {
  //   // 超过文本长度直接返回
  //   if (window.getSelection) {//ie11 10 9 ff safari
  //     obj.focus(); //解决ff不获取焦点无法定位问题
  //     var range: any = window.getSelection();//创建range
  //     range.selectAllChildren(obj);//range 选择obj下所有子内容
  //     range.collapseToEnd(); // 光标移至最后
  //   }
  // }

  const getText = (str: string) => {
    return str.replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '')
  }

  const isNull = (str: string) => {
    if (str === '') return true
    const regu = '^[ ]+$'
    const re = new RegExp(regu)
    return re.test(str)
  }

  const onPost = async () => {
    setPosted(true)
    const tempMethod = isEdit ? qaHomeEdit : qaHomeAdd
    const tempParams: { type: number; context: string; description: string; id?: number } = {
      type: 1,
      context: questionTitle.trim(),
      description: checkTextHaveContent(text) ? iconConversionCharacter(text) : ''
    }
    if (isEdit) {
      tempParams.id = Number(params.id)
    }
    return await tempMethod(tempParams)
  }

  const onSuccess = (response: any) => {
    message.success(`${isEdit ? 'Edit successfully' : 'Ask successfully'}`)
    if (isEdit) {
      history.goBack()
      return
    }
    history.replace(`/questionDetail?id=${response?.data?.qa_id}`)
  }
  // 插入topicTip标签
  const inserTopicTip = () => {
    const richTopicRef = document.querySelector('.rich-topic') as HTMLElement
    if (!richTopicRef) return
    const { bottom: top, left } = richTopicRef.getBoundingClientRect()
    setTopicTipPosition({ top, left })
    richTopicRef.remove()
    setTopicTipVisbile(true)
  }
  // 打开topic提示
  const openTopicTip = () => {
    closeTopicTip()
    const rangeTopic = window.getSelection()?.getRangeAt(0)
    const node = rangeTopic?.createContextualFragment(`<span class="rich-topic" />`)
    rangeTopic?.insertNode(node!)
    inserTopicTip()
  }
  // 补全#
  const checkCompletionTopic = () => {
    var sel = window.getSelection()!
    var iEnd = sel.anchorOffset
    var htmldata = sel.anchorNode?.textContent || ''
    if (htmldata.indexOf('#', iEnd) === -1) {
      insertTopic('# ')
    }
  }
  // 监听问题标题数据变化
  const questionTitleChange = (value: string) => {
    if (!questionTitle.length && value !== '#') {
      setQuestionTitle(`${value}?`)
      window.getSelection()!.anchorNode!.textContent += '?'
      setCaretPosition(1)
    } else {
      setQuestionTitle(value)
    }
  }

  // 设置光标
  const setCaretPosition = (position: number) => {
    const range = document.createRange()
    range.setStart(window.getSelection()!.anchorNode!, position)
    range.collapse(true)
    const selection = window.getSelection()!
    selection.removeAllRanges()
    selection.addRange(range)
  }

  // 光标处插入内容
  const insertTopic = async (value: string, index = 0) => {
    document.getElementById('textareaid')!.focus()
    await delay(0)
    const sel = window.getSelection()!
    var p = sel.anchorOffset
    
    var htmldata = sel.anchorNode!.textContent || ''
    
    if (htmldata) {
      sel.anchorNode!.textContent = `${htmldata.substring(0, p)}${value}${htmldata.substring(p)}`
    } else {
      sel.anchorNode!.textContent = value
      // 选择文本
      const range = document.createRange()
      range.setStart(sel.anchorNode!.firstChild!, 0)
      sel.removeAllRanges()
      sel.addRange(range)
    }

    setCaretPosition(p + index)
    
    const textArea = document.getElementById('textareaid')!
    setQuestionTitle(textArea.innerText)
    if (state.topicTipSwitch) {
      openTopicTip()
    }
  }

  const questionDescChange = (value: string) => {
    setText(value === '<p><br></p>' ? '' : value)
  }

  // todo
  // const getIsTip = async () => {
  //   try {
  //     const result = await tipExist()
  //     if (result.code === 200) {
  //       setTipFlag(!result?.data.Closed)
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // todo
  // const handleCloseTipOnClick = async () => {
  //   try {
  //     const result = await tipClose()
  //     if (result.code === 200) {
  //       setTipFlag(false)
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // 编辑时 获取问题详情
  const getQuestionInfo = async (id: number) => {
    try {
      const { data } = await questionDetail({ id, is_edit: true })
      if (!data) return
      data.question_detail.description ||= characterConversionIcon(data.question_detail.description)
      setData(data)

      setQuestionTitle(data.question_detail.context)
      document.getElementById('textareaid')!.innerText = data.question_detail.context ?? ''
      setText(data.question_detail.description)
    } catch (err) {
      console.log(err)
    }
  }
  // 监听输入#号键
  const documentKeyMethod = (e: any) => {
    switch (e.key) {
      case '#':
        checkCompletionTopic()
        break
    }
  }

  // 获取跳转路径
  const getCurHref = () => {
    // isEdit ? `/addQuestion?id=${params.id}` : '/addQuestion'
    let path = ''
    if (isEdit) {
      path = `/addQuestion?id=${params.id}`
    } else {
      path = params.topic ? `/addQuestion?topic=${escape(params.topic)}` : '/addQuestion'
    }
    return path
  }

  useEffect(() => {
    if (params.id) {
      setIsEdit(true)
      getQuestionInfo(Number(params.id))
      setTitle(`Edit Question #${params.id}`)
      setBrowerTabTitle(`Edit Question #${params.id} / Grown`)
    } else {
      setIsEdit(false)
    }
    if (params.topic) {
      setQuestionTitle(`${unescape(params?.topic)} `)
      const myTextArea: any = document.getElementById('textareaid')
      myTextArea.innerText = `${unescape(params.topic)}\xa0`
    }
  }, [params])

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
    <div>
      <Appbar className='b-b-1' title={title} right={<SeedButton className='btn-primary w-64 h-28' disabled={isDisabled} animated onRequest={onPost} onSucceed={onSuccess}>Post</SeedButton>} />

      <div className={`relative mx-16 py-16 pb-43 group `}>
        {/* question title */}
        <div
          id='textareaid'
          className={`min-h-50 box-content text-16 empty:after:content-[attr(placeholder)] after:text-text/30 !outline-0`}
          contentEditable={true}
          placeholder='Ask question you want to discuss with others or that interest you.'
          onKeyDown={documentKeyMethod}
          onInput={(e: any) => {
            questionTitleChange(e.target.innerText)
          }}
          onPaste={(e) => {
            pasteHtml(e)
          }}
          onFocus={async () => { await delay(50); setActions(['topic'])}}
          onBlur={async () => { await delay(50); setActions([])}}
        />

        {/* 分割线 */}
        <div contentEditable={false} className={`absolute bottom-0 left-0 right-0 flex justify-between pb-8 text-text/60 b-b-1 border-text/8 ${questionTitle && 'group-hover:border-primary'} ${error && '!text-error !border-[#FF3D00]'}`}>
          <span className=''>{questionTitle && !/[?？]/.test(questionTitle) ? 'The question needs to have a “?”' : ''}</span>
          <span className=''>{error ? len : (len || '')}</span>
        </div>
      </div>


      <TopicTip position={topicTipPosition} modalVisible={topicTipVisbile} />
      
      <Editor
        value={text}
        onInput={questionDescChange}
        placeholder='Describe the question for more answers.(Optional)'
        showCount={true}
        insertTopic={e => insertTopic(e, 1)}
        actions={actions}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {
          isTips[0]
          &&
          <div className='relative m-16 p-16 leading-[1.65] text-12 text-text/60 bg-[#F6F9FC] rounded-6'>
            <img className='absolute top-8 right-8 w-24 h-24 rounded-6 opacity-80' src={CloseImg} alt='' onClick={() => setTimeout(() => isTips[1](false), 100)} />
            <p>Tips:</p>
            <p>1. More rewards for good and popular question.</p>
            <p>2. Question that violate community content governance regulations are not welcome.</p>
          </div>
        }
      </Editor>

      <Prompt
        when={
          posted ? false :
          data.question_detail.description === text && data.question_detail.context === questionTitle ? false :
          (!isNull(getText(text)) || !!questionTitle.trim())
        }
        message={(location, action) => {
          return JSON.stringify({
            action,
            location,
            curHref: getCurHref(),
            message: "This can't be undone and you'll lose your changes.",
          });
        }}
      />
    </div>
  )
}

export default AddQuestion
