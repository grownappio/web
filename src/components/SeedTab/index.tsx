import React, { useEffect, useState } from 'react';
import { ProgressCircle, Modal } from "antd-mobile";
import classnames from 'classnames';

import { calculateTime, calculatePercent } from './utils';
import { Stage } from './type'
import timeSvg from '@/assets/img/earn/seed/time.png';
import dateSvg from '@/assets/img/earn/seed/date.png';
import shootSvg from '@/assets/img/earn/seed/shoot.svg';
import growSvg from '@/assets/img/earn/seed/grow.svg';
import matureSvg from '@/assets/img/earn/seed/mature.svg';
import styles from './index.module.less';

export interface TabProps {
    stage: Stage;
    startTime: number;
    endTime: number;
    money: string;
    baseColor?: string;
    processColor?: string;
    reverse?: boolean;
    className?: string;
    onWater?: () => {};
    onRecieve?: () => {};
}

const TabSeed = (props: TabProps) => {
    const {
        stage, reverse,
        startTime, endTime, money = '00.00',
    } = props;
    const [value, setValue] = useState<number>(0);
    const [time, setTime] = useState<string>('00:00:00');
    const [strokeColor, setStrokeColor] = useState<string>('#34D026');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    // const [trailColor, setTrailColor] = useState<string>('#effbee');
    let timer: any = null;

    const renderContent = () => (
        <div className={styles['icon-box']}>
            {stage === Stage.GERMINATE && <img src={shootSvg} alt="" />}
            {stage === Stage.GROW && <img src={growSvg} alt="" />}
            {stage === Stage.MATURE && <img src={matureSvg} alt="" />}
        </div>
    );

    const renderTimeTip = () => {
        return (
            <div className={styles.tipBox}>
                <div className={styles.para}>
                    <span className={styles.title}>{stage === Stage.MATURE ? 'Matured' : 'Growing'}: </span>
                    <div className={styles.content}>
                        <span>{time}</span>
                        <img src={timeSvg} alt="" />
                    </div>
                </div>
                <div className={styles.para}>
                    <span className={styles.title}>Earning:</span>
                    <div className={styles.content}>
                        <span>{money}</span>
                        <img src={dateSvg} alt="" />
                    </div>
                </div>
            </div>
        )
    }

    const openMadalTip = () => {
        setModalVisible(true);
    }

    // const handleSeedOnClick = (event: any) => {
    //     event.stopPropagation();
    //     if (stage === Stage.GERMINATE) {
    //         onWater && onWater();
    //     }

    //     if (stage === Stage.MATURE) {
    //         onRecieve && onRecieve();
    //     }
    // }

    const setColor = () => {
        switch (stage) {
            case Stage.GERMINATE:
            case Stage.GROW:
                setStrokeColor('#34d026');
                break;
            case Stage.MATURE:
                setStrokeColor('#ffa404');
                break;
            default:
                setStrokeColor('#34d026');
                return;
        }
    }

    const setPercent = (value: number) => {
        setValue(100 - value)
    }

    useEffect(() => {
        if (timer) clearInterval(timer);
        const currentTime = new Date().getTime();
        let allSpan = endTime - startTime;
        let span = endTime - currentTime;
        let completedSpan = currentTime - startTime;
        setPercent(calculatePercent(allSpan, completedSpan));
        setTime(calculateTime(span))
        timer = setInterval(() => {
            span = span - 1000;
            completedSpan = completedSpan + 1000
            if (span < 0) {
                clearInterval(timer);
                setTime('00:00:00')
                setPercent(0)
            }
            setTime(calculateTime(span));
            setPercent(calculatePercent(allSpan, completedSpan))
        }, 1000)

        return () => clearInterval(timer);
    }, [startTime, endTime, reverse])

    useEffect(() => {
        setColor();
    }, [stage, reverse]);

    return (
        <div onClick={openMadalTip} className={classnames({
            [styles.wrapper]: true,
            [styles.overturn]: reverse,
            [props.className!]: true
        })} >
            <ProgressCircle
                percent={value}
                className="flex justify-center items-center"
                style={{
                    '--size': '.24rem',
                    '--fill-color': strokeColor,
                    '--track-width': '.02rem'
                }}
            >
                {renderContent()}
            </ProgressCircle>
            <Modal
                visible={modalVisible}
                content={renderTimeTip()}
                closeOnAction={true}
                onClose={() => setModalVisible(false)}
                actions={[
                    {
                        key: 'confirm',
                        text: 'OK'
                    }
                ]} />
        </div>
    )
}

export default TabSeed;
