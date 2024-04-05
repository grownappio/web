import { NoticeTypes } from "./types";
import answerImg from "@/assets/img/notice/answer.svg";
import commentImg from "@/assets/img/notice/comment.svg";
import followedImg from "@/assets/img/notice/followed.svg";
import likedImg from "@/assets/img/notice/upvote.svg";

export const behaviorList = {
  [NoticeTypes.ANSWERED]: answerImg,
  [NoticeTypes.REPLYED]: commentImg,
  [NoticeTypes.FOLLOWED]: followedImg,
  [NoticeTypes.LIKED_ANSWER]: likedImg,
  [NoticeTypes.LIKED_QUESTION]: likedImg,
  [NoticeTypes.LIKED_REPLY]: likedImg,
}