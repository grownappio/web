export type QADetailPageResponse = {
  id: number;
  user_id: number;
  user_nick_name:string;
  user_name:string;
  user_icon:string;
  context: string;
  description:string;
  status: number;
  view: number;
  type: number;
  question_id:number;
  like_num:number;
  unlike_num:number;
  answer_num:number;
  subscript_num:number;
  comment_num:number;
  collect_num:number;
  publish_time:string;
  like_type:number;
  is_subscript:boolean;
  is_collect:boolean;
}