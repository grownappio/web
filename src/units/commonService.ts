
import request from "@/units/request";

/**
 * 获取人物信息
 */
 export async function getUserByID() {
  return request({
    method: "POST",
    url: "/user/info"
  });
}

/**
 * 退出登录
 */
 export async function logout() {
  return request({
    method: "POST",
    url: "/user/logout"
  });
}

