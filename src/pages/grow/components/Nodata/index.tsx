import React from "react";
import { useHistory } from "react-router-dom";
import noDataImg from '@/assets/img/grow/nodata.svg';
import answerDelImg from "@/assets/img/grow/answer-del.svg";
import noDataAssetsImg from '@/assets/img/grow/no-data-asset.svg';
import noFollowingImg from '@/assets/img/grow/no-following.svg';
import styles from './index.module.less';

export type PropsNodata = {
    type?: number;
    height?: number;
    style?: { [key: string]: string }
    className?: string
}

const textArr: { [key: number]: { tip: string, imgSrc: string, btn?: string; } } = {
    0: {
        tip: "No Results. You Can Ask A Question In GrowN.",
        imgSrc: noDataImg,
        btn: 'addQuestion'
    },
    1: {
        tip: "You are not following anyone. Don't be alone in Grown!",
        imgSrc: noFollowingImg
    },
    2: {
        tip: "No search results found",
        imgSrc: noDataImg
    },
    3: {
        tip: "You don't have digital collections from grown yet.",
        imgSrc: noDataAssetsImg
    },
    4: {
        tip: "No result. You can earn GWC by answering questions",
        imgSrc: noDataAssetsImg,
        btn: 'answerQuestion'
    },
    5: {
        tip: "Favorites is empty.",
        imgSrc: noDataAssetsImg,
    },
    6: {
        tip: "Temporarily No Data",
        imgSrc: answerDelImg
    }
}

const NoData = (props: PropsNodata) => {
    const history = useHistory();
    const { type = 3, style } = props; // 0 （问题答案） 1 following 未关注任何人 2  people 3 asset

    return (
        <div
            style={{
                ...style,
            }}
            className={styles['no-data-box'] + ` ${props.className}`}>
            <img src={textArr[type].imgSrc} alt="" />
            <div>{textArr[type].tip}</div>
            {
                (textArr[type].btn && textArr[type].btn === 'addQuestion')
                &&
                <div onClick={() => {
                    history.push('/addQuestion')
                }} className={styles['to-ask-btn']}>Add a question</div>
            }

            {
                (textArr[type].btn && textArr[type].btn === 'answerQuestion')
                &&
                <div onClick={() => {
                    history.push('/answerQuestions')
                }} className={styles['to-ask-btn']}>Answer questions</div>
            }
        </div>
    )
}
export default NoData;