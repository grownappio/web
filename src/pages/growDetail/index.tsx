import React, { useEffect, useRef, useState, useMemo } from "react";
import { message } from "antd";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useData } from "@/reducer";
import TabSeed from "@/components/SeedTab";
import { Stage as SeedStage } from '@/components/SeedTab/type';
import { characterConversionIcon, composedPath } from "@/units";
import { checkEarnType, toEditAnswer } from "../grow/comment";
import AnswerDel from "@/pages/grow/components/AnswerDel";
import ViewMore from './components/ViewMore';
import styles from "@/pages/growDetail/index.module.less";
import { calculationThousand, formatPublishTime, getUrlHashParam } from "@/units";
import shareImg from "@/assets/img/grow/share.svg";
import editAnswerImg from "@/assets/img/grow/editAndDel/edit-answer.svg";
import delImg from "@/assets/img/grow/editAndDel/del.svg";
import commentImg from "@/assets/img/grow/comment.svg";
import collectionSelectImg from "@/assets/img/grow/collection-select.svg";
import collectionImg from "@/assets/img/grow/collection.svg";
import Comment from './components/Comment'
import {
	qaLike, qaCollect, commentAnswer, commentLike,
	commentList, fololow, growQAPageDetail,
} from "./service";
import { receiveEarn, waterGrownSeed } from '@/pages/earn/service';
import { qaDelete } from "../grow/service";
import QuestionCard from "@/pages/growDetail/components/QuestionCard";
import { setBrowerTabTitle } from '@/utils';
import Appbar from "@/components/Appbar";
import { Confirm } from "@/components/_utils/Confirm";
import OccupyBox from "@/components/OccupyBox";
import { Modal, Popup } from "antd-mobile";
import RichInput from "@/components/RichInput";
import Like from "@/components/Like";
import DelModalTip from "../grow/components/DelModalTip";

let timer: any = null;

