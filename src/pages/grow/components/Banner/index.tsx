import React, { useEffect, useState, useRef } from "react";
import bannerClose from '@/assets/img/grow/banner-close.svg';
import { closeBanner } from "../../service";
import styles from './index.module.less';
// let count = 6;
let timer: any = null;

export type GrowBannerProps = {
    bannerData: any;
    isShowBanner: boolean;
    setIsShowBanner: (value: boolean) => void;
}

const GrowBanner = (props: GrowBannerProps) => {
    const { bannerData, isShowBanner, setIsShowBanner } = props;
    const [displayCount, setDisplayCount] = useState<number>(6);
    const countRef = useRef(displayCount);
    const closeBannerFunc = async () => {
        const result = await closeBanner();
        if (result?.code === 200) {
            setIsShowBanner(false);
        }
    }

    useEffect(() => {
        countRef.current = displayCount;
    }, [displayCount])

    useEffect(() => {
        if (bannerData.id && !timer) {
            timer = setInterval(() => {
                if (countRef.current <= 1) {
                    closeBannerFunc();
                    clearInterval(timer);
                    timer = null;
                }
                setDisplayCount(displayCount => displayCount - 1);
            }, 1000)
        }
        return () => {
            clearInterval(timer);
            timer = null;
        }
    }, [bannerData])
    return (
        <>
            {
                isShowBanner
                &&
                <div className={styles['grow-banner']}>
                    <img className={styles['banner-img']} src={bannerData?.img} alt="" />
                    <div className={styles['banner-message']}>
                        <div className={styles['message-left']}>
                            <div>Your property</div>
                            <div>Large selection of residential complexes</div>
                        </div>
                        <div className={styles['message-right']}>
                            <span>Automatically shut down after {displayCount}s</span>
                            <img onClick={() => {
                                closeBannerFunc();
                            }} src={bannerClose} alt="" />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default GrowBanner;