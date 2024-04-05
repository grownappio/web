import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Toast } from "antd-mobile";
import { useData } from '@/reducer';
import { calculationThousand, composedPath, formatPublishTime, characterConversionIcon, isSafari, toProfilePage } from '@/units/index';
import ImgList from '@/components/ImgList';
import DelModalTip from '@/pages/grow/components/DelModalTip';
import { checkEarnType, checkAnswerOrNot, toEditAnswer, checkAnswerAndQuestionIsCanEdit } from '../../../grow/comment';
import GrowActionSheet from "@/components/GrowActionSheet";
import TabSeed from '@/components/SeedTab';
import { Stage as SeedStage } from '@/components/SeedTab/type';
import ShowInfoModal from '@/components/ShowInfoModal';
import AnswerQuestion from '@/components/AnswerQuestion';
import fabulousImg from '@/assets/img/grow/fabulous.svg';
import fabulousSelectImg from '@/assets/img/grow/fabulous-select.svg';
import browseImg from '@/assets/img/grow/browse.svg';
import collectionImg from '@/assets/img/grow/collection.svg';
import collectionSelectImg from '@/assets/img/grow/collection-select.svg';
import shareImg from '@/assets/img/grow/share.svg';
import answerQuestionWhiteImg from '@/assets/img/grow/editAndDel/answer-question-white.svg';
import privateImg from '@/assets/img/grow/private.svg';
import spotBoxImg from '@/assets/img/grow/spot-box.svg'
import editQuestionImg from '@/assets/img/grow/editAndDel/edit-question.svg';
import delImg from '@/assets/img/grow/editAndDel/del.svg';
import privateBtnImg from '@/assets/img/grow/editAndDel/private.svg';
import { getOneSeed, waterGrownSeed, receiveEarn } from '@/pages/earn/service';

import styles from './index.module.less';
import { Confirm, showActionSheet } from '@/components/_utils/Confirm';
import { dataLenTrim } from '@/pages/publish/utils';

export type QuestionProps = {
    item: any;
    spotBtnFlag?: boolean;
    index: number;
    seed: any;
    operationSubscripe: (value: number) => void;
    operationFabulous: (value: number, type: number) => void;
    privateAndOpen?: (id: number, index: number) => void;
    delQuestion: (id: number) => void;
    answerSuccess: (id: number, question_id: number) => void;
}

