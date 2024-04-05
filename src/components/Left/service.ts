import request from "@/units/request";

/**
 * 获取轮播图
 */
export async function getBannerWorksList() {
  return request({
    method: "POST",
    url: "/work/getBannerWorksList"
  });
}

/**
 * 邮箱登录
 */
export async function userRegLogin(data: any) {
  return request({
    method: "POST",
    url: "/rift/userLogin",
    data
  });
}

/**
 *  设置钱包地址
 */
export async function postWalletAdders(data: any) {
  return request({
    method: "POST",
    url: "/rift/connectWallet",
    data
  });
}
/**
 *  返回钱包地址
 */
export async function getLastWallet() {
  return request({
    method: "POST",
    url: "/rift/getLastWallet",
  });
}

// 验收token
export async function verifyToken(data: { token: string, jump?: boolean }) {
  return request({
    method: "POST",
    url: "/rift/verifyToken",
    data
  });
}

/**
 * 获取钱包数据
 */
 export async function userBalance(data?: any) {
  return request({
    method: "POST",
    url: "/user/balance",
    data
  });
}