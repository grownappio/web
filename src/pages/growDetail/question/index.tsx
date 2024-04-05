import React, { useState, useEffect, useRef, useMemo } from "react";
import { calculationThousand } from "@/units/index";
import { useHistory } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import { Stage as SeedStage } from '@/components/SeedTab/type';
import styles from "./index.module.less";
import { qaLike, qaCollect, qaDelete } from "../../grow/service";
import { growQAPageDetail } from "../service";
import { receiveEarn, waterGrownSeed } from '@/pages/earn/service';
import ContentComponent from '../../grow/components/Content';
import { setBrowerTabTitle } from '@/utils';
import { dataLenTrim } from "@/pages/publish/utils";
import Appbar from "@/components/Appbar";
import TabSeed from "@/components/SeedTab";
import { useData } from "@/reducer";
import { Confirm } from "@/components/_utils/Confirm";
import { message } from "antd";
import { checkAnswerAndQuestionIsCanEdit, checkEarnType } from "@/pages/grow/comment";
import Options from "@/components/Options";
import OccupyBox from "@/components/OccupyBox";
import { useGetList } from "@/hooks/useGetList";
import { useSearchQuerys } from "@/hooks/useSearchQuerys";
import DelModalTip from "@/pages/grow/components/DelModalTip";
import { InfiniteScroll } from "antd-mobile";

import editQuestionImg from "@/assets/img/grow/editAndDel/edit-question.svg";
import delImg from "@/assets/img/grow/editAndDel/del.svg";
import hotImg from "@/assets/img/filter/hot.svg";
import newImg from "@/assets/img/filter/new.svg";
import upvoteImg from "@/assets/img/filter/upvotes.svg";
import answerQuestionWhiteImg from '@/assets/img/grow/editAndDel/answer-question-white.svg';

const sortArr = [
  { value: 2, label: 'Hot', icon1: hotImg },
  { value: 1, label: 'New', icon1: newImg },
  { value: 3, label: 'Upvotes', icon1: upvoteImg }
]

let timer: any = null;

