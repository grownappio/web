import request from "@/units/request";

export type userInfo = {
    id: number;
    name?: string;
    icon: string;
    nick_name: string;
    sex: number;
    location: string;
    birthday: number;
    intro: string;
    expertises: string;
    interests: string;
    can_edit_username:boolean;
}



// 获取个人信息
export async function getProfile(data: any) {
    return request({
        method: "POST",
        url: "/profile",
        data,
    });
}

export async function getUserIcon() {
    return request({
        method: "POST",
        url: "/user/icon",
    });
}


export async function editProfile(data: any) {
    return request({
        method: "POST",
        url: "/profile/edit",
        data,
    });
}

// 添加相册
export async function addAlbum(data: any) {
    return request({
        method: "POST",
        url: "/album/add",
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

// 获取相册
export async function queryBlbum(data: any) {
    return request({
        method: "POST",
        url: "/album",
        data,
    });
}

// 获取第三方平台登录链接
export async function getLoginUrl(data: any) {
    return request({
        method: "POST",
        url: "/platform/get_login_url",
        data,
    });
}

// 绑定第三方平台
export async function platformBind(data: any) {
    return request({
        method: "POST",
        url: "/platform/bind",
        data,
    });
}

// 获取个人的问答数据
export async function profileQa(data: any) {
    return request({
        method: "POST",
        url: "/profile/qa",
        data,
    });
}