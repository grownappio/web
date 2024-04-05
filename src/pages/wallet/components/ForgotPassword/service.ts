import request from "@/units/request";



/**
 * 发送验证码
 */
export async function sendEmailCode(data: any) {
    return request({
        method: "POST",
        url: "/wallet/sendEmailCode",
        data
    });
}

/**
 * 验证邮箱是否与用户登录邮箱匹配
 */
 export async function checkEmail(data: any) {
  return request({
      method: "POST",
      url: "/wallet/checkEmail",
      data,
      showError() {},
  });
}

// 验证邮箱验证码
export async function checkEmailCode(data: any) {
  return request({
      method: "POST",
      url: "/wallet/checkEmailCode",
      data
  });
}

// 重置密码
export async function forgotPassword(data: any) {
  return request({
      method: "POST",
      url: "/wallet/forgotPassword",
      data
  });
}