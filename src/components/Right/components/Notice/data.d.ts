import createBrowserHistory from "@/units/history";
import answerImg from "@/assets/img/notice/answer.svg";
import commentImg from "@/assets/img/notice/comment.svg";
import followedImg from "@/assets/img/notice/followed.svg";
import likedImg from "@/assets/img/notice/upvote.svg";
import { NoticeTypes } from "@/pages/noticeBoard/types";

import { commentAnswerID } from "./service";

const pageJump = (page: string, params: string) => {
  const hashPath = window.location.hash;
  createBrowserHistory.push(`${page}${params}`);
}

const getAnswetId = async (item: NoticeItem, id: number) => {
  try {
    const result = await commentAnswerID({ comment_id: id })
    if (result.code === 200) {
      pageJump('/growDetail', `?id=${result?.data?.answer_id}&commentId=${id}`);
    }
  } catch (err) {
    console.log(err);
  }
}

export type NoticeItem = {
  id: number;
  content: string; // 文本内容
  reference_id: number; // 引用内容id
  reference?: Omit<Partial<NoticeItem & { type: number /** 1：一级评论；2：二级评论 */ }>, 'reference' | 'reference_is_del' | 'reference_id'>;
  reference_is_del: boolean;
  self_id?: number;
  self_is_del: boolean;
  type: NoticeTypes; // 1: 回答问题 2:评论回答 3:关注用户 4:点赞问题 5: 点赞回答 6:点赞评论
  user_icon: string; // 用户头像
  user_id: number; // 用户id
  user_name: string; // 用户名称
  user_nick_name?: string;
  at_user_id?: number;
  at_user_name?: string;
  created_at: number; // 创建时间
}
// 消息行为数据
export const noticeBehaviorData = {
  1: {
    icon: answerImg,
    tipContent: 'Answered you: ',
    txt: 'answer',
    refTxt: (item: NoticeItem) => 'question',
    onClick: (item: NoticeItem) => pageJump('/growDetail', `?id=${item.self_id}`),
    refClick: (item: NoticeItem) => pageJump('/questionDetail', `?id=${item.reference_id}`)
  },
  2: {
    icon: commentImg,
    tipContent: 'Replied to: ',
    txt: 'reply',
    refTxt: (item: NoticeItem) => item.reference?.type == null ? 'answer' : 'reply',
    onClick: (item: NoticeItem) => getAnswetId(item, item.self_id),
    refClick: (item: NoticeItem) => item.reference?.type == null ? pageJump('/growDetail', `?id=${item.reference_id}`) : getAnswetId(item, item.reference_id)
  },
  3: {
    icon: followedImg,
    tipContent: 'Followed you',
    txt: 'follow',
    refTxt: (item: NoticeItem) => '',
    onClick: (item: NoticeItem) => pageJump('/profile', `?id=${item.user_id}`),
    refClick: (item: NoticeItem) => { }
  },
  4: {
    icon: likedImg,
    tipContent: 'Upvoted your question',
    txt: 'Upvoted question',
    refTxt: (item: NoticeItem) => 'question',
    onClick: (item: NoticeItem) => pageJump('/questionDetail', `?id=${item.reference_id}`),
    refClick: (item: NoticeItem) => pageJump('/questionDetail', `?id=${item.reference_id}`)
  },
  5: {
    icon: likedImg,
    tipContent: 'Upvoted your answer',
    txt: 'Upvoted answer',
    refTxt: (item: NoticeItem) => 'answer',
    onClick: (item: NoticeItem) => pageJump('/growDetail', `?id=${item.reference_id}`),
    refClick: (item: NoticeItem) => pageJump('/growDetail', `?id=${item.reference_id}`),
  },
  6: {
    icon: likedImg,
    tipContent: 'Upvoted your reply',
    txt: 'Upvoted reply',
    refTxt: (item: NoticeItem) => 'reply',
    onClick: (item: NoticeItem) => getAnswetId(item, item.reference_id),
    refClick: (item: NoticeItem) => getAnswetId(item, item.reference_id),
  },
}