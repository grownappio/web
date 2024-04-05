import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from "react";
import { message } from "antd";
import { DataContext, useData } from '@/reducer/index';
import ReactQuill from "react-quill";
import RichQuillEditor from "@/components/RichQuillEditorNew";
import { checkCompletionTopic, addTopic } from "@/components/RichQuillEditorNew/publicmethod";
import TopicTip from "@/components/TopicTip";
import { closeTopicTip } from "@/pages/publish/utils";
import ButtonSeed from "@/components/SeedButton";
import { composedPath, iconConversionCharacter, getPlainText, format_rich_text__br } from "@/units/index";
import { Period } from '@/components/SeedButton/type';
import dividerIcon from "@/components/RichQuillEditorNew/img/divider.svg";
import topicIcon from "@/assets/img/publish/topic-rich.svg";
import { colorData } from "../RichQuillEditorNew/data.d";
import emoji from "@/assets/emoji/emoji.json";
import UploadImage from "@/components/UploadImage";
import answerClose from "@/assets/img/publish/answer-close.svg";
import answerIcon from "@/assets/img/publish/answer-icon.svg";
import questionIcon from "@/assets/img/publish/question-icon.svg";
import AaIcon from "@/assets/img/publish/Aa.svg";
import AaSelectIcon from "@/assets/img/publish/Aa-select.svg";
import cutCiagramIcon from "@/assets/img/publish/cut-diagram.svg";
import fullScreenIcon from "@/assets/img/publish/full-screen.svg";
import emojiIcon from "@/assets/img/publish/emoji.svg";
import Emoji from "@/pages/grow/components/Emoji";
import styles from "./index.module.less";
import { getQaDetail, qaHomeAdd } from "./service";
export type PropsAnswerQuestion = {
  questionId: number;
  answerQuestionFlag: boolean;
  setAnsweQuestionFlag: (value: boolean) => void;
  answerSuccess?: (id: number) => void;
}
const AnswerQuestion = (props: PropsAnswerQuestion) => {
  const { answerQuestionFlag, setAnsweQuestionFlag, questionId, answerSuccess } = props;
  const { dispatch } = useContext<any>(DataContext);
  const state = useData();
  const lookBoxRef = useRef();
  const lookBtnRef = useRef(null);
  const quillRef = useRef<ReactQuill>(null);
  const [initialValue, setInitialValue] = useState<any>('');
  const [questionText, setQuestionText] = useState<string>('');
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [emojiArr] = useState<any>(emoji.icon);
  const [emojiReplayFlag, setEmojiReplayFlag] = useState<boolean>(false);
  const [answerQuestionVisible, setAnswerQuestionVisible] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [emojiPosition, setEmojiPosition] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const [aFlag, setAflag] = useState<boolean>(true);
  const [topicTipVisbile, setTopicTipVisbile] = useState<boolean>(false);
  const [topicTipPosition, setTopicTipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  const getText = (str: string) => {
    return str.replace(/<[^<>]+>/g, "").replace(/&nbsp;/gi, "");
  }

  const isNull = (str: string) => {
    if (str === "") return true;
    const regu = "^[ ]+$";
    const re = new RegExp(regu);
    return re.test(str);
  }

  const uploadImage = async () => {
    const value = await UploadImage()
    const quill = quillRef.current!.getEditor();
    quill.focus();
    const currentPosition = quill.getSelection()?.index || 0
    quill.insertEmbed(currentPosition, 'image', value);
    quill.setSelection(currentPosition + 1, 0);
  }

  // 点击表情，将表情添加到输入框
  const selectEmojiIcon = (unicode: string) => {
    const imgUrl = require(`../../assets/emoji/icon/${unicode}.png`);
    const quill = quillRef.current!.getEditor();
    quill.focus();
    const currentPosition = quill.getSelection()?.index || 0;
    quill.insertEmbed(currentPosition, 'simpleImg', {
      url: imgUrl,
      class: 'iconImgDiv',
      id: 'icon',
      unicode
    })
    quill.setSelection(currentPosition + 1, 0);
  }

  // const countSpecial = (index: number, lastIndex: number) => {
  //   const quill = quillRef?.current.getEditor();
  //   const delta = quill.getContents();
  //   // 获取上一个节点到当前节点的 delta
  //   const restDelta = delta.slice(lastIndex, index);
  //   let specialArray: any = [];
  //   const initValue = specialArray.length
  //     ? specialArray[specialArray.length - 1]
  //     : 0;
  //   const num = restDelta.reduce((num: any, op: any) => {
  //     if (typeof op.insert === 'object') {
  //       return num + 1;
  //     }
  //     return num;
  //   }, initValue);
  //   specialArray.push(num);
  //   return num;
  // };

  // 插入分割线
  const addDivider = () => {
    const quill = quillRef.current!.getEditor();
    quill.focus();
    const currentPosition = quill.getSelection()?.index || 0;
    quill.insertEmbed(currentPosition, 'AppDividerEmbed', '')
    quill.setSelection(currentPosition + 1, 0);
    quill.insertText(currentPosition + 1, '\r\n');
  }

  const handleClick = (event: any) => {
    if (!composedPath(event)) return
    const arr = [
      lookBtnRef.current
    ]
    if (!composedPath(event).includes(lookBtnRef.current) && arr.indexOf(event.target) === -1) {
      setEmojiReplayFlag(false);
    }
  }

  const handleScroll = () => {
    setEmojiReplayFlag(false);
  }

  const getQuestionInfo = async (id: number) => {
    try {
      const result = await getQaDetail({ id });
      if (result?.code === 200) {
        setQuestionText(result?.data?.context)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const toFullAnswer = () => {
    sessionStorage.setItem(`fullAnswer${questionId}`, initialValue);
    const questionIdObj = state.winObj;
    setAnsweQuestionFlag(false);
    window.name = '_self'
    questionIdObj[questionId] = window.open(`${window.location.origin}${window.location.pathname}#/fullAnswer?id=${questionId}`, `windowName${questionId}`);
    dispatch({
      type: 'changeWinObj',
      value: questionIdObj
    })
  }

  const confirmAnswer = async () => {
    return qaHomeAdd({
      type: 2,
      context: format_rich_text__br(iconConversionCharacter(initialValue)),
      answer_id: questionId
    })
  }

  const onSucceed = (response: any) => {
    message.success('Answer successfully');
    answerSuccess && answerSuccess(Number(response?.data?.qa_id));
    setAnsweQuestionFlag(false);
  }

  // 自定义的 toolbar
  const CustomToolbar = useCallback(() => (
    <div id="toolbar">
      <select className="ql-header">
        <option value="4">Text</option>
        <option value="1">H1</option>
        <option value="2">H2</option>
        <option value="3">H3</option>
      </select>
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-underline"></button>
      <button className="ql-strike"></button>
      <button className="ql-blockquote"></button>
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
      <button className="ql-indent" value="-1"></button>
      <button className="ql-indent" value="+1"></button>
      <button className="ql-code-block"></button>
      <button className={'ql-divider'}>
        <img onClick={addDivider} src={dividerIcon} alt="" />
      </button>
      <button className="ql-link"></button>
      <select className="ql-color">
        {
          colorData.map((item) => {
            return (
              <option key={item} value={item}></option>
            )
          })
        }
        {/* <option selected></option> */}
      </select>
      <select className="ql-background">
        {
          colorData.map((item) => {
            return (
              <option key={item} value={item}></option>
            )
          })
        }
        {/* <option selected></option> */}
      </select>
    </div>
  ), []);

  const modules = useMemo(() => ({
    toolbar: {
      container: '#toolbar',
    }
  }), []);

  // const checkTopic = () => {
  //   const quill = quillRef?.current.getEditor();
  //   quill.focus();
  //   const totalText = quill.getText();
  //   const indices = [];
  //   let specialNum = 0
  //   let index = totalText.indexOf('#');
  //   while (index !== -1) {
  //     // 计算 从最初到 index 有多少个特殊 insert
  //     const tempSpecialNum = countSpecial(index, indices.length ? indices[indices.length - 1].index : 0);
  //     index = index + tempSpecialNum;
  //     indices.push({ index: index + specialNum, specialNum: tempSpecialNum });
  //     specialNum = specialNum + tempSpecialNum;
  //     // 最后记录搜索到的坐标
  //     index = totalText.indexOf('#', index + 1); // 从字符串出现的位置的下一位置开始继续查找
  //   }
  //   if (!indices.length) return
  //   const arr: any = []; // 判断有几种话题组合
  //   let tempArr: any = [];
  //   // 判断有几种话题组合
  //   for (let i = 0; i < indices.length; i += 1) {
  //     if (indices[i].specialNum) {
  //       tempArr = []
  //     }
  //     tempArr.push(indices[i])
  //     if (tempArr.length === 2) {
  //       arr.push(tempArr);
  //       tempArr = [];
  //     }
  //   }
  //   arr.forEach((item: any) => {
  //     if (item.length >= 2) {
  //       quill.formatText(item[0].index, item[1].index - item[0].index + 1, 'TopicEmbed', true, 'api');
  //     }
  //   });
  //   console.log(arr);
  // }

  const inserTopicTip = () => {
    const quill = quillRef.current!.getEditor();
    quill.focus();
    const currentPosition = quill.getSelection()?.index || 0;
    quill.formatText(currentPosition - 1, 1, 'TopicEmbed', true, 'api')
    quill.setSelection(currentPosition + 1, 0);
    setTimeout(() => {
      const richTopicRef: any = document.getElementsByClassName('rich-topic')[0];
      if (richTopicRef) {
        const top = richTopicRef?.offsetTop - document.documentElement.scrollTop - 10;
        const left = richTopicRef?.offsetLeft - 50;
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

  // const addTopic = (value: string, type: string) => {
  //   const quill = quillRef?.current.getEditor();
  //   quill.focus();
  //   const currentPosition = quill.getSelection()?.index || 0;
  //   quill.insertText(currentPosition, value);
  //   quill.setSelection(type === 'button' ? currentPosition + 1 : currentPosition);
  // }

  const handClose = () => {
    setAnsweQuestionFlag(false);
  }

  // 补全#
  // const checkCompletionTopic = () => {
  //   const quill = quillRef?.current.getEditor();
  //   const currentPosition = quill.getSelection()?.index || 0;
  //   const content = quill.getText(currentPosition);
  //   if (content.indexOf('#') === -1) {
  //     addTopic('# ', 'completion');
  //   }
  // }

  const richKeyDown = (e: any) => {
    switch (e.key) {
      case '#':
        checkCompletionTopic(quillRef);
        break
    }
  }

  useEffect(() => {
    if (answerQuestionFlag) {
      getQuestionInfo(questionId);
    } else {
      setInitialValue('');
    }
  }, [answerQuestionFlag, questionId])

  useEffect(() => {
    if (!answerQuestionFlag) {
      setTopicTipVisbile(false);
    }
    setTimeout(() => {
      setAnswerQuestionVisible(answerQuestionFlag)
    }, 100);
  }, [answerQuestionFlag]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
    }
  }, [])

  useEffect(() => {
    if (isNull(getText(initialValue))) {
      setAnswerCount(0);
    } else {
      setAnswerCount(getPlainText(initialValue).length);
    }
  }, [initialValue])
  return (
    <>
      {
        answerQuestionFlag
        &&
        <div className={styles['answer-question-mask']}>
          <div className={[styles['answer-box'], answerQuestionVisible ? styles.show : styles.hide].join(' ')}>
            <div className={styles['answer-header']}>
              <img onClick={handClose} src={answerClose} alt="" />
            </div>
            <div className={styles['question-content']}>``
              <img src={questionIcon} alt="" />
              <div className={styles['desc-box']} dangerouslySetInnerHTML={{ __html: questionText || '' }} />
            </div>
            <div className={styles['answer-content']}>
              <img className={styles['answer-icon']} src={answerIcon} alt="" />
              <div className={[styles['answer-inp-box'], inputFocus ? styles['inp-focus'] : ''].join(' ')}>
                <div className={[styles['quill-box'], answerCount ? '' : styles.nonescrool].join(' ')}>
                  <RichQuillEditor
                    richKeyDown={richKeyDown}
                    ref={quillRef}
                    modules={modules}
                    initialValue={initialValue}
                    placeholder="Please write you answer, we would love to see your opinion."
                    onFocus={() => { setInputFocus(true) }}
                    onBlur={() => setInputFocus(false)}
                    onInput={(value: string) => richContentChange(value)}
                  />
                  <TopicTip position={topicTipPosition} modalVisible={topicTipVisbile} />
                </div>
                <div className={[styles['bottom-btn'], aFlag ? styles.active : ''].join(' ')}>
                  {
                    answerCount
                      ?
                      <span className={[styles['answer-count'], answerCount >= 20 ? '' : styles.colorRed].join(' ')}>{answerCount}</span>
                      :
                      <span></span>
                  }
                  <div className={styles['a-box']}>
                    <img onClick={() => setAflag(!aFlag)} className={styles['a-icon']} src={aFlag ? AaSelectIcon : AaIcon} alt="" />
                  </div>
                  <CustomToolbar />
                  <div className={styles['upload-img-box']}>
                    <img src={cutCiagramIcon} alt="" onClick={uploadImage} />
                  </div>
                  <div className={styles['add-question-emoji']} onClick={(e: any) => {
                    if (!emojiReplayFlag) {
                      const { left, top, width } = e.target.getBoundingClientRect();
                      const emojiCurrent: any = lookBoxRef.current;
                      setEmojiPosition({
                        left: left - emojiCurrent?.offsetWidth / 2 + width / 2,
                        top: top - emojiCurrent?.offsetHeight - 10.7
                      })
                    }
                    setEmojiReplayFlag(!emojiReplayFlag);
                  }}>
                    <img ref={lookBtnRef} src={emojiIcon} alt="" />
                    <Emoji emojiPosition={emojiPosition} isTop={true} emojiArr={emojiArr} selectEmojiIcon={(unicode: string) => {
                      selectEmojiIcon(unicode)
                    }} ref={lookBoxRef} emojiFlag={emojiReplayFlag} />
                  </div>
                  <div onClick={() => addTopic('## ', 'button', quillRef)} className={styles['topic-btn']}>
                    <img src={topicIcon} alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles['mask-bottom']}>

              <div onClick={() => { toFullAnswer() }} className={styles['full-screen-box']}>
                <img src={fullScreenIcon} alt="" />
                <span>Full screen editing</span>
              </div>

              <div className={styles['btn-box']}>
                <div className={styles['publish-btn']}>
                  <ButtonSeed
                    text="Quick post"
                    stage={answerCount < 20 ? Period.DISABLED : Period.READY}
                    onRequest={confirmAnswer}
                    onSucceed={onSucceed}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default AnswerQuestion;