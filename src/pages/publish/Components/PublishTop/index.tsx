import React from "react";
import { useHistory } from "react-router-dom";
import returnImg from '@/assets/img/grow/return.svg';
import styles from "./index.module.less";

export type PropsPublishTop = {
  title?: string;
}

const PublishTop = (props: PropsPublishTop) => {
  const history = useHistory();
  const { title = 'Add question' } = props;
  return (
    <div className={styles['publish-top']}>
      <img onClick={() => {
        history.goBack();
      }} src={returnImg} alt="" />
      <span>{title}</span>
    </div>
  )
}

export default PublishTop;