const Question = (props: QuestionProps) => {
    const state = useData();
    const history = useHistory();
    const conRef = useRef(null);
    const spotRef = useRef(null);
    const {
        seed, item, spotBtnFlag = false,
        delQuestion, answerSuccess, operationSubscripe, operationFabulous, privateAndOpen, index
    } = props;
    const [spotFlag, setSpotFlag] = useState<boolean>(false);
    const [displayText, setisDisplayText] = useState<boolean>(false);
    const [isCanEditOrDel, setIsCanEditOrDel] = useState<boolean>(false);
    const [open, setVal] = useState(false);
    const [seedStatus, setSeedStatus] = useState<number>(0);
    const [seedInfo, setSeedInfo] = useState<any>({});
    let timer: any = null;

    const openAnswerEdit = (id: number) => {
        toEditAnswer(id);
    }

    const openAnswer = async (id: number) => {
        const myAnswerId = await checkAnswerOrNot(item.id);
        if (myAnswerId) {
            openAnswerEdit(myAnswerId);
            return
        }
        history.push(`/fullAnswer?id=${id}`)
    }

    const toQuestionDetail = (e: any, id: number) => {
        if (e.target.localName === 'a') { // 点击标签为a标签时 阻止冒泡
            return
        }
        history.push(`/questionDetail?id=${id}`)
    }

    const getText = (str: string) => {
        if (!str) {
            return
        }
        const tempStr = str;
        const reTag = /<img(?:.|\s)*?>/g;
        // 去除分割线
        const regDivider = new RegExp('<span[^>]*?class="divider"[^>]*>(.*?)</span>', 'g');
        // 去除图片 与 style内联样式
        return characterConversionIcon(tempStr.replace(reTag, '').replace(/\s+style="[^"]*"/g, '').replace(regDivider, ''))
    }

    const getImgSrc = (rich: string) => {
        if (!rich) return [];
        const imgList: any = [];
        // @ts-ignore
        rich.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match: any, capture: string) => {
            imgList.push(capture);
        });
        return imgList;
    }

    const provateQuestion = () => {
        if (item.view !== 1) return
        privateAndOpen && privateAndOpen(item.id, index);
    }

    const openMenu = () => {
        const isSelf = item.user_id === state.userInfo.id;
        showActionSheet({
            cancelText: 'Cancel',
            empty: 'More features are coming soon',
            actions: [
                {
                    key: 'edit',
                    icon: editQuestionImg,
                    text: 'Edit question',
                    hide: !((dataLenTrim(item.context) <= 30 && !item.description) || !item.answer_num) || !isSelf,
                    async onClick() {
                        const editStatus = await checkAnswerAndQuestionIsCanEdit(item.id);
                        if (!editStatus) {
                            Toast.show({
                                content: 'The question does not support editing',
                                duration: 1000
                            })
                            return
                        }
                        history.push(`/addQuestion?id=${item.id}`);
                    }
                },
                {
                    key: 'del',
                    icon: delImg,
                    text: 'Delete question',
                    hide: item.answer_num || !isSelf,
                    async onClick() {
                        setSeedStatus(await checkEarnType(item.id, 1))
                        await setVal(true)

                        const status = await checkEarnType(item.id, 1)
                        await Confirm({
                            title: 'Delete question',
                            content: <DelModalTip content="question" seedStatus={status} />
                        })
                        delQuestion(item.id)
                    }
                },
                {
                    key: 'provate',
                    icon: privateBtnImg,
                    text: item.is_hide_profile ? 'Open to others' : 'Private to others',
                    hide: !spotBtnFlag,
                    onClick: provateQuestion
                }
            ]
        })
    }

    const restrictName = (name: string) => {
        if (!name.trim()) {
            return '';
        }

        return name.length > 12 ? `${name.slice(0, 12)}...` : name;
    }

    const getSingleSeed = async () => {
        const response = await getOneSeed({ id: seedInfo.id });
        if (response.code === 200) {
            setSeedInfo(response?.data);
        }
    }

    const isHideSeed = () => {
        const { status, id } = seedInfo || {};

        return !id || [3, 4].includes(status);
    }

    const canGetMoney = () => {
        const { fix_earn = 0, float_earn = 0 } = seedInfo;

        return String((fix_earn + float_earn).toFixed(2));
    }

    const isReverse = () => {
        const stage = showSeedStatus();

        return stage === SeedStage.MATURE;
    }

    const showSeedStatus = () => {
        const { status, if_water } = seedInfo;
        switch (status) {
            case 1:
                if (if_water) {
                    return SeedStage.GROW;
                }
                return SeedStage.GERMINATE;
            case 2:
                return SeedStage.MATURE;
            case 3:
                return SeedStage.MATURE;
            default:
                return SeedStage.GERMINATE;
        }
    }

    const getTime = () => {
        const { created_at = 0, growing_time = 0, matured_time = 0 } = seedInfo || {};
        const stage = showSeedStatus();

        switch (stage) {
            case SeedStage.GERMINATE:
            case SeedStage.GROW:
                return {
                    start: created_at * 1000,
                    end: growing_time * 1000,
                }
            case SeedStage.MATURE:
                return {
                    start: growing_time * 1000,
                    end: matured_time * 1000,
                }
        }
    }

    const handleSeedOnWater = async () => {
        await waterGrownSeed({ earn_id: seedInfo.id });
        getSingleSeed();
    }

    const handleSeedOnRecieve = async () => {
        await receiveEarn({ earn_id: seedInfo.id });
        getSingleSeed();
    }

    const openModal = (content: string) => {
        Modal.show({
            content,
            closeOnAction: true,
            closeOnMaskClick: true,
            actions: [{ key: 'confirm', text: 'OK' }]
        })
    }

    useEffect(() => {
        let conDOm: any = conRef.current;
        if (conDOm) {
            const offsetH = conDOm.offsetHeight;
            const srollH = conDOm.scrollHeight;
            // 会有2px的偏差
            if ((srollH - 2) > offsetH) {
                setisDisplayText(true);
            }
        }
    }, [item])

    useEffect(() => {
        setSeedInfo(seed || {});
    }, [seed])

    useEffect(() => {
        const { next_time, status } = seedInfo;
        const nextUpdateTime = next_time * 1000 - new Date().getTime();
        if ([1, 2].includes(status)) {
            if (timer) {
                clearInterval(timer);
            }
            timer = setTimeout(() => {
                getSingleSeed();
            }, nextUpdateTime);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        }
    }, [seedInfo])

    return (
        <div className={styles['question-box']}>
            <div className={styles['question-header']}>
                <div className='text-12'>Ask by</div>
                <div className={styles['header-right'] + ' space-x-16'}>
                    {
                        !isHideSeed() && (
                            <TabSeed
                                startTime={getTime().start || 0}
                                endTime={getTime().end || 0}
                                money={canGetMoney()}
                                stage={showSeedStatus()}
                                reverse={isReverse()}
                                onRecieve={handleSeedOnRecieve}
                                onWater={handleSeedOnWater}
                            />
                        )
                    }
                    {
                        (item?.is_hide || (item.status === 2))
                        &&
                        <div onClick={() => {
                            const modalContent = (item.is_hide && item.status !== 2)
                                ?
                                'Currently only visible to you due to content issues or disputes'
                                :
                                (item.status === 2 ? 'Currently only visible to you in draft status' : '')
                            openModal(modalContent)
                        }} className={styles['answer-type']}>
                            <img src={privateImg} alt="" />
                        </div>
                    }
                    <img className='w-24 h-24 active-bg rounded-4' src={spotBoxImg} alt='' onClick={openMenu} />
                </div>
            </div>
            <div className={styles['answer-box']}>
                <div className={styles['answer-user-info']}>
                    <div className={styles['answer-user-info-left']}>
                        <img
                            onClick={() => toProfilePage(item.user_id)}
                            className={styles['user-icon']}
                            src={item.user_icon}
                            alt=""
                        />
                        <div className={styles['user-message']}>
                            <div className={styles['user-name']}>
                                <span onClick={() => toProfilePage(item.user_id)} className={styles['nick-name']}>{restrictName(item?.user_nick_name)}</span>
                                <span onClick={() => toProfilePage(item.user_id)} className={styles['inner-user-name']}>@{item.user_name}</span>
                            </div>
                            <div className={styles['answer-time']}>{formatPublishTime(item.publish_time)}</div>
                        </div>
                    </div>
                    <div onClick={() => { if (!item.my_answer_id) openAnswer(item.id) }} className={[styles['question-btn'], !item.my_answer_id ? styles.active : ''].join(' ')}>
                        <img src={answerQuestionWhiteImg} alt="" />
                        <span>{item.my_answer_id ? 'Answered' : 'Answer'}</span>
                    </div>
                </div>
                <div className={styles['answer-content']}>
                    <div onClick={(e) => toQuestionDetail(e, item.id)} className={styles['answer-desc']}>
                        <div className={styles['desc-box']} dangerouslySetInnerHTML={{ __html: item?.context || '' }} />
                        {
                            getText(item.description)
                            &&
                            <div className="ql-editor grow-ql-editor answer-question-card">
                                <div ref={conRef} dangerouslySetInnerHTML={{ __html: getText(item.description) || '' }} className={[styles['question-desc'], styles.ellipsis].join(' ')}>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {
                    displayText
                    &&
                    <div onClick={(e) => toQuestionDetail(e, item.id)} className={styles['view-all']}>
                        <span>View More</span>
                    </div>
                }
                {
                    getImgSrc(item?.description) && getImgSrc(item?.description).length
                        ?
                        <div className={styles['question-img-box']}>
                            <ImgList imgList={getImgSrc(item?.description)} />
                        </div>
                        :
                        <div />
                }
                <div className={styles['answer-btns']}>
                    <div className={[styles.btn, styles.fabulous].join(' ')}>
                        <div className={item.like_type === 0 ? '' : 'text-primary'} onClick={() => operationFabulous(item.id, item.like_type)}>
                            <img className={styles['fabulous-img']} src={item.like_type === 0 ? fabulousImg : fabulousSelectImg} alt="" />
                            <span>{calculationThousand(item?.like_num || 0)}</span>
                        </div>
                    </div>
                    <div onClick={(e) => toQuestionDetail(e, item.id)} className={styles.btn}>
                        <div>
                            <img src={browseImg} alt="" />
                            <span>{calculationThousand(item?.answer_num || 0)}</span>
                        </div>
                    </div>
                    <div className={styles.btn}>
                        <div className={item.is_collect ? styles.active : ''} onClick={(e) => {
                            e.stopPropagation();
                            operationSubscripe(item.id);
                        }}>
                            <img src={item.is_collect ? collectionSelectImg : collectionImg} alt="" />
                            <span>{calculationThousand(item.collect_num)}</span>
                        </div>
                    </div>
                    <div onClick={() => openModal('Sharing is temporarily not supported during the closed beta')} className={styles.btn}>
                        <div>
                            <img src={shareImg} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Question;