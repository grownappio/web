import React from 'react';

import iconPic from '@/assets/img/header/wallect3.png';
import styles from './index.module.less';

const QuestionInfo = () => {

    return (
        <div className={styles.questionBox}>
            <div className={styles.headLine}>
                <span className={styles.headSculptureIcon}><img src={iconPic} alt="" /></span>
                <div className={styles.headText}>
                    <p>
                        <span className={styles.name}>Kristin Watson</span>
                        <span className={styles.account}>@Albert Flores123</span>
                    </p>
                    <p className={styles.pubTime}>30 mins ago</p>
                </div>
            </div>
            <div className={styles.content}>
                <p>Manageable Vol P and l M in Web3.0 mode?</p>
            </div>
        </div>
    )
}

export default QuestionInfo;
