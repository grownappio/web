export type TypeSeedItem = {
  id: number;
  uuid:string;
  created_at?: string;
  user_id?: number;
  chain_id?: number;
  qac_id: number; // 种子来源ID
  type: number; // 1 问题 2 回答 3 评论 4 分享 5邀请回答
  fix_earn: number; // 固定播种收益
  float_earn: number; // 浮动浇水奖励
  if_water: boolean; // 是否浇过水
  status: number // 1 growing 2 matured 3 harvested 4 lost 
  growing_time: string;
  matured_time: string;
  next_time: string; // 更新时间
  time?: string; // 到成熟 或者 到可收获 的倒计时
  updateTime?: string; // 下次更新的倒计时
  times?: number; // 更新次数
  lost?:number; //丢失收益
  received:number //获取收益
}

export type TypeProgressBar = {
  seeding_income: number; // 固定收益
  water_reward: number; // 浮动浇水奖励
  earn_ing: number; // 总收入
  water_remain: number; // 剩余水量
  seeding_income_cap: number; // 固定收益上限
  water_reward_cap: number; // 浇水奖励上限
  earn_ing_cap: number; // 总收入上限
  water_cap: number; // 总水量
  next_to_water: string; // 恢复浇水时间
  is_bind_twitter?: boolean; // 是否绑定推特
}