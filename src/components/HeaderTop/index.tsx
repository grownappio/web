import React from "react";
import { useHistory } from "react-router-dom";
import returnImg from '@/assets/img/grow/return.svg';
import styles from "./index.module.less";

export type PropsPublishTop = {
  title?: string;
  isMargin?: boolean;
  isRadius?: boolean;
  divider?: boolean;
}

const HeaderTop = (props: PropsPublishTop) => {
  const history = useHistory();
  const { title = 'Add question', isMargin = true, isRadius = false, divider = false } = props;
  return (
    <div className={[styles['publish-top'], isMargin ? styles.margin12 : '', isRadius ? styles.raduis : '', divider ? styles.divider : ''].join(' ')}>
      <img onClick={() => history.goBack()} src={returnImg} alt="" />
      <span>{title}</span>
    </div>
  )
}

export default HeaderTop;