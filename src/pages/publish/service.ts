import request from "@/units/request";

/**
 * 创建问题或者答案
 */
export async function qaHomeAdd(data: any) {
  return request({
    method: "POST",
    url: "/qa/home/add",
    data,
  });
}

/**
 * 获取问题详情
 */
 export async function questionDetail(data: any) {
  return request({
    method: "POST",
    url: "/qa/home/qaDetailPage",
    data,
  });
}


/**
 * 获取问题列表
 */
export async function exploreQaList(data: any) {
  return request({
    method: "POST",
    url: "/explore/qa/list",
    data,
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
 * 获取问题详情
 */
export async function getQaDetail(data: any) {
  return request({
    method: "POST",
    url: "/qa/home/getQaDetail",
    data,
  });
}

/**
 * 获取是否展示tip提示
 */
export async function tipExist() {
  return request({
    method: "POST",
    url: "/qa/question/tipExist"
  });
}

/**
 * 关闭tip提示
 */
export async function tipClose() {
  return request({
    method: "POST",
    url: "/qa/question/tipClose"
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
 * 创建问题或者答案
 */
 export async function qaHomeEdit(data: any) {
  return request({
    method: "POST",
    url: "/qa/home/edit",
    data,
  });
}

/**
 * 关闭话题提示
 */
 export async function topicTipClose() {
  return request({
    method: "POST",
    url: "/topic/tipClose"
  });
}