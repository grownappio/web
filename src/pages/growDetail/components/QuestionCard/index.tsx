import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { calculationThousand, formatPublishTime, getImgSrc, characterConversionIcon } from "@/units/index";
import { toEditAnswer } from "../../../grow/comment";
import styles from "./index.module.less";
import { Modal } from "antd-mobile";
import QuestionPopup from "@/pages/publish/fullAnswer/QuestionPopup";

import fabulousImg from '@/assets/img/grow/fabulous.svg';
import fabulousSelectImg from '@/assets/img/grow/fabulous-select.svg';
import browseImg from '@/assets/img/grow/browse.svg';
import collectionImg from '@/assets/img/grow/collection.svg';
import collectionSelectImg from '@/assets/img/grow/collection-select.svg';
import shareImg from '@/assets/img/grow/share.svg';
import arrowImg from '@/assets/img/arrow.svg';
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { ReactSVG } from "react-svg";

export type QuestionCardProps = {
  questionData: any;
  type: string; // answer question
  answerSuccess: (id: number) => void;
  operationFabulous: (id: number, type: number) => void;
  operationSubscripe: (id: number, type: boolean) => void;
}

const QuestionCard = (props: QuestionCardProps, ref: any) => {
  const conRef = useRef(null);
  const history = useHistory();
  const { pathname } = useLocation();
  const { questionData, operationSubscripe, operationFabulous, answerSuccess, type } = props;

  const [displayText, setisDisplayText] = useState(false);
  const [visible, setVisible] = useState(false);

  const toQuestionDetail = (e: any, id: number) => {
    if (e.target.localName === 'a') { // 点击标签为a标签时 阻止冒泡
      return
    }
    if (pathname === '/questionDetail') return
    history.push(`/questionDetail?id=${id}`)
  }

  // 判断是否超过两个p标签
  const checkThanTwoP = (str: string) => {
    if (!str) return false
    let count = 0;
    const reg = new RegExp(`<p(?:(?!</p>).|\n)*?</p>`, 'gm');
    // @ts-ignore
    str.replace(reg, (str: any) => {
      count += 1
    })
    return count > 1
  }

  const getFirstPContent = (str: string) => {
    // const reg = /<p(?:(?!<\/p>).|\n)*?<\/p>/gm;
    if (!str) return '';
    let pArr: string[] = []
    const reg = new RegExp(`<p(?:(?!</p>).|\n)*?</p>`, 'gm');
    // @ts-ignore
    str.replace(reg, (str: string) => {
      pArr.push(str)
    })
    let tempStr = ''
    for (let i = 0; i < pArr.length; i += 1) {
      if (pArr[i].replace(/<[^>]+>/g, "")) {
        tempStr = pArr[i];
        break
      }
    }
    const reTag = /<img(?:.|\s)*?>/g;
    // 去除分割线
    const regDivider = new RegExp('<span[^>]*?class="divider"[^>]*>(.*?)</span>', 'g');
    // 去除图片 与 style内联样式
    return characterConversionIcon(tempStr.replace(reTag, '').replace(/\s+style="[^"]*"/g, '').replace(regDivider, ''));
  }

  const getText = (str: string) => {
    if (!str) {
      return
    }
    const tempStr = str;
    // 去除style内联样式
    return characterConversionIcon(tempStr.replace(/\s+style="[^"]*"/g, ''))
  }

  const openAnswerEdit = (id: number) => {
    toEditAnswer(id);
  }


  useEffect(() => {
    setTimeout(() => {
      let conDOm: any = conRef.current;
      if (conDOm) {
        const offsetH = conDOm.offsetHeight;
        const srollH = conDOm.scrollHeight;
        // 会有2px的偏差
        if ((srollH - 2) > offsetH) {
          setisDisplayText(true);
        }
      }
    }, 100);
  }, [questionData.description])

  return (
    <>
      {
        questionData?.show_type === 2
          ?
          <div className={styles['question-del']}>This question does not exist.</div>
          :
          <div ref={ref} className={styles['question-detail']}>
            {
              type === 'question'
                ?
                <div className={styles['question-header']}>
                  <div className={styles['header-left']}>
                    <Link className="mr-6 flex-shrink-0" to={`/profile?id=${questionData?.user_id}`}>
                      <img className={styles['user-icon']} src={questionData.user_icon} alt="" />
                    </Link>
                    <Link className='text-text truncate' to={`/profile?id=${questionData?.user_id}`}>{questionData?.user_nick_name}</Link>
                    <Link className={styles['user-name'] + ' truncate'} to={`/profile?id=${questionData?.user_id}`}>@{questionData?.user_name}</Link>
                    <div className={styles['answer-time']}>{formatPublishTime(questionData.publish_time)}</div>
                  </div>
                </div>
                :
                <div className='flex items-center my-12'>
                  <div className="opacity-60">By&ensp;</div>
                  <Link className="truncate font-medium" to={`/profile?id=${questionData?.user_id}`}>{questionData?.user_nick_name}</Link>
                  <div className='w-[1px] h-10 bg-text/8 mx-8' />
                  <div className="opacity-60 shrink-0">{formatPublishTime(questionData.publish_time)}</div>
                </div>
            }
            <div className={styles['question-desc-box']}>
              <p className={styles['desc-box']} style={{ cursor: type === 'question' ? 'text' : '' }} dangerouslySetInnerHTML={{__html: questionData?.context || ''}} onClick={(e) => toQuestionDetail(e, questionData.id)} />
              <div className={['flex my-12 text-text/60', !questionData.description?.length && '!hidden'].join(' ')}>
                <div className="ql-editor grow-ql-editor">
                  <div
                    ref={conRef}
                    dangerouslySetInnerHTML={{ __html: getText(questionData.description) || '' }}
                    className={['break-words hyphens-auto line-clamp-1'].join(' ')}
                    onClick={(e) => toQuestionDetail(e, questionData.id)}
                  >
                  </div>
                </div>
                {
                  (displayText || getImgSrc(questionData.description).length > 0 || checkThanTwoP(questionData.description))
                  &&
                  <div onClick={() => setVisible(e => !e)} className='flex items-center ml-2 text-primary whitespace-nowrap'>
                    View More <ReactSVG className="ml-4 mt-2 w-16 rotate-90" src={arrowImg} />
                  </div>
                }
              </div>
            </div>
            {
              type === 'question'
              &&
              <div className={[styles['bottom-btn'], 'b-t-1 border-text/10', displayText ? styles.top12 : ''].join(' ')}>
                  <div className={styles['answer-btns']}>
                    <div className={styles.btn}>
                      <div className={questionData.like_type === 0 ? '' : 'text-primary'} onClick={() => operationFabulous(questionData.id, questionData.like_type)}>
                        <img className={''} src={questionData.like_type === 0 ? fabulousImg : fabulousSelectImg} alt="" />
                        <span>{calculationThousand(questionData?.like_num || 0)}</span>
                      </div>
                    </div>

                    <div className={styles.btn}>
                      <div onClick={(e) => toQuestionDetail(e, questionData.id)}>
                        <img src={browseImg} alt="" />
                        <span>{calculationThousand(questionData?.answer_num || 0)}</span>
                      </div>
                    </div>

                    <div className={styles.btn}>
                      <div className={questionData.is_collect ? 'text-[#fab516]' : ''} onClick={() => operationSubscripe(questionData.id, questionData.is_collect)}>
                        <img src={questionData.is_collect ? collectionSelectImg : collectionImg} alt="" />
                        <span>{calculationThousand(questionData.collect_num)}</span>
                      </div>
                    </div>

                    <div className={styles.btn + ' px-8 !w-auto'} onClick={() => Modal.alert({ content: 'Sharing is temporarily not supported during the closed beta', confirmText: 'OK' })}>
                        <img src={shareImg} alt="" />
                    </div>
                  </div>
              </div>
            }
          </div>
        }

        <QuestionPopup visible={visible} title={questionData.context} description={questionData.description} onClose={() => setVisible(false)} />
    </>
  )
}

export default forwardRef(QuestionCard);