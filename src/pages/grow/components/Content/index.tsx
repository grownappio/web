import React, { forwardRef, memo, ReactNode, Ref, useMemo } from "react";
import { message } from "antd";
import Answer from "../Answer";
import Question from "../Question";
import NoData from "../Nodata";
import loadingMoreGif from "@/assets/img/grow/loading-more.gif";
import PeopleSkeletonSvg from '../../content-skeletion.svg'
import Touchable from "@/components/Touchable";
import styles from './index.module.less';
import "./content.less";
import { qaLike, qaCollect, profileHide, qaDelete } from "../../service";

export type ContentProps = {
	currentTabID?: number;
	blendList?: any[];
	blendHasMoreFlag: boolean;
	loadingMoreFlag: boolean;
	blendLoading?: boolean;
	isPullDown?: boolean;
	spotBtnFlag?: boolean;
	hideAnswerWithinQuestion?: boolean; // 是否影藏答案内引用问题
	noDataType?: number; // 没有数据时 展示类型 0 问题 2 搜索people 4 answer 5 Favorites为空
	skeleton?: JSX.Element;
	setBlendList?: (value: any) => void;
	questionUpdate?: () => void; // 问题详情页 删除答案需要触发问题详情更新
	className?: string;
}

const GrowContent = (props: ContentProps, ref?: Ref<HTMLDivElement>) => {
	const {
		blendList = [],
		blendHasMoreFlag,
		loadingMoreFlag,
		blendLoading,
		isPullDown = true,
		spotBtnFlag = false,
		setBlendList,
		hideAnswerWithinQuestion = false,
		noDataType = 0,
		questionUpdate,
		className
	} = props;

	// 答案收藏
	const opretionCollect = async (id: number) => {
		const result = await qaCollect({ qa_id: id })
		if (result?.code === 200) {
			setBlendList && setBlendList(blendList.map((item) => {
				const tempItem = item;
				if (!item.is_question && item.home_answers.id === id) {
					tempItem.home_answers.is_collect = !item.home_answers.is_collect;
					tempItem.home_answers.collect_num = !item.home_answers.is_collect ? item.home_answers.collect_num - 1 : item.home_answers.collect_num + 1;
				}
				return tempItem
			}))
		}
	}

	// 问题收藏
	const operationSubscripe = async (id: number) => {
		const result = await qaCollect({ qa_id: id })
		if (result?.code === 200) {
			setBlendList && setBlendList(blendList.map((item) => {
				const tempItem = item;
				if (item.is_question && item.home_questions.id === id) {
					tempItem.home_questions.is_collect = !item.home_questions.is_collect;
					tempItem.home_questions.collect_num = !item.home_questions.is_collect ? item.home_questions.collect_num - 1 : item.home_questions.collect_num + 1;
				}
				return tempItem
			}))
		}
	}

	// 答案点赞与踩
	const operationFabulousAnswer = async (id: number, type: number, likeNum: number, unLikeNum: number) => {
		const result = await qaLike({ qa_id: id, like_type: type })
		if (result?.code === 200) {
			setBlendList && setBlendList(blendList.map((item) => {
				const tempItem = item;
				if (!item.is_question && item.home_answers.id === id) {
					tempItem.home_answers.like_type = type;
					tempItem.home_answers.like_num = likeNum;
					tempItem.home_answers.unlike_num = unLikeNum;
				}
				return tempItem;
			}))
		}
	}

	// 问题点赞
	const operationFabulous = async (id: number, type: number) => {
		const likeType = type === 0 ? 1 : 0;
		const result = await qaLike({ qa_id: id, like_type: likeType })
		if (result?.code === 200) {
			setBlendList && setBlendList(blendList.map((item) => {
				const tempItem = item;
				if (item.is_question && item.home_questions.id === id) {
					tempItem.home_questions.like_type = likeType;
					tempItem.home_questions.like_num = likeType === 0 ? item.home_questions.like_num - 1 : item.home_questions.like_num + 1
				}
				return tempItem;
			}))
		}
	}

	// 答案删除
	const delAnswer = async (id: number) => {
		try {
			const result = await qaDelete({ id, status: 3 });
			if (result?.code === 200) {
				message.success("Your answer has been deleted", 1, () => {
					setBlendList && setBlendList(blendList.filter(item => item?.home_answers?.id !== id));
					questionUpdate && questionUpdate();
				})
			}
		} catch (err) {
			console.log(err);
		}
	}

	// 问题删除
	const delQuestion = async (id: number) => {
		try {
			const result = await qaDelete({ id, status: 3 });
			if (result?.code === 200) {
				message.success("Your question has been deleted", 1, () => {
					setBlendList && setBlendList(blendList.filter(item => item?.home_questions?.id !== id))
				})
			}
		} catch (err) {
			console.log(err);
		}
	}
	const opretionCommentNum = (index: number, num: number) => {
		const tempBlendList = JSON.parse(JSON.stringify(blendList));
		tempBlendList[index].home_answers.comment_num = num;
		setBlendList && setBlendList(tempBlendList);
	}

	const privateAndOpen = async (id: number, index: number) => {
		try {
			const result = await profileHide({ qa_id: id });
			if (result?.code === 200) {
				setBlendList && setBlendList(blendList.map((item) => {
					const tempItem = item;
					if (!item.is_question && item.home_answers.id === id) {
						tempItem.home_answers.is_hide_profile = !item.home_answers.is_hide_profile;
					}

					if (item.is_question && item.home_questions.id === id) {
						tempItem.home_questions.is_hide_profile = !item.home_questions.is_hide_profile;
					}
					return tempItem;
				}))
			}
		} catch (err) {
			console.log(err)
		}
	}
	// 问题回答成功
	const answerSuccess = (id: number, question_id: number) => {
		setBlendList && setBlendList(blendList.map((item) => {
			const tempItem = item;
			if (item.is_question && item.home_questions.id === question_id) {
				tempItem.home_questions.answer_num = tempItem.home_questions.answer_num + 1;
				tempItem.home_questions.my_answer_id = id;
			}
			return tempItem;
		}))
	}

	return (
		<>
			{
				blendLoading
					? <Touchable num={3} className={`animate-pulse ${className}`} style={{ animationDuration: '600ms' }} disabled={blendLoading}>
						{ props.skeleton ?? <img className="pt-12 border-b-1 border-[#F6F7F9] w-full" src={PeopleSkeletonSvg} alt="" /> }
					</Touchable>
					: (
						<div className={className}>
							<div ref={ref} id="grow-option-list" className={['rounded-6', blendList.length !== 0 ? 'pt-12' : '', isPullDown ? styles.auto : ''].join(' ')}>
								<List list={blendList} item={(item, index) => (
									item.is_question
										? <Question
											operationFabulous={operationFabulous}
											operationSubscripe={operationSubscripe}
											privateAndOpen={privateAndOpen}
											delQuestion={delQuestion}
											key={index}
											index={index}
											answerSuccess={answerSuccess}
											item={item.home_questions}
											spotBtnFlag={spotBtnFlag}
											seed={item.my_seed}
										/>
										: <Answer
											delAnswer={delAnswer}
											opretionCommentNum={opretionCommentNum}
											key={index}
											index={index}
											operationFabulousAnswer={operationFabulousAnswer}
											opretionCollect={opretionCollect}
											item={item.home_answers}
											spotBtnFlag={spotBtnFlag}
											privateAndOpen={privateAndOpen}
											hideAnswerWithinQuestion={hideAnswerWithinQuestion}
											seed={item.my_seed}
										/>
									)}
								/>
								{
									!blendHasMoreFlag && blendList.length !== 0 && !loadingMoreFlag && (
										<div className={styles['no-more']}>
											No more
										</div>
									)
								}
								{
									loadingMoreFlag && (
										<div className={styles['no-more']}>
											<img className="h-24" src={loadingMoreGif} alt="" />
										</div>
									)
								}
							</div>
							{
								!blendList.length
								&&
								<wc-fill-remain class="flex items-center">
									<NoData type={noDataType} />
								</wc-fill-remain>
							}
						</div>
					)
			}
		</>
	)
}

export default memo(forwardRef(GrowContent));

const List = <T,>(props: { list: T[], item: (e: T, i: number) => ReactNode }) => {
	const list = useMemo(() => props.list.map(props.item), [props.list])
	return <>{list}</>
}