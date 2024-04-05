import request from "@/units/request";

/**
 * 获取种子列表
 */
export async function getEarnList(data: any) {
  return request({
    method: "POST",
    url: "/home/earn/getEarnList",
    data
  });
}

/**
 * 获取收益进度条
 */
export async function getProgressBar() {
  return request({
    method: "POST",
    url: "/home/earn/getProgressBar",
  });
}

/**
 * 浇灌种子
 */
export async function waterGrownSeed(data: any) {
  return request({
    method: "POST",
    url: "/home/earn/waterGrownSeed",
    data
  });
}

/**
 * 判断是否存在于创作白名单种
 */
export async function earnPlanExist(data: any) {
  return request({
    method: "POST",
    url: "/home/earn/earnPlanExist",
    data
  });
}

/**
 * 切换赚取方式
 */
export async function updateEarnList(data: any) {
  return request({
    method: "POST",
    url: "/home/earnWhiteList/updateEarnList",
    data
  });
}

/**
 * 领取收益
 */
 export async function receiveEarn(data: any) {
  return request({
    method: "POST",
    url: "/home/earn/receiveEarn",
    data
  });
}

/**
 * 获取单个种子
 */
 export async function getOneSeed(data: any) {
  return request({
    method: "POST",
    url: "/home/earn/getOneSeed",
    data
  });
}

/**
 * 通过评论ID获取答案ID
 */
 export async function commentAnswerID(data: any) {
  return request({
    method: "POST",
    url: "/comment/commentAnswerID",
    data
  });
}


/**
 * 收获提示框是否关闭
 */
 export async function earnExist() {
  return request({
    method: "POST",
    url: "/home/earn/tipExist"
  });
}

/**
 * 关闭收获提示框
 */
 export async function earnTipClose() {
  return request({
    method: "POST",
    url: "/home/earn/tipClose"
  });
}

/**
 * 判断能不能收获
 */
 export async function receiveAlert(data: any) {
  return request({
    method: "POST",
    url: "/home/earn/receiveAlert",
    data
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