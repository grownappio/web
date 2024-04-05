import React, { createContext, useContext, useReducer } from 'react';
import { defaultCurrentChain } from "@/components/Wallets/service";
import { getToken } from "@/units";
// import wallectIcon from "@/assets/img/header/wallect.png";
// import wallectIcon1 from "@/assets/img/header/wallect1.png";

interface TypeState {
  walletList: { name: string; icon: string; num: string; token_address?: string }[];
  SpendingwalletList: { name: string; icon: string; num: string; id?: number }[];
  chainCurrent: { id: number, icon: string; name: string, rpcUrl: string };
  isLoging: boolean;
  searchValue: string;
  userInfo: { icon: string, nickName: string, id: number, name: string }; // 个人信息
  historySearchData: string[]; // 历史搜索数据
  winObj: any;
  earn_plan: number; // 赚取方式
  walletPasswordVisible: boolean; // 钱包密码验证弹窗开关
  forgotPasswordVisible: boolean; // 钱包忘记密码弹窗开关
  if_transfer: boolean,
  // 通知
  notice_num: number; // 未读消息
  follow_flag: boolean; // 关注的人是否有动态
  harvestable_flag: boolean; // 是否有未收获种子
  [k: string]: any;

  // 话题
  topicTipSwitch: boolean; // 话题提示 一天只展示一次
  sidebarTriggerPsw: number;
}

let initState: TypeState = {
  walletList: [],
  SpendingwalletList: [],
  chainCurrent: defaultCurrentChain,
  userInfo: {
    id: 0,
    icon: '',
    nickName: '',
    name: ''
  },
  isLoging: !!getToken(),
  historySearchData: [],
  searchValue: '',
  winObj: {},
  earn_plan: 1,
  // 钱包密码输入框
  walletPasswordVisible: false,
  assetTriggerPsw: 0, // asset触发密码
  sidebarTriggerPsw: 0, // 侧边栏触发密码
  forgotPasswordVisible: false,
  if_transfer: false,
  notice_num: 0,
  follow_flag: false,
  harvestable_flag: false,
  topicTipSwitch: false,
}

type Dispatch = React.Dispatch<{ type: string; value: any; }>

//? 抛出，创建context上下文，可被访问（通过DataContext.provider的value）
export const DataContext = createContext({ Xdata: initState, dispatch: (() => {}) as Dispatch });

//? 抛出，方法可以在普通js中访问
export const dispatchRef = { current: (() => {}) as Dispatch }

//? 抛出，可以在普通js中访问
export let state: TypeState


function countReducer(state: TypeState, action: { type: string, value: any }) {
  switch (action.type) {
    case 'changeUserInfo':
      return {
        ...state,
        userInfo: action.value
      }
    case 'changeSpendingwalletList':
      return {
        ...state,
        SpendingwalletList: action.value
      }
    case 'changeWalletList':
      return {
        ...state,
        walletList: action.value
      }
    case 'changeChainCurrent':
      return {
        ...state,
        chainCurrent: action.value
      }
    case 'changeHistorySearchData':
      return {
        ...state,
        historySearchData: action.value
      }
    case 'changeIsLoging':
      return {
        ...state,
        isLoging: action.value
      }
    case 'changeSearchValue':
      return {
        ...state,
        searchValue: action.value
      }
    case 'changeWinObj':
      return {
        ...state,
        winObj: action.value
      }
    case 'changeEarnPlan':
      return {
        ...state,
        earn_plan: action.value
      }
    // 钱包密码输入框
    case 'changeWalletPasswordVisible':
      return {
        ...state,
        walletPasswordVisible: action.value
      }
    case 'changeAssetTriggerPsw':
      return {
        ...state,
        assetTriggerPsw: action.value
      }
    case 'changeSidebarTriggerPsw':
      return {
        ...state,
        sidebarTriggerPsw: action.value
      }
    case 'changeForgotPasswordVisible':
      return {
        ...state,
        forgotPasswordVisible: action.value
      }
    case 'changeIfTransfer':
      return {
        ...state,
        if_transfer: action.value
      }
    case 'changeNoticeNum':
      return {
        ...state,
        notice_num: action.value
      }
    case 'changeFollowFlag':
      return {
        ...state,
        follow_flag: action.value
      }
    case 'changeHarvestableFlag':
      return {
        ...state,
        harvestable_flag: action.value
      }
    case 'changeTopicTipSwitch':
      return {
        ...state,
        topicTipSwitch: action.value
      }
    default:
      return state
  }
}

//? 抛出，可获取DataContext里的value值
export function useData(): TypeState {
  const { Xdata } = useContext(DataContext);
  return Xdata;
};


// 主函数（可包裹根组件）
export function GlobalLoadingProvider(props: any) {
  //todo useReducer 接受一个 reducer 函数作为参数，reducer 接受两个参数一个是 state 另一个是 action 。
  //todo 然后返回一个状态 count 和 dispath，count 是返回状态中的值，而 dispatch 是一个可以发布事件来更新 state 的。
  //? 修改dispath后更新dataArr！
  const [dataArr, dispatch] = useReducer(countReducer, initState);
  //? 普通js中访问
  // @ts-ignore
  dispatchRef.current = dispatch;
  state = dataArr;
  return (
    <DataContext.Provider value={{ Xdata: dataArr, dispatch }}>
      {props.children}
    </DataContext.Provider>
  );
}