export default function QuestionDetail() {
  const history = useHistory();
  const state = useData()
  const listRef: any = useRef();
  const [questionData, setQuestionData] = useState<any>({});
  const [seedInfo, setSeedInfo] = useState<any>({});
  
  const qs = useSearchQuerys({ id: 0, type: 1 })
  const query = useMemo(() => ({ ...qs, page: { page_num: 1, page_size: 20 } }), [])
  const aaa = useGetList(query, { url: '/qa/home/getAnswerCards', list: e => e.list, hasMore: e => !!e?.list?.length, numKey: 'page.page_num', sizeKey: 'page.page_size',  delay: 600 })

  const isSelf = useMemo(() => questionData.user_id === state.userInfo.id, [questionData.user_id, state.userInfo.id])

  const menus = [
    {
      key: 'edit',
      icon: editQuestionImg,
      text: 'Edit question',
      hide: !((dataLenTrim(questionData.context) <= 30 && !questionData.description) || !questionData.answer_num) || !isSelf,
      onClick() {
        const e = checkAnswerAndQuestionIsCanEdit(questionData.id)
        if (!e) message.warning('The question does not support editing')
        else history.push(`/addQuestion?id=${questionData.id}`)
      },
    },
    {
      key: 'del',
      icon: delImg,
      text: 'Delete question',
      // 问题底下没有答案及可删除
      hide: questionData.answer_num || !isSelf,
      async onClick() {
        const status = await checkEarnType(questionData.id, 1)
        await Confirm({
          title: 'Delete question',
          content: <DelModalTip content="question" seedStatus={status} />
        })
        await qaDelete({ id: questionData.id, status: 3 })
        message.success("Your question has been deleted", 1, () => history.replace('/grow'))
      }
    }
  ]

  // 问题订阅
  const operationSubscripe = async (id: number) => {
    const result = await qaCollect({ qa_id: id })
    if (result?.code === 200) {
      setQuestionData({
        ...questionData,
        is_collect: !questionData.is_collect,
        collect_num: questionData.is_collect ? questionData.collect_num - 1 : questionData.collect_num + 1
      })
    }
  }

  // 问题点赞
  const operationFabulous = async (id: number, type: number) => {
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

  // 成功回答问题
  const answerSuccess = (answer_id: number) => {
    setQuestionData({
      ...questionData,
      my_answer_id: answer_id,
      answer_num: questionData.answer_num + 1
    })
    aaa.resetPage()
  }

  const getQuestionData = async () => {
    try {
      const result = await growQAPageDetail({ id: +qs.id })
      if (result?.code === 200) {
        setQuestionData(result?.data?.question_detail || {})
        setSeedInfo(result?.data?.associated_seed || {})
      }
    } catch (err) {
      console.log(err)
    }
  }

  const isHideSeed = () => {
    const { is_self } = questionData || {};
    const { status, id } = seedInfo || {};

    return !id || !is_self || [3, 4].includes(status);
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
    getQuestionData();
  }

  const handleSeedOnRecieve = async () => {
    await receiveEarn({ earn_id: seedInfo.id });
    getQuestionData();
  }

  useEffect(() => {
    setBrowerTabTitle(`Question #${qs.id} / Grown`);
    getQuestionData();
    aaa.resetPage({ ...qs })
  }, Object.values(qs))

  useEffect(() => {
    const { next_time, status } = seedInfo;
    const nextUpdateTime = next_time * 1000 - new Date().getTime();
    if ([1, 2].includes(status)) {
      if (timer) {
        clearInterval(timer);
      }
      timer = setTimeout(() => {
        getQuestionData();
      }, nextUpdateTime);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    }
  }, [seedInfo])

  return (
    <div>
      <Appbar
        className="sticky top-0 b-b-1 z-10"
        title={`Question #${qs.id}`}
        menus={menus}
        right={!isHideSeed() ? <TabSeed startTime={getTime().start || 0} endTime={getTime().end || 0} money={canGetMoney()} stage={showSeedStatus()} reverse={isReverse()} onRecieve={handleSeedOnRecieve} onWater={handleSeedOnWater} /> : undefined}
      />
      <div ref={listRef} className={styles['home-body']}>
        <div className='bg-white'>
          <QuestionCard type={'question'} answerSuccess={answerSuccess} operationSubscripe={operationSubscripe} operationFabulous={operationFabulous} questionData={questionData} />

          <div className="flex justify-between py-14 px-16 b-t-1">
            <span className="opacity-80">All {calculationThousand(questionData?.answer_num || 0)} answers</span>
            <Options value={qs.type} options={sortArr} onChange={e => qs.type = e} />
          </div>
        </div>

        <ContentComponent
          className="px-12"
          noDataType={questionData?.show_type === 2 ? 6 : 4}
          currentTabID={2}
          blendLoading={aaa.refreshing}
          loadingMoreFlag={aaa.loadingMore}
          blendHasMoreFlag={aaa.hasMore}
          blendList={aaa.list}
          setBlendList={aaa.setList}
          isPullDown={false}
          hideAnswerWithinQuestion={true}
          questionUpdate={getQuestionData}
        />
      </div>

      <InfiniteScroll className="p-0" hasMore={aaa.hasMore} loadMore={aaa.loadmore}>
        <div></div>
      </InfiniteScroll>

      <OccupyBox className='fixed bottom-0 flex items-center w-full py-10 px-16 space-x-12 b-t-1 border-text/5 bg-white shadow-[0_0_10px] shadow-text/10' safe='bottom'>
        {/* <img className='w-32 h-32 rounded-full' src={state.userInfo.icon} alt='' />
        <div className='py-6 px-16 flex-1 rounded-full text-text/30 bg-text/5' onClick={() => history.push(`/fullAnswer?id=${questionData.id}&answer_id=${questionData.my_answer_id}`)}>Express your ideas.</div> */}
        <button className="btn-primary flex items-center justify-center p-12 w-full" onClick={() => history.push(`/fullAnswer?id=${questionData.id}&answer_id=${questionData.my_answer_id}`)}>
          <img className="drop mr-4 w-18 h-18" src={answerQuestionWhiteImg} alt="" />
          { questionData.my_answer_id ? ' Answered' : ' Answer' }
        </button>
      </OccupyBox>
    </div>
  );
}
