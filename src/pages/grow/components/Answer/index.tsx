import React, { useState, useEffect, useRef, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useData } from "@/reducer";
import { Modal } from "antd-mobile";
import ImgList from "@/components/ImgList";
import TabSeed from '@/components/SeedTab';
import { Confirm, showActionSheet } from "@/components/_utils/Confirm";
import { Stage as SeedStage } from '@/components/SeedTab/type';
import { toEditAnswer, checkEarnType } from "../../comment";
import styles from './index.module.less';
import { getOneSeed, waterGrownSeed, receiveEarn } from '@/pages/earn/service';
import { calculationThousand, characterConversionIcon, composedPath, formatPublishTime, isSafari, toProfilePage } from '@/units/index';
import Like from "@/components/Like";
import DelModalTip from "../DelModalTip";

import commentImg from '@/assets/img/grow/comment.svg';
import collectionImg from '@/assets/img/grow/collection.svg';
import collectionSelectImg from '@/assets/img/grow/collection-select.svg';
import shareImg from '@/assets/img/grow/share.svg';
import privateImg from '@/assets/img/grow/private.svg';
import spotBoxImg from "@/assets/img/grow/spot-box.svg";
import editAnswerImg from "@/assets/img/grow/editAndDel/edit-answer.svg";
import delImg from "@/assets/img/grow/editAndDel/del.svg";
import privateBtnImg from "@/assets/img/grow/editAndDel/private.svg";

export type AnswerProps = {
    item: any;
    index: number;
    spotBtnFlag?: boolean;
    hideAnswerWithinQuestion?: boolean;
    seed: any;
    opretionCollect: (value: number) => void;
    operationFabulousAnswer: (id: number, type: number, likeNum: number, unLikeNum: number) => void;
    opretionCommentNum: (index: number, num: number) => void;
    privateAndOpen?: (id: number, index: number) => void;
    delAnswer: (id: number) => void;
}

