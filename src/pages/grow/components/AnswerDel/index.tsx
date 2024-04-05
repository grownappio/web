import React from "react";
import styles from "./index.module.less";
import answerDelImg from "@/assets/img/grow/answer-del.svg";

const AnswerDel = () => {
  return (
    <div className={styles['answer-del']}>
      <img src={answerDelImg} alt="" />
      <span>Temporarily no data</span>
    </div>
  )
}

export default AnswerDel