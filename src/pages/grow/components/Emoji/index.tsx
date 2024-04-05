import React, { forwardRef } from "react";
// import lookTriangle from '@/assets/emoji/look-triangle.png';
import classnames from 'classnames';
import styles from "./index.module.less";

export type PropsEmoji = {
  emojiFlag: boolean;
  selectEmojiIcon: (value: string) => void;
  emojiArr: any;
  isTop?: boolean;
  emojiPosition?: { left: number; top: number };
}

const Emoji = (props: PropsEmoji, ref: any) => {
  const { emojiFlag, selectEmojiIcon, emojiArr, emojiPosition, isTop = true } = props;
  return (
    <>
      <div onClick={(e) => e.stopPropagation()}
        style={{ left: emojiPosition?.left, top: emojiPosition?.top }}
        ref={ref}
        className={classnames({
          [styles['emoji-box']]: true,
          [styles.hide]: !emojiFlag,
          [styles.show]: emojiFlag,
          [styles.top]: isTop
        })}>
        <div className={styles['emoji-list']}>
          {
            emojiArr.map((item: any, index: number) => {
              const imgUrl = require(`../../../../assets/emoji/icon/${item.unicode}.png`);
              return (
                <div onClick={() => {
                  selectEmojiIcon(item.unicode)
                }} style={{ backgroundImage: `url(${imgUrl})` }} className={[styles['emoji-option']].join(' ')} key={index} />
              )
            })
          }
        </div>
      </div>
    </>
  )
}
export default forwardRef(Emoji);