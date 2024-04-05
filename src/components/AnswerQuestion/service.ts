
import request from "@/units/request";

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
 * 创建问题或者答案
 */
 export async function qaHomeAdd(data: any) {
  return request({
    method: "POST",
    url: "/qa/home/add",
    data,
  });
}