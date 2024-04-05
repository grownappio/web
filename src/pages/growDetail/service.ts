import request from "@/units/request";

/**
 *  问答详情页面
 */

export async function growQAPageDetail(data:any) {
    return request({
        method: "POST",
        url: "/qa/home/qaDetailPage",
        data,
    });
}


/**
 * comment 首次数据
 */

export async function commentList(data: any) {
    return request({
        method: "POST",
        url: "/comment/list",
        data
    });
}

/**
 * 评论
 */
export async function fololow(data: any) {
    return request({
        method: "POST",
        url: "/follow",
        data
    });
}


/**
 * 评论
 */
export async function commentAnswer(data: any) {
    return request({
        method: "POST",
        url: "/comment",
        data
    });
}

/**
 * 回复评论
 */
export async function replayComment(data: any) {
    return request({
        method: "POST",
        url: "/reply",
        data
    });
}

/**
 * 评论和回复的点赞
 */
export async function commentLike(data: any) {
    return request({
        method: "POST",
        url: "/comment/like",
        data
    });
}

/**
 * 获取剩余回复列表
 */
export async function queryReplyList(data: any) {
    return request({
        method: "POST",
        url: "/reply/list",
        data
    });
}

/**

 * 获取答案卡片
 */
 export async function getAnswerCards(data: any) {
    return request({
        method: "POST",
        url: "/qa/home/getAnswerCards",
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
 *  订阅
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

export const deleteComment = (data: any) => {
    return request({
        method: 'POST',
        url: '/home/comment/deleteComment',
        data,
    })
}