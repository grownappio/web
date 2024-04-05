import React, { forwardRef } from "react";
// import lookTriangle from '@/assets/emoji/look-triangle.png';

import styles from "./index.module.less";

export type PropsEmoji = {
  emojiFlag: boolean;
  selectEmojiIcon: (value: string) => void;
  emojiArr: any;
  isTop?: boolean;
}

const Emoji = (props: PropsEmoji, ref: any) => {
  const { emojiFlag, selectEmojiIcon, emojiArr, isTop = false } = props;
  return (
    <>
      {
        emojiFlag
        &&
        <div ref={ref} className={[styles['emoji-box'], isTop ? styles.atop : styles.normal].join(' ')}>
          
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
      }
    </>
  )
}
export default forwardRef(Emoji);