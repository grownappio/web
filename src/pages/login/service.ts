import request from "@/units/request";

/**
 * 发送验证码
 */
export async function sendEmailCode(data: {email: string}) {
  return request({
    method: "POST",
    url: "/user/code",
    data,
  });
}


/**
 * 登录
 */
 export async function emailLogin(data: {email: string, code: number | string}) {
  return request({
    method: "POST",
    url: "/user/login",
    data,
  });
}

/**
 * 获取钱包数据
 */
 export async function userBalance(data: any) {
  return request({
    method: "POST",
    url: "/user/balance",
    data
  });
}


/**
 * 获取钱包数据
 */
export async function getBannerList(data?: any) {
    return request({
        method: "POST",
        url: "/home/banner_list",
        data
    });
}