const Answer = (props: AnswerProps) => {
    const state = useData();
    const history = useHistory();
    const { pathname } = useLocation();
    const {
        seed, item, index, hideAnswerWithinQuestion = false, spotBtnFlag = false,
        opretionCollect, delAnswer, operationFabulousAnswer, privateAndOpen
    } = props;
    const conRef = useRef(null);
    const [displayText, setisDisplayText] = useState<boolean>(false);
    const [qusetionBoxEnter, setQusetionBoxEnter] = useState<boolean>(false);
    const [spotFlag, setSpotFlag] = useState<boolean>(false);
    const [seedInfo, setSeedInfo] = useState<any>({});
    let timer: any = null;

    const isSelf = useMemo(() => item.user_id === state.userInfo.id, [item.user_id, state.userInfo.id])

    const getText = (str: string) => {
        if (!str) {
            return
        }
        const tempStr = str;
        const reTag = /<img(?:.|\s)*?>/g; // 去除图片
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

    const toAnswetDetail = (e: any, id: number) => {
        if (e?.target?.localName === 'a') { // 点击标签为a标签时 阻止冒泡
            return
        }
        history.push(`/growDetail?id=${id}`);
    }
    const provateQuestion = () => {
        if (item.view !== 1) return
        privateAndOpen && privateAndOpen(item.id, index);
    }

    const openMenu = () => {
        showActionSheet({
            cancelText: 'Cancel',
            empty: 'More features are coming soon',
            actions: [
                { key: 'edit', text: 'Edit answer', icon: editAnswerImg, hide: !isSelf, onClick: () => toEditAnswer(item.id) },
                { key: 'del', text: 'Delete answer', icon: delImg, hide: !isSelf, onClick: onDel },
                { key: 'provate', text: item.is_hide_profile ? 'Open to others' : 'Private to others', icon: privateBtnImg, hide: !spotBtnFlag, onClick: provateQuestion },
            ]
        })
    }
    
    async function onDel() {
		const status = await checkEarnType(item.id, 2)
		await Confirm({
			title: 'Delete answer',
			content: <DelModalTip content="answer" seedStatus={status} />
		})
		delAnswer(item.id)
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
            actions: [
                {
                    key: 'confirm',
                    text: 'OK'
                }
            ]
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
        <div className={styles['answer-option']} style={{ boxShadow: qusetionBoxEnter ? 'none' : '', borderColor: qusetionBoxEnter ? "transparent" : '' }}>
            <div className={styles['answer-header-box']}>
                <div className='text-12'>Answer by</div>
                <div className='flex items-center space-x-16 [&>*]:w-24 [&>*]:h-24 [&>*]:rounded-4'>
                    {
                        !isHideSeed() && (
                            <TabSeed
                                className="active-bg" 
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
                        <img className="active-bg" src={privateImg} alt="" onClick={() => openModal((item.is_hide && item.status !== 2) ? 'Currently only visible to you due to content issues or disputes' : (item.status === 2 ? 'Currently only visible to you in draft status' : ''))} />
                    }
                    <img className="active-bg" onClick={openMenu} src={spotBoxImg} alt={''} />
                </div>
            </div>
            {/* 答案区域 */}
            <div className={styles['answer-box']}>
                <div className='grid grid-cols-[auto_auto_1fr]'>
                    <img className='row-span-2 w-44 h-44 rounded-full mr-8 b-2' onClick={() => toProfilePage(item.user_id)} src={item?.user_icon} alt="" />
                    <span className="font-medium max-w-128 truncate" onClick={() => toProfilePage(item.user_id)}>{item?.user_nick_name}</span>
                    <span className='ml-6 truncate opacity-60' onClick={() => toProfilePage(item.user_id)}>@{item.user_name}</span>
                    <div className='col-span-2 mt-2 opacity-60'>{formatPublishTime(item?.publish_time)}</div>
                </div>
                <div className={styles['answer-content']}>
                    <div className="grow-ql-editor ql-editor answer-question-card">
                        <div ref={conRef} dangerouslySetInnerHTML={{ __html: getText(item?.context) || '' }} className={[styles['answer-desc'], 'line-clamp-5'].join(' ')} onClick={(e) => toAnswetDetail(e, item.id)} />
                    </div>
                </div>
                {
                    displayText
                    &&
                    <div onClick={(e) => toAnswetDetail(e, item.id)} className={styles['view-all']}>
                        <span>View More</span>
                    </div>
                }
                {
                    getImgSrc(item?.context) && getImgSrc(item?.context).length
                        ?
                        <ImgList imgList={getImgSrc(item?.context)} />
                        :
                        <div />
                }
                {
                    !hideAnswerWithinQuestion
                        ?
                        (item.question && !item.question.show_type)
                            ?
                            <div className={styles['problem-box']} onMouseEnter={() => setQusetionBoxEnter(true)} onMouseLeave={() => setQusetionBoxEnter(false)}>
                                <div className={styles['answer-user-info']}>
                                    <img className='w-24 h-24 mr-8 rounded-full' onClick={() => toProfilePage(item.question.user_id)} src={item?.question?.user_icon} alt="" />
                                    <div className={styles['user-message']}>
                                        <span onClick={() => toProfilePage(item.question.user_id)} className='mr-8 truncate font-medium'>{item?.question?.user_nick_name}</span>
                                        <span onClick={() => toProfilePage(item.question.user_id)} className='mr-8 opacity-60 truncate'>@{item?.question?.user_name}</span>
                                        <div className='ml-auto opacity-60'>{formatPublishTime(item?.question?.publish_time)}</div>
                                    </div>
                                </div>
                                <div className={styles['problem-content']}
                                    onClick={(e: any) => {
                                        if (e?.target?.localName === 'a') { // 点击标签为a标签时 阻止冒泡
                                            return
                                        }
                                        history.push(`/questionDetail?id=${item?.question?.id}`)
                                    }}>
                                    <div dangerouslySetInnerHTML={{ __html: item?.question?.context || '' }} className={styles['problem-content-text']} />
                                    {
                                        item?.question?.description
                                        &&
                                        <div onClick={(e: any) => {
                                            if (e?.target?.localName === 'a') { // 点击标签为a标签时 阻止冒泡
                                                return
                                            }
                                            if (pathname === '/questionDetail') return // 当前正在问题详情不跳转
                                            history.push(`/questionDetail?id=${item?.question?.id}`)
                                        }} className={styles['view-all']}><span>View More</span></div>
                                    }
                                </div>
                            </div>
                            :
                            <div className={styles['question-invisible']}>
                                {item?.question?.show_type === 1 ? 'This question is invisible.' : 'This question does not exist..'}
                            </div>
                        :
                        <div />
                }
                <div className={styles['answer-btns']}>
                    <Like type={item.like_type} like={item.like_num} step={item.unlike_num} onType={(...args) => operationFabulousAnswer(item.id, ...args)} />

                    <div className={styles.btn} onClick={(e) => toAnswetDetail(e, item.id)} >
                        <div>
                            <img src={commentImg} alt="" />
                            <span>{calculationThousand(item.comment_num)}</span>
                        </div>
                    </div>

                    <div className={styles.btn}>
                        <div className={item.is_collect ? styles.active : ''} onClick={(e) => {
                            e.stopPropagation();
                            opretionCollect(item.id);
                        }}>
                            <img src={item.is_collect ? collectionSelectImg : collectionImg} alt="" />
                            <span>{calculationThousand(item.collect_num)}</span>
                        </div>
                    </div>
                    <div onClick={() => openModal('Sharing is temporarily not supported during the closed beta')} className={[styles.btn, styles.share].join(' ')}>
                        <div>
                            <img src={shareImg} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Answer;