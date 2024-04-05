import request from "@/units/request";

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
 * 获取hot数据
 */
export async function getHots() {
  return request({
    method: "POST",
    url: "/home/getHots",
  });
}

/**
 * 获取hot数据
 */
export async function getTopics() {
  return request({
    method: "POST",
    url: "/topic/list",
    data: {}
  });
}

/**
 *  获取所有链
 */
 export async function getAllChain() {
  return request({
      method: "POST",
      url: "/wallet/chains"
  });
}

/**
 * 获取话题tip是否关闭
 */
 export async function topicTipExist() {
  return request({
    method: "POST",
    url: "/topic/tipExist",
  });
}