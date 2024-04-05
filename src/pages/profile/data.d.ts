export type TypeuserInfo = {
  age?: number;  // 年龄 可选
  album_num: number;  // 相册数量 可选
  bgm_pic?: string; //  封面地址 可选
  bind_platform?: number[]; // 绑定的平台 可选
  can_edit_username?: boolean; // 是否能够编辑用户姓名
  expertises?: string; // 擅长 可选
  fans_num: number; // 粉丝数量 可选
  following_num?: number; // 关注数量 可选
  icon?: string; // 用户头像 可选
  id: number; // 用户id 可选
  interests?: string; // 兴趣 可选
  intro?: string; // 简介
  location?: string; // 位置 可选
  name?: string; // 用户名(唯一)可选
  nick_name?: string; // 昵称 可选
  sex: number; // 性别 1.男 2.女 3.中性 4.双性 5.无性别
  is_follow?: boolean; // 是否关注
  bgm_pic_id?: number; // 封面图关联的图片id
}