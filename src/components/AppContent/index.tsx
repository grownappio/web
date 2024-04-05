import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import routes from "@/router/index";
import { initData } from "./init";
import RouterView from "@/router/RouterView";
import { useData } from "@/reducer";
import { SafeArea, FloatingBubble } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import BottomTabBar from "@/components/BottomTabBar";
import './index.less';
import { showActionSheet } from "../_utils/Confirm";

import addQuestionImg from "@/assets/img/publish/add-question.svg";
import answerQuestionsImg from "@/assets/img/publish/answer-questions.svg";

const AppContent = () => {
  const state = useData();
  const history = useHistory();
  const { pathname } = useLocation()

  const isTab = routes.some(e => e.path === pathname && e.tab)

  useEffect(() => {
    if (state.isLoging) {
      initData();
    }
  }, [state.isLoging])

  // 设置背景色
  useEffect(() => {
    document.body.style.background = routes.find(e => e.path === pathname)?.bg! ?? null
  }, [pathname])

  // 操作 push
  const openMenu = () => {
    showActionSheet({
      cancelText: 'Cancel',
      actions: [
        { key: 'add-question', text: 'Add question', icon: addQuestionImg, onClick: () => history.push('/addQuestion') },
        { key: 'answer-question', text: 'Answer questions', icon: answerQuestionsImg, onClick: () => history.push('/answerQuestions') },
      ]
    })
  }

  return (
    <div className="App">
      {/* <SafeArea position='top' /> */}

      <main>
        <RouterView routes={routes} />
      </main>

      {isTab && <BottomTabBar />}
      
      <SafeArea position='bottom' />

      {/* push按钮 */}
      <FloatingBubble
        className={isTab ? 'active-shadow' : 'hidden'}
        onClick={openMenu}
        style={{
          '--initial-position-bottom': 'calc(.58rem + env(safe-area-inset-bottom))',
          '--initial-position-right': '.12rem',
          '--edge-distance': '.12rem',
          '--size': '.5rem'
        }}
        axis='y'
      >
        <AddOutline fontSize={30} />
      </FloatingBubble>
    </div>
  )
}

export default AppContent;