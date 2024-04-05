import request from "@/units/request";
import { message } from "antd";

/**
 * 获取种子状态
 */
export async function getSeedStatue(data: any) {
  return request({
    method: "POST",
    url: "/home/earn/getSeedStatue",
    data
  });
}

/**
 * 判断本人是否回答过该问题
 */
export async function checkIsAnswer(data: any) {
  return request({
    method: "POST",
    url: "/qa/home/answerID",
    data
  });
}

/**
 * 判断问题答案是否可编辑啊
 */
 export async function checkQaStatus(data: any) {
  return request({
    method: "POST",
    url: "/qa/status",
    data
  });
}

// seed_type 类型 question: 1, answer: 2, commtent: 3, share: 4, InviteAnswer: 5
export const checkEarnType = async (qac_id: number, seed_type: number) => {
  let status = 0;
  try {
    const result = await getSeedStatue({ qac_id, seed_type });
    if (result?.code === 200) {
      status = result?.data?.SeedStatue;
    }
  } catch (err) {
    console.log(err)
  }
  return status;
}

// 判断本人是否回答过该问题
export const checkAnswerOrNot = async (id: number) => {
  let status = 0;
  try {
    const result = await checkIsAnswer({ id });
    if (result?.code === 200) {
      status = Number(result?.data?.my_answer_id);
    }
  } catch (err) {
    console.log(err)
  }
  // 0 为未回答过该问题
  return status;
}

// 判断问题答案是否可以编辑
export const checkAnswerAndQuestionIsCanEdit = async (id: number) => {
  let flag = false;
  try {
    const result = await checkQaStatus({id});
    if (result?.code === 200) {
      flag = result?.data?.can_edit_question;
    }
  } catch(err) {
    console.log(err);
  }
  return flag;
}

// 跳转编辑答案页面
export const toEditAnswer = async (id: number) => {
  const isCanEdit = await checkAnswerAndQuestionIsCanEdit(id);
  if (!isCanEdit) {
    message.warning('The answer does not support editing');
    return
  }
  const answerReturnUrl: { [key: number]: string } = sessionStorage.getItem('answerReturnUrl') ? JSON.parse(sessionStorage.getItem('answerReturnUrl')!) : {};
  answerReturnUrl[id] = window.location.href;
  sessionStorage.setItem('answerReturnUrl', JSON.stringify(answerReturnUrl));
  window.location.href = `${window.location.origin}${window.location.pathname}#/fullAnswer?answer_id=${id}`
}
