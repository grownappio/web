import request from "@/units/request";
// 获取个人信息
export async function getProfile(data: any) {
    return request({
        method: "POST",
        url: "/user/card",
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