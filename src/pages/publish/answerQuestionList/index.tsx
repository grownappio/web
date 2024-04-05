import React, { useEffect, useMemo } from "react";
import Nodata from "../../grow/components/Nodata";
import { qaLike, qaCollect } from "../service";
import Appbar from "@/components/Appbar";
import Tabs from "@/components/Tabs";
import Question from "@/pages/grow/components/Question";
import Scroll from "@/components/Scroll";
import { useGetList } from "@/hooks/useGetList";
import { useSearchQuerys } from "@/hooks/useSearchQuerys";

const AnswerQuestions = () => {
  const qs = useSearchQuerys({ tab: 2 })
  const query = useMemo(() => ({ ...qs, page: { page_num: 1 } }), [])
  const aaa = useGetList(query, { url: '/explore/qa/list', list: e => e?.list, hasMore: e => e?.list, numKey: 'page.page_num', sizeKey: 'page.page_size', delay: 600 })

  useEffect(() => {
    aaa.resetPage({ ...qs })
  }, [qs.tab])

  // 问题点赞
  const operationFabulous = async (id: number, type: number) => {
    const likeType = type === 0 ? 1 : 0;
    const result = await qaLike({ qa_id: id, like_type: likeType })
    if (result?.code === 200) {
      aaa.setList(aaa.list.map((item) => {
        const tempItem = item;
        if (item.id === id) {
          tempItem.like_type = likeType;
          tempItem.like_num = likeType === 0 ? item.like_num - 1 : item.like_num + 1
        }
        return tempItem;
      }))
    }
  }
  // 问题订阅
  const operationSubscripe = async (id: number) => {
    const result = await qaCollect({ qa_id: id })
    if (result?.code === 200) {
      aaa.setList(aaa.list.map((item: any) => {
        const tempItem = item;
        if (item.id === id) {
          tempItem.is_collect = !item.is_collect;
          tempItem.collect_num = !item.is_collect ? item.collect_num - 1 : item.collect_num + 1;
        }
        return tempItem
      }))
    }
  }

  const answerSuccess = (id: number, qid: number) => {
    aaa.setList(aaa.list.map((item) => {
      if (item.id === qid) {
        return {
          ...item,
          my_answer_id: id
        }
      }
      return item
    }));
  }

  return (
    <>
      <Appbar className="bg-white border-b-1 border-solid border-bc" title='Answer Questions' />
      <Tabs className="sticky top-0 h-44 z-10 after:border-bc" style={{ '--tab-flex': 1, '--bar-w': '2em', '--bar-h': '2px' }} value={qs.tab} options={[{ value: 2, label: 'New' }, { value: 1, label: 'Hot' }]} onChange={e => qs.tab = e} />
      <Scroll
        className="p-12"
        list={aaa.list}
        refreshing={aaa.refreshing}
        loadingMore={aaa.loadingMore}
        item={(e, i) => 
          <Question
            operationFabulous={operationFabulous}
            operationSubscripe={operationSubscripe}
            // privateAndOpen={() => {}}
            delQuestion={() => {}}
            key={i}
            index={i}
            answerSuccess={answerSuccess}
            item={e}
            seed={null}
          />
        }
        hasMore={aaa.hasMore}
        empty={aaa.empty ? <Nodata type={0} /> : undefined}
        onLoadmore={aaa.loadmore}
      />
    </>
  )
}

export default AnswerQuestions;