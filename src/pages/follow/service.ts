import request from "@/units/request";

export type follower={
    id:number,
    name:string,
    icon:string,
    nick_name:string,
    intro:string,
    is_follow:boolean,
    sex:number,
    birthday?:number,
    age:number,
    location:string,
}
export type followParams={
    uid?: number,
    page: {
        page_num: number,
        page_size: number,
    }
}

// following
export async function getFollowingList(data: any) {
    return request({
        method: "POST",
        url: "/follow/following",
        data,
    });
}

// following
export async function getFollowerList(data: any) {
    return request({
        method: "POST",
        url: "/follow/follower",
        data,
    });
}

// 关注某人
export async function followPerson(data: any) {
    return request({
        method: "POST",
        url: "/follow",
        data,
    });
}

// 关注某人
export async function getUserNickName(data: any) {
    return request({
        method: "POST",
        url: "/user/simple_info",
        data,
    });
}