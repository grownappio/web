export type QuestionsRequestParameters = {
  id?: number
  user_id?: number;
  context?: string;
  img_info?: string;
  pic_info?: string
  type?: number;
  view?: number;
  status?: number;
  tag_ids?: any;
  tag_names?: string[];
  answer_id?: number;
  is_hide?: boolean;
}