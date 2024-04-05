import React, { useRef, useState, useEffect } from "react";
import { message } from "antd";
import { emoticonConversion } from "@/components/RichQuillEditorNew/publicmethod";
import { addTopic } from "@/components/RichQuillEditorNew/publicmethod";
import { useData } from "@/reducer";
import { closeTopicTip } from "@/pages/publish/utils";
import TopicTip from "@/components/TopicTip";
import { getUrlHashParam, getPlainText, characterConversionIcon, iconConversionCharacter, format_rich_text__br } from "@/units/index";
import { getQaDetail, qaHomeAdd, qaHomeEdit } from "../service";
import { growQAPageDetail } from "../../growDetail/service";
import Editor from "@/components/Edtor";
import Appbar from "@/components/Appbar";
import { Prompt, useHistory } from "react-router-dom";
import autoAnimate from "@formkit/auto-animate";
import ReactQuill from "react-quill";
import ButtonSeed from "@/components/SeedButton";
import { useRequest } from 'ahooks'

import closeIcon from './close.svg'
import answerIcon from "@/assets/img/publish/answer-icon.svg";
import questionIcon from "@/assets/img/publish/question-icon.svg";
import QuestionPopup from "./QuestionPopup";
import { Popup } from "antd-mobile";

const FullAnswer = () => {
  const history = useHistory()
  const quillRef = useRef<ReactQuill>(null);
  const aniEl = useRef(null);
  const state = useData();
  const [qa, setQA] = useState<any>({})
  const [initialValue, setInitialValue] = useState<any>(''); // 答案初始数据
  const [questionTitle, setQuestionTitle] = useState<string>(''); // 问题标
  const [description, setDescription] = useState<any>(''); // 问题描述
  const [params] = useState<any>(getUrlHashParam());
  const isEdit = !!(+params.answer_id); // 是否是答案标记
  const [moreFlag, setMoreFlag] = useState(false)
  const [topicTipVisbile, setTopicTipVisbile] = useState<boolean>(false);
  const [topicTipPosition, setTopicTipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  const getText1 = (str: string) => {
    return str.replace(/<[^<>]+>/g, "").replace(/&nbsp;/gi, "");
  }

  const postable = getPlainText(initialValue)?.length >= 20

  const getText = (str: string) => {
    if (!str) return
    // 去除图片 与 style内联样式
    return characterConversionIcon(str.replace(/\s+style="[^"]*"/g, ''))
  }

  const getQuestionInfo = async () => {
    try {
      const result = await getQaDetail({ id: Number(params.id) });
      if (result?.code === 200) {
        setQuestionTitle(result?.data?.context || '')
        setDescription(result?.data?.description || '')
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getAnswerInfo = async (id: number) => {
    try {
      const { data } = await growQAPageDetail({ id, is_edit: true });
      setQuestionTitle(data?.question_detail?.context || '');
      setDescription(data?.question_detail?.description || '');
      setInitialValue(data?.answer_detail?.context);
      setQA(data)
      setTimeout(() => {
        // // 富文本表情与图片渲染冲突 先渲染完图片在 转化表情
        emoticonConversion(quillRef);
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  }

  const post = useRequest(async () => {
    const tempMethod = isEdit ? qaHomeEdit : qaHomeAdd;
    const tempParams: { type: number; context: string; id?: number; answer_id?: number } = {
      type: 2,
      context: format_rich_text__br(iconConversionCharacter(initialValue)),
    }
    if (isEdit) { // 编辑答案的时候 传的答案id
      tempParams.id = Number(params.answer_id);
    } else { // 回答问题时传的问题id
      tempParams.answer_id = Number(params.id);
    }
    return await tempMethod(tempParams);
  }, { manual: true })

  const onSucceed = (response: any) => {
    if (isEdit) {
      message.success('Answer edited successfully', 1, () => {
        history.goBack()
      });
    } else {
      history.replace(`/growDetail?id=${response.data?.qa_id}`)
      message.success('Answer successfully');
    }
  }

  const inserTopicTip = () => {
    const quill = quillRef.current!.getEditor();
    quill.focus();
    const p = quill.getSelection()?.index || 0;
    quill.formatText(p - 1, 1, 'TopicEmbed', true, 'api')
    quill.setSelection(p + 1, 0);
    setTimeout(() => {
      const richTopicRef = document.querySelector('.rich-topic') as HTMLElement;
      if (richTopicRef) {
        const top = richTopicRef.offsetTop - document.documentElement.scrollTop - 30;
        const left = richTopicRef.offsetLeft - 50;
        setTopicTipPosition({ top, left });
        setTopicTipVisbile(true);
      }
    }, 100);
  }

  const richContentChange = async (value: string) => {
    if (value.indexOf('#') !== -1 && state.topicTipSwitch) {
      closeTopicTip();
      setInitialValue(value);
      inserTopicTip()
    } else {
      setInitialValue(value);
    }
  }

  useEffect(() => {
    if (params.id) { // 回答问题 获取问题详情
      getQuestionInfo();
    }
    if (+params.answer_id) { // 编辑答案 获取答案信息
      getAnswerInfo(+params.answer_id);
    }
    const answerContext = sessionStorage.getItem(`fullAnswer${params.id}`)
    if (answerContext) {
      setInitialValue(answerContext)
    }
  }, [])

  useEffect(() => {
    autoAnimate(aniEl.current!)
  }, [])

  return (
    <div>
      <Appbar
        className="sticky top-0 !pl-12 z-10"
        backArrow={<img className='w-24 h-24 active-shadow rounded-full' onClick={() => history.goBack()} src={closeIcon} alt="" />}
        right={<ButtonSeed className='py-4 w-64 h-[2em]' disabled={!postable} animated={!isEdit} onRequest={post.runAsync} onSucceed={onSucceed}>Post</ButtonSeed>}
      />

      <div className="flex m-16 mt-12">
        <img className="mt-1 mr-16 w-20 h-20" src={questionIcon} alt="" />
        <div ref={aniEl} className="flex-1">
          <div className='text-16 line-clamp-4' dangerouslySetInnerHTML={{ __html: questionTitle || '' }} />
          {/* {
            moreFlag
            &&
            <div className="ql-editor grow-ql-editor mt-16" dangerouslySetInnerHTML={{ __html: getText(description) || '' }} />
          } */}
          {
            !!description.length
            &&
            <div className="mt-12 text-primary font-medium" onClick={() => setMoreFlag(e => !e)}>
              {/* { !moreFlag ? 'View More >' : 'Put away' } */}
              { 'View More >' }
            </div>
          }
          </div>
      </div>

      <div className="flex m-16 mt-20">
        <img className="row-span-3 w-20 h-20" src={answerIcon} alt="" />
          <div className="flex-1 w-0 -mt-19">
            <Editor
              ref={quillRef}
              value={initialValue}
              onInput={richContentChange}
              showCount
              minlength={20}
              placeholder="Please write you answer, we would love to see your opinion."
              insertTopic={() => addTopic('## ', 'button', quillRef)}
            />
          </div>
          <TopicTip position={topicTipPosition} modalVisible={topicTipVisbile} />
          {/* todo > getPlainText(initialValue).length */}
        </div>

        <Prompt
          when={!post.data && !!getText1(initialValue.trim()) && qa.answer_detail?.context !== initialValue}
          message={(location, action) => {
            return JSON.stringify({
              action,
              location,
              curHref: history.location.pathname + history.location.search,
              message: "This can't be undone and you'll lose your changes.",
            });
          }}
        />

        <QuestionPopup visible={moreFlag} title={questionTitle} description={description} onClose={() => setMoreFlag(false)} />
    </div>
  )
}

export default FullAnswer;