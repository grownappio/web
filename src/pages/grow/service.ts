import request, { Config } from "@/units/request";

/**
 * grow首页数据
 */
export async function growHome() {
  return request({
    method: "POST",
    url: "/home",
  });
}

/**
 * 获取历史搜索
 */
export async function homeHistory() {
  return request({
    method: "POST",
    url: "/home/history",
  });
}


/**
 * 清空历史搜索
 */
export async function clearHistory(data: any) {
  return request({
    method: "POST",
    url: "/home/clear_history",
    data
  });
}

/**
 * 清空banner
 */
export async function closeBanner() {
  return request({
    method: "POST",
    url: "/home/close_banner",
  });
}

/**
 * 问题列表
 */
export async function queryQuestionsList(data: any) {
  return request({
    method: "POST",
    url: "/home/questions",
    data
  });
}

/**
 * 答案列表
 */
export async function answersList(data: any) {
  return request({
    method: "POST",
    url: "/home/answers",
    data
  });
}

/**
 *  收藏
 */
export async function qaCollect(data: any) {
  return request({
    method: "POST",
    url: "/qa/collect",
    data
  });
}

/**
 *  点赞
 */
export async function qaLike(data: any) {
  return request({
    method: "POST",
    url: "/qa/like", // like_type 0 正常 1 点赞 2 点踩
    data
  });
}

/**
 *  订阅
 */
export async function qaSubscript(data: any) {
  return request({
    method: "POST",
    url: "/qa/subscript",
    data
  });
}

/**
 *  获取人物列表
 */
export async function followList(data: any) {
  return request({
    method: "POST",
    url: "/follow/list",
    data
  });
}

/**
 *  follow人物
 */
export async function followPeople(data: any, config?: Config) {
  return request({
    method: "POST",
    url: "/follow",
    data,
    ...config
  });
}

/**
 *  答案 问题混合接口
 */
export async function homeQaList(data: any) {
  return request({
    method: "POST",
    url: "/home/qa/list",
    data
  });
}

/**
 *  获取following数据
 */
export async function queryFollowing(data: any) {
  return request({
    method: "POST",
    url: "/home/following",
    data
  });
}


/**
 *  收藏对别人隐藏
 */
export async function profileHide(data: any) {
  return request({
    method: "POST",
    url: "/profile/hide",
    data
  });
}

export async function getHomePeople(data: any) {
  return request({
    method: "POST",
    url: "/home/people",
    data
  });
}

/**
 *  删除问题、答案
 */
export async function qaDelete(data: any) {
  return request({
    method: "POST",
    url: "/home/qa/delete",
    data
  });
}

/**
 *  更新following最新请求时间
 */
export async function updateLastRequestTime() {
  return request({
    method: "POST",
    url: "/notification/updateLastRequestTime"
  });
}
