import type { DataRouteItem } from "./data";

import homSvg from "@/assets/img/header/tab/home.svg";
import homeSselectSvg from "@/assets/img/header/tab/home-select.svg";
import earnSvg from "@/assets/img/header/tab/explore.svg";
import earnSselectSvg from "@/assets/img/header/tab/explore-select.svg";
import noticeTabImg from "@/assets/img/notice/notice-tab.svg";
import noticeTabSelectImg from "@/assets/img/header/tab/notice-select.svg";

// const Home = lazy(() => import('../pages/home/index'));
// const Home = lazy(() => import('../pages/home/index'))
// const My = lazy(() => import('../pages/my/index'));
// const My = lazy(() => import('../pages/my/index'))
// 首页
import Grow from "../pages/grow/index";
// 首页搜索
import GrowSearch from "../pages/grow/search";
// 登录
import Login from "../pages/login/index";
import Search from "../pages/search/index";
// 钱包
import Wallet from "../pages/wallet/index";
import AddQuestionNew from "../pages/publish/addQuestionNew";
// // 问题列表
import AnswerQuestions from "../pages/publish/answerQuestionList";
// // 答案详情
import GrowDetail from "../pages/growDetail";
// // 问题详情
import QuestionDetail from "../pages/growDetail/question";
// // 全屏回答
import FullAnswer from "../pages/publish/fullAnswer";
// // 种子首页
import Earn from "../pages/earn";
// // 所有种子列表
import AllSeeds from "../pages/earn/allSeeds";
// // 个人中性
import Profile from "../pages/profile";
// import Example from "../pages/example";
// // 个人编辑
import EditProfile from "@/pages/profile/editProfile";
// // 关注列表
// import Follow from "@/pages/follow";
// // 个人相册
import PhotoAlbum from "@/pages/photoAlbum";
// // sending 转账记录
import SpendingRecord from "@/pages/wallet/spandingRecords";
// // 钱包send页面
import AssetSend from "@/pages/wallet/send";
// // 钱包transfer
import Transfer from "@/pages/wallet/transfer";
// // 链上钱包转账记录
import WalletRecord from "@/pages/wallet/walletRecords";
// // 钱包重置账号密码
import RestoreWalletAccount from "@/pages/wallet/restoreWalletAccount";
// // 通知
import Notice from "@/pages/notice"; 
// // 话题
import Topic from "@/pages/topic";

const routes: DataRouteItem[] = [
  {
    path: "/",
    exact: true,
    redirect: "/grow",
    component: Grow,
    KeepAlive: true
  },
  {
    path: '/login',
    exact: true,
    component: Login,
    KeepAlive: false
  },
  {
    path: '/grow',
    exact: true,
    component: Grow,
    KeepAlive: true,
    bg: '#f1f2f3',
    tab: true,
    icon: homSvg,
    icon1: homeSselectSvg
  },
  {
    path: '/search',
    exact: true,
    component: Search,
    KeepAlive: true
  },
  {
    path: '/growSearch',
    exact: true,
    component: GrowSearch,
    KeepAlive: false,
    // bg: '#F5F6F7'
  },
  {
    path: '/growDetail',
    exact: true,
    component: GrowDetail,
    KeepAlive: false,
    bg: '#f1f2f3'
  },
  {
    path: '/questionDetail',
    exact: true,
    component: QuestionDetail,
    KeepAlive: false,
    bg: '#f1f2f3'
  },
  // 发布问题与回答
  {
    path: '/addQuestion',
    exact: true,
    component: AddQuestionNew,
    KeepAlive: false,
    bg: '#fff'
  },
  // {
  //   path: '/addQuestionNew',
  //   exact: true,
  //   component: AddQuestionNew,
  //   KeepAlive: false
  // },
  {
    path: '/answerQuestions',
    exact: true,
    component: AnswerQuestions,
    KeepAlive: false,
    bg: '#f1f2f3'
  },
  { // 全屏回答问题
    path: '/fullAnswer',
    exact: true,
    component: FullAnswer,
    KeepAlive: false
  },
  // {
  //   path: '/example',
  //   exact: true,
  //   component: Example,
  //   KeepAlive: false
  // },
  { // Earn
    path: '/earn',
    exact: true,
    component: Earn,
    KeepAlive: false,
    tab: true,
    icon: earnSvg,
    icon1: earnSselectSvg
  },
  { // 全部种子
    path: '/allSeeds',
    exact: true,
    component: AllSeeds,
    KeepAlive: false
  },
  { // 个人页面
    path: '/profile',
    exact: true,
    component: Profile,
    KeepAlive: false
  },
  { // 个人编辑页面
    path: '/editProfile',
    exact: true,
    component: EditProfile,
    KeepAlive: false
  },
  // { // 用户列表
  //   path: '/follow',
  //   exact: true,
  //   component: Follow,
  //   KeepAlive: false
  // },
  { // 个人相册
    path: '/photoAlbum',
    exact: true,
    component: PhotoAlbum,
    KeepAlive: false,
    bg: '#F1F2F3'
  },
  // // 钱包
  {
    path: '/wallet',
    exact: true,
    component: Wallet,
    KeepAlive: false
  },
  {
    path: '/transfer',
    exact: true,
    component: Transfer,
    KeepAlive: false
  },
  {
    path: '/assetSend',
    exact: true,
    component: AssetSend,
    KeepAlive: false
  },
  {
    path: '/spendingRecord',
    exact: true,
    component: SpendingRecord,
    KeepAlive: false
  },
  {
    path: '/walletRecord',
    exact: true,
    component: WalletRecord,
    KeepAlive: false
  },
  {
    path: '/restoreWalletAccount',
    exact: true,
    component: RestoreWalletAccount,
    KeepAlive: false
  },
  {
    path: '/notice',
    exact: true,
    component: Notice,
    KeepAlive: false,
    tab: true,
    icon: noticeTabImg,
    icon1: noticeTabSelectImg
  },
  {
    path: '/topic',
    exact: true,
    component: Topic,
    KeepAlive: false,
    bg: '#F6F7F9'
  },
];
export default routes;
