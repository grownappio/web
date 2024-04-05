import { NativeProps } from "antd-mobile/es/utils/native-props";
import React from "react";
import { Link } from "react-router-dom";


export type TypeuserInfo = {
	age?: number;  // 年龄 可选
	album_num?: number;  // 相册数量 可选
	albums?: string[]; // 相册
	fans_num: number; // 粉丝数量 可选
	following_num?: number; // 关注数量 可选
	icon?: string; // 用户头像 可选
	id: number; // 用户id 可选
	location?: string; // 位置 可选
	name?: string; // 用户名(唯一)可选
	name_color?: string;// 用户名(颜色)可选
	intro?: string; // 用户简介
	nick_name?: string; // 昵称 可选
	sex: number; // 性别 1.男 2.女 3.中性 4.双性 5.无性别
	is_follow?: boolean; // 是否关注
	is_self?: boolean; // 是否是自己本人
}

export type PersonCardProps = {
	id: number;
	name?: any;
	children?: any;
} & NativeProps

const PersonCard = (props: PersonCardProps) => {
	return <Link className={'text-inherit ' + props.className} to={`/profile?id=${props.id}`}>{props.children ?? props.name}</Link>
}

export default PersonCard;