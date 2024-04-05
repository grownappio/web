import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Input from '@/components/SearchInput'
import { ReactSVG } from "react-svg";
import { useStateWithHistory, useLocalStorage } from 'react-use'
import { getHots, getTopics } from './service'
import { getPeopleNum } from "@/units";

import BackSvg from '@/assets/img/back.svg'
import HistorySvg from '@/assets/img/search/history.svg'
import BroomSvg from '@/assets/img/search/broom.svg'
import TopicSvg from '@/assets/img/search/topic.svg'
import HotSvg from '@/assets/img/search/hot.svg'

const Search = () => {
  const history = useHistory()
  const [text, setText] = useState('')
  const [historys, setHistorys] = useLocalStorage('search:historys', [] as string[])
  const [, addHistory, stateHistory] = useStateWithHistory(historys?.at(-1) ?? '', 11, historys)

  function onEntry(s: string) {
    if (s) {
      addHistory(s)
      setHistorys(stateHistory.history.filter(e => e))
    }
    onSearch(s)
  }

  function onClear() {
    stateHistory.history.length = 0
    stateHistory.position = 0
    setHistorys(stateHistory.history)
  }

  function onSearch(s: string) {
    history.push(`growSearch?key=${s}`)
  }
  
  // hot
  const [hots, setHots] = useState([] as any[])
  async function getHotsData() {
    setHots((await getHots()).data?.hots ?? [])
  }
  useEffect(() => { getHotsData() }, [])
  
  // topic
  const [topics, setTopics] = useState([] as any[])
  async function getTopicsData() {
    setTopics((await getTopics()).data?.list ?? [])
  }
  useEffect(() => { getTopicsData() }, [])

  return (
    <div className="p-16 pt-0 text-[#112438] bg-white">
      <div className="sticky top-0 flex py-4 bg-white z-10">
        <img className="w-24 mr-16" src={BackSvg} alt="" onClick={useHistory().goBack} />
        <Input className='flex-1 rounded-md bg-[#1124380A]' placeholder="Search Grown" value={text} onInput={e => setText(e)} onEntry={onEntry} />
      </div>

      <div className="mt-22 flex items-center leading-[1] font-bold">
        <img className="w-16 h-16 mr-6" src={HistorySvg} alt="" />
        History
        <div className="flex-1" />
        <ReactSVG className="w-20 h-20 -m-2 opacity-40 active-shadow" src={BroomSvg} onClick={onClear} />
      </div>

      <div className="flex flex-wrap mt-16 text-12 text-[#112438CC]">
        {stateHistory.history.filter(e => e).map((e, i) => (
          <div key={i} className="mb-8 mr-8 py-8 px-12 text-12 leading-[1.2] bg-[#1124380A] rounded-md" onClick={() => onSearch(e)}>{e}</div>
        ))}
      </div>

      <div className="mt-12 mb-20 b-b-1"></div>

      <div className="mt-20 flex items-center leading-[1] font-bold">
        <img className="w-16 h-16 mr-6" src={HotSvg} alt="" />
        Hot search
      </div>

      <div className="grid grid-cols-[1.7rem_auto] mt-8">
        {hots.slice(0, 10).map((e, i) => (
          <span key={i} className="my-8 leading-[19px] font-medium truncate even:pl-20 even:b-l-1 !border-l-text/6" onClick={() => onSearch(e.word)}>{e.word}</span>
        ))}
      </div>

      <div className="mt-12 mb-20 b-b-1"></div>

      <div className="mt-22 flex items-center leading-[1] font-bold">
        <img className="w-16 h-16 mr-6 " src={TopicSvg} alt="" />
        Hot topic
      </div>
      
      <div className="mt-6">
        {topics.map((e, i) => (
          <div key={i} className="grid grid-cols-[auto,1fr] py-10" onClick={() => history.push(`topic?id=${e.id}`)}>
            <div className={`row-span-2 w-16 h-16 mr-4 text-12 text-center ${i < 3 ? 'text-[#FF3D00] italic' : 'text-[#FF7B3A]'} font-bold`}>{i + 1}</div>
            <span className="truncate font-medium">{e.content}</span>
            <div className="text-12 opacity-60">
              {getPeopleNum(e.qa_num)} Q&As
              &emsp;
              {getPeopleNum(e.visit_num)} Views
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search