const GrowDetail = () => {
	const history = useHistory();
	const params = useMemo(() => getUrlHashParam(), [useLocation()]);
	const state = useData();
	const visible = useState(false);
	const [fabulousId, setFabulousId] = useState<number>(0);
	const [commentLoading, setCommentLoading] = useState<boolean>(false);
	const [sticky, setSticky] = useState<boolean>(false);
	const [replyInfo, setReplyInfo] = useState<any>();
	const [at, setAt] = useState<any>();
	const [comments, setComments] = useState<any[]>([]);
	const [commentNum, setCommentNum] = useState<number>(0);
	const [questionData, setQuestionData] = useState<any>({});
	const [answerItem, setAnswerItem] = useState<any>();
	const questionRef: any = useRef();
	const [seedInfo, setSeedInfo] = useState<any>({});
	const [answerList, setAnswerList] = useState<any>([]);
	const [withOutMyAnswerNum, setWithOutMyAnswerNum] = useState<number>(0);
	const [likeTip, setLikeTip] = useState<string>('Upvote');
	
	// 是否是本人
	const isCanEditOrDel = useMemo(() => answerItem?.user_id === state.userInfo.id, [answerItem, state])
	const operates = [
		{ key: 'edit', icon: editAnswerImg, text: 'Edit answer', hide: !isCanEditOrDel, onClick: () => toEditAnswer(answerItem.id) },
		{ key: 'del', icon: delImg, text: 'Delete answer', hide: !isCanEditOrDel, onClick: onDel }
	]

	// 删除
	async function onDel() {
		const status = await checkEarnType(answerItem.id, 2)
		await Confirm({
			title: 'Delete answer',
			content: <DelModalTip content="answer" seedStatus={status} />
		})
		await qaDelete({ id: answerItem?.id, status: 3 });
		message.success("Your answer has been deleted", 1, () => {
			history.replace('/grow')
		})
	}

	// 将emoji表情转换为图片
	const getText = (str: string) => {
		if (!str) return '';
		const tempStr = str;
		// style内联样式
		return characterConversionIcon(tempStr.replace(/\s+style="[^"]*"/g, ''))
	}

	//判断--互动栏是否出现在屏幕里
	const operateRef = useRef<HTMLDivElement>(null)

	//进入问题详情页面
	function redirectQuestion() {
		const questionID = answerItem?.question_id
		history.push(`/questionDetail?id=${questionID}`)
	}

	// 发送消息
	const onSend = async (input: HTMLElement, text: string) => {
		if (!replyInfo) {
			const res = await commentConfirm(text, 0, 1, 0, 0)
			setComments([ res?.data, ...comments ])
			setCommentNum(commentNum + 1)
			setReplyInfo(undefined)
			setAt(undefined)
			answerItem.comment_num++
		} else {
			const res = await commentConfirm(text, replyInfo.id, 2, at.user_id, at.id)
			const tempData = JSON.parse(JSON.stringify(comments))
			const index = comments.indexOf(replyInfo)
			tempData[index].reply_list ??= []
			tempData[index].reply_num = tempData[index].reply_num + 1
			tempData[index].reply_list.push(res?.data)
			setComments(tempData)
			setReplyInfo(undefined)
			setAt(undefined)
			answerItem.comment_num++
		}
	}

	//成为粉丝
	const follow = async (uid: number) => {
		const result = await fololow({ user_id: uid })
		if (result?.code === 200) {
			message.success(answerItem?.is_follow ? 'Unfollow succeeded' : 'Follow succeeded');
			setAnswerItem({
				...answerItem,
				is_follow: !answerItem?.is_follow
			})
		}
	}

	// 评论回复点赞
	const thumbsUp = async (id: number, isReply: boolean, isLike: boolean, index: number, subIndex: number, num: number, parentId?: number) => {
		const params = {
			id,
			is_reply: isReply,
			like_status: isLike ? 1 : 2,
		}
		const result = await commentLike(params);
		if (result?.code === 200) {
			const tempCommentData = JSON.parse(JSON.stringify(comments));
			if (subIndex === -1) {
				const currentIndex = tempCommentData.findIndex((tmp: any) => tmp.id === id);
				if (currentIndex !== -1) {
					tempCommentData[index].is_like = isLike;
					tempCommentData[index].like_num = num;
				}
			} else {
				const currentParentIndex = tempCommentData.findIndex((tmp: any) => tmp.id === parentId);
				if (currentParentIndex !== -1) {
					const childList = tempCommentData[currentParentIndex].reply_list;
					const currentChildIndex = (childList || []).findIndex((child: any) => child.id === id);
					if (currentChildIndex !== -1) {
						tempCommentData[currentParentIndex].reply_list[currentChildIndex].is_like = isLike;
						tempCommentData[currentParentIndex].reply_list[currentChildIndex].reply_like_num = num;
					}
				}
			}
			setComments(tempCommentData);
		}
	}

	// 评论
	const commentConfirm = async (value: string, fatherID: number, type: number, atUserID: number, AtCommentID: number) => {
		return await commentAnswer({
			context: value,
			answer_id: Number(params.id),
			type: type,
			at_user_id: atUserID,
			father_id: fatherID,
			at_comment_id: AtCommentID,
		});
	}

	// 问题点赞
	const operationFabulousQuestion = async (id: number, type: number) => {
		const likeType = type === 0 ? 1 : 0;
		const result = await qaLike({ qa_id: id, like_type: likeType })
		if (result?.code === 200) {
			setQuestionData({
				...questionData,
				like_type: likeType,
				like_num: likeType === 0 ? questionData.like_num - 1 : questionData.like_num + 1
			})
		}
	}

	// 答案案点赞
	const operationFabulous = async (id: number, type: number, likeNum: number, unLikeNum: number) => {
		const result = await qaLike({ qa_id: id, like_type: type })
		if (result?.code === 200) {
			setAnswerItem({
				...answerItem,
				like_type: type,
				like_num: likeNum,
				unlike_num: unLikeNum,
			})

		}
	}
	// 问题订阅
	const operationSubscripe = async (id: number, type: boolean) => {
		const result = await qaCollect({ qa_id: id })
		if (result?.code === 200) {
			setQuestionData({
				...questionData,
				is_collect: !questionData.is_collect,
				collect_num: questionData.is_collect ? questionData.collect_num - 1 : questionData.collect_num + 1
			})
		}
	}

	// 问题收藏
	const operationCollect = async (id: number) => {
		const result = await qaCollect({ qa_id: id })
		if (result?.code === 200) {
			setAnswerItem({
				...answerItem,
				collect_num: answerItem?.is_collect ? answerItem?.collect_num - 1 : answerItem?.collect_num + 1,
				is_collect: !answerItem?.is_collect
			})
		}
	}

	// 获取全部
	const viewAllList = async (type: number) => {
		if (type === 1) {
			getCommentList(1, false);
		}
	}

	//获取comment列表
	const getCommentList = async (type: number, first: boolean) => {
		const tempParams: any = {
			type: type,
			first: first,
			answer_id: Number(params.id)
		}
		if (params.commentId) {
			tempParams.reference_id = Number(params.commentId);
		}
		const result = await commentList(tempParams);
		if (result?.code === 200) {
			setCommentNum(result?.data?.num);
			setComments(result?.data?.list || []);
		}
	}

	// 获取reply列表
	const getReplyList = async (id: number, index: number) => {
		const result = await commentList({
			type: 2,
			answer_id: Number(params.id),
			father_id: id,
		})
		if (result?.code === 200) {
			const tempCommentData = JSON.parse(JSON.stringify(comments));
			tempCommentData[index].reply_list = result?.data?.list || []
			setComments(tempCommentData);
		}
	}

	//获取详情页信息
	const setPageDetail = async () => {
		if (params.id) {
			setCommentLoading(true);
			const result = await growQAPageDetail({ id: Number(params.id) })
			if (result?.code === 200) {
				setAnswerItem(result?.data?.answer_detail)
				setQuestionData(result?.data?.question_detail)
				setSeedInfo(result?.data?.associated_seed)
				setAnswerList(result?.data?.answer_list);
				setWithOutMyAnswerNum(result?.data?.with_out_my_answer_num || 0)
				await getCommentList(1, true)
				setCommentLoading(false);
			} else {
				window.close();
			}
		} else {
			window.close();
		}
	}
	const handelScrolll = () => {
		if (answerItem?.show_type === 2) return
		const distance = operateRef.current!.getBoundingClientRect().top
		setSticky(distance <= 45)
	}

	useEffect(() => {
		window.addEventListener('scroll', handelScrolll, { passive: true })
		return () => window.removeEventListener('scroll', handelScrolll)
	}, [])

	const answerSuccess = async (answer_id: number) => {
		const result = await growQAPageDetail({ id: Number(params.id) })
		setQuestionData(result?.data?.question_detail)
	}

	const pageINIT = async () => {
		await setPageDetail()
		if (params.comment === 'true') {
			setTimeout(() => {
				operateRef.current!.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}, 10)
		}
	}

	const isHideSeed = () => {
		const { is_self } = answerItem || {};
		const { status, id } = seedInfo || {};

		return !id || !is_self || [3, 4].includes(status);
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
		pageINIT();
	}

	const handleSeedOnRecieve = async () => {
		await receiveEarn({ earn_id: seedInfo.id });
		pageINIT();
	}

	const canGetMoney = () => {
		const { fix_earn = 0, float_earn = 0 } = seedInfo;

		return String((fix_earn + float_earn).toFixed(2));
	}

	useEffect(() => {
		setBrowerTabTitle(`Answer #${params.id} / Grown`);
		pageINIT()
	}, [params])

	useEffect(() => {
		const { next_time, status } = seedInfo;
		const nextUpdateTime = next_time * 1000 - new Date().getTime();
		if ([1, 2].includes(status)) {
			if (timer) {
				clearInterval(timer);
			}
			timer = setTimeout(() => {
				pageINIT();
			}, nextUpdateTime);
		}

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		}
	}, [seedInfo])

	return (
		<div className={styles['detail-box']} >
			<Appbar
				className="sticky top-0 b-b-1 z-10"
				title={`Answer #${answerItem?.id}`}
				menus={operates}
				right={
					<div className="rounded-full active-shadow">
						{!isHideSeed() && (<TabSeed stage={showSeedStatus()} money={canGetMoney()} reverse={isReverse()} onRecieve={handleSeedOnRecieve} onWater={handleSeedOnWater} startTime={getTime().start || 0} endTime={getTime().end || 0} />)}
					</div>
				}
			/>
			{
				answerItem?.show_type === 2
					?
					<AnswerDel />
					:
					<>
						<div className={styles['detail-body']}>
							<div className="overflow-hidden"></div>
							<QuestionCard
								type="answer"
								answerSuccess={answerSuccess}
								operationSubscripe={operationSubscripe}
								operationFabulous={operationFabulousQuestion}
								questionData={questionData}
								ref={questionRef}
							/>
							<div className={styles['answer-body']}>
								<div className={styles['answer-header']}>
									<div className={styles['user-info']}>
										<Link to={`/profile?id=${answerItem?.user_id}`}>
											<img className={styles['user-icon']} src={answerItem?.user_icon} alt={''}></img>
										</Link>
										<div className='flex-1 flex flex-col justify-between ml-8 w-0'>
											<div className='flex items-center'>
												<Link to={`/profile?id=${answerItem?.user_id}`} className="text-inherit truncate">{answerItem?.user_nick_name}</Link>
												<Link to={`/profile?id=${answerItem?.user_id}`} className="ml-6 text-inherit  truncate opacity-60">@{answerItem?.user_name}</Link>
												{
													!answerItem?.is_self && !answerItem?.is_follow
													&&
													<button className='btn-primary py-4 px-8 ml-auto' onClick={() => follow(answerItem?.user_id || 0)}>
														Follow
													</button>
												}
											</div>
											<p className='opacity-60'>
												{formatPublishTime(answerItem?.publish_time)}
											</p>
										</div>
									</div>
								</div>
								<div className="ql-editor grow-ql-editor mb-16">
									<div className={styles['answer-comment']} dangerouslySetInnerHTML={{ __html: getText(answerItem?.context || '') }} />
								</div>
								<OccupyBox className={styles['answer-operates-box'] + ` b-t-1 b-b-1 border-text/10 bg-white ${sticky ? 'fixed top-44 w-full z-10' : ''}`} boxRef={operateRef}>
									<div className={styles['answer-operates']}>
										<div className={styles['answer-btns']}>
											<Like className="w-82" type={answerItem?.like_type!} like={answerItem?.like_num} step={answerItem?.unlike_num} onType={(...args) => operationFabulous(answerItem?.id, ...args)} />
											<div className={styles.btn}>
												<div className="active-bg active:!bg-[#1685ec0f]" onClick={() => visible[1](true)}>
													<img src={commentImg} alt="" />
													<span>{calculationThousand(answerItem?.comment_num || 0)}</span>
												</div>
											</div>
											<div className={styles.btn}>
												<div className={(answerItem?.is_collect ? styles.active : '') + ' active-bg active:!bg-[#fab5160f]'} onClick={() => operationCollect(answerItem?.id || 0)}>
													<img src={answerItem?.is_collect ? collectionSelectImg : collectionImg} alt="" />
													<span>{calculationThousand(answerItem?.collect_num || 0)}</span>
												</div>
											</div>
											<div className={[styles.btn, styles.share].join(' ')}>
												<div className="active-bg active:!bg-[#F2FBFB]" onClick={() => Modal.alert({ content: 'Sharing is temporarily not supported during the closed beta', confirmText: 'OK' })}>
													<img src={shareImg} alt="" />
												</div>
											</div>
										</div>
									</div>
								</OccupyBox>
							</div>
							<Comment
								commentLoading={commentLoading}
								getReplyList={getReplyList}
								updateCommentList={setPageDetail}
								viewAllList={viewAllList}
								thumbsUp={thumbsUp}
								commentNum={commentNum}
								commentData={comments}
								onReply={(e, at) => { setReplyInfo(e); setAt(at); visible[1](true); }}
							/>

						</div>
							<ViewMore className="mx-16 rounded-8" answerList={answerList} answerNum={withOutMyAnswerNum} onClick={redirectQuestion} />

							{/* 富文本输入 */}
							<Popup visible={visible[0]} onMaskClick={() => { setReplyInfo(undefined); setAt(undefined); visible[1](false); }} destroyOnClose>
								<RichInput placeholder={at ? `Reply ${at.user_name}:` : 'Express your ideas'} onConfirm={onSend} onSucceed={() => visible[1](false)} />
							</Popup>

							{/* 固定底部的输入框 */}
							<OccupyBox className='fixed bottom-0 flex items-center w-full p-8 px-16 space-x-12 b-t-1 border-text/5 bg-white z-10' safe='bottom'>
								<img className='w-32 h-32 rounded-full' src={state.userInfo.icon} alt='' />
								<div className='py-6 px-16 flex-1 rounded-full text-text/30 bg-[#F6F9FC]' onClick={() => visible[1](true)}>Express your ideas.</div>
							</OccupyBox>
					</>
			}
		</div>
	)
}

export default GrowDetail;