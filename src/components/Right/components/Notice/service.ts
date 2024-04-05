import request from "@/units/request";

/**
 * 消息列表
 */
export async function queryNotification(data: any) {
  return request({
    method: "POST",
    url: "/notification",
    data
  });
}


/**
 * 标记已读
 */
 export async function notificationRead() {
  return request({
    method: "POST",
    url: "/notification/read"
  });
}

/**
 * 未读消息通知汇总
 */
 export async function notificationInfo() {
  return request({
    method: "POST",
    url: "/notification/info"
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