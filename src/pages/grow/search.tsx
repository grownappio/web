import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { InfiniteScroll, Toast } from "antd-mobile";
import Input from "@/components/SearchInput";
import Tabs from "@/components/Tabs";
import { SEX_LIST } from "@/units/commonData";
import { useGetList } from "@/hooks/useGetList";
import { followPeople } from "./service";
import ContentComponent from './components/Content';
import { useSearchQuerys } from "@/hooks/useSearchQuerys";
import Touchable from "@/components/Touchable";
import { useData } from "@/reducer";
import NoData from "./components/Nodata";

import BackSvg from '@/assets/img/back.svg'
import iconImg from '@/assets/img/header/wallect3.png'
import locationSvg from '@/assets/img/follow/location.svg'
import PeopleSkeletonSvg from './people-skeleton.svg'

const tabs = [
  { label: 'Answers', value: 1 },
  { label: 'Questions', value: 0 },
  { label: 'People', value: 2 },
]

export default function SearchGrow() {
  const history = useHistory()
  const params = useSearchQuerys({ type: tabs[0].value, key: '' })
  const { userInfo } = useData()
  
  const [search, setSearch] = useState(params.key)
  
  const people = useGetList({ page: { page_num: 1, page_size: 80 }, search }, { url: '/home/people', list: e => e, hasMore: e => !!e?.length, numKey: 'page.page_num', delay: 600 })
  const qa = useGetList({ page: { page_num: 1 }, search_sign: params.type, search }, { url: '/home/qa/list', list: e => e, hasMore: e => !!e?.length, numKey: 'page.page_num', delay: 600 })

  const aaa = params.type === 2 ? people : qa

  useEffect(() => {
    resetPage()
    // 设置背景色
    // @ts-ignore
    setTimeout(() => document.body.style.background = params.type === 2 ? null : '#F5F6F7', 100);
  }, Object.values(params))

  function resetPage() {
    aaa.list.length = 0
    document.documentElement.scrollTop = 0
    // 
    if (params.type === 2) {
      people.resetPage({ search })
    } else {
      qa.resetPage({ search, search_sign: params.type })
    }
  }

  async function checkFollow(e: any) {
    await followPeople(
      { user_id: e.id },
      {
        showError: () => Toast.show({ content: e.is_follow ? 'Unfollow failed' : 'Follow failed', duration: 1000, maskClassName: 'error' }),
      }
    )
    const bool = e.is_follow = !e.is_follow
    people.setList([...people.list])
    Toast.show({ content: bool ? 'Follow succeeded' : 'Unfollow succeeded', duration: 1000 })
  }

  function toProfile(id: number) {
    history.push(`profile?id=${id}`)
  }
  

  return (
    <div className="">
      <div className="sticky top-0 bg-white z-10">
        <div className="flex py-4 px-16">
          <img className="w-24 mr-16" src={BackSvg} alt="" onClick={useHistory().goBack} />
          <Input className='flex-1 rounded-md bg-[#1124380A]' placeholder="Search Grown" value={search} onInput={setSearch} onEntry={e => params.key = e} />
        </div>

        <Tabs value={params.type} className="sticky px-24 leading-[3.2]" options={tabs} style={{'--tab-flex': 'unset'}} onChange={e => params.type = e} />
      </div>
      
      {
        params.type === 2
        ? people.list.map((e, i) => (
          <div key={e.id} className="relative flex flex-col p-16 border-b-1 border-[#F6F7F9] bg-white">
            <div>
              <img className="float-left mr-8 w-40 h-40 rounded" src={e.icon ?? iconImg} alt="" onClick={() => toProfile(e.id)} />
              <button className={`float-right py-6 w-80 text-white bg-primary rounded-6 ${e.is_follow && '!bg-[#11243820] !text-inherit opacity-60'} ${userInfo.id === e.id ? 'hidden' : ''}`} onClick={() => checkFollow(e)}>
                {e.is_follow ? 'Following' : 'Follow'}
              </button>
              <div className="flex items-center leading-[1.2]">
                <span className="max-w-128 flex-shrink-0 truncate font-medium" onClick={() => toProfile(e.id)}>{e.nick_name}</span>
                <span className="mr-22 opacity-60 truncate">&ensp;@{e.name}</span>
              </div>
              <div className="flex items-center mt-4">
                <img className="inline-block mr-6 w-18 h-18" src={SEX_LIST[e.sex || 5].icon} alt="" />
                <div className="w-18 flex-shrink-0">{e.age || 0}</div>
                <img className="inline-block ml-26 mr-6 w-18 h-18" src={locationSvg} alt="" />
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{e.location || '--'}</span>
              </div>
            </div>
            <div className={"opacity-60 mt-12 ml-48 line-clamp-3 break-all" + (!e.intro ? 'hidden' : '')}>
              {e.intro}
            </div>
          </div>
        ))
        : <ContentComponent
            className="pb-12 px-12"
            blendLoading={qa.refreshing}
            blendHasMoreFlag={qa.hasMore}
            loadingMoreFlag={qa.loadingMore}
            currentTabID={0}
            blendList={qa.list}
            setBlendList={qa.setList}
            noDataType={params.type === 0 ? 0 : 4}
          />
      }

      {/* people skeleton */}
      { people.refreshing && 
        <Touchable className="animate-pulse" style={{ animationDuration: '600ms' }} disabled={people.loading}>
          <img className="p-16 border-b-1 border-[#F6F7F9] w-full" src={PeopleSkeletonSvg} alt="" />
        </Touchable>
      }

      <InfiniteScroll hasMore={aaa.hasMore} loadMore={() => aaa.loadmore()!}>
        <div className={params.type !== 2 ? 'hidden' : ''}>
          <div>{ !aaa.empty && !aaa.hasMore ? 'No more' : '' }</div>
          <div>{ !aaa.empty && aaa.loadingMore ? 'Loading……' : '' }</div>
          <div>{ aaa.empty && <NoData type={2} /> }</div>
        </div>
      </InfiniteScroll>

    </div>
  );
}
