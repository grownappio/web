import React, { useEffect, useState } from 'react';

import { getOneSeed, waterGrownSeed, receiveEarn } from '@/pages/earn/service';
import TabSeed from '.';
import { Stage } from './type';

interface WrapperProps {
    seedInfo: any;
}

const WrapperSeedTab = (props: WrapperProps) => {
    let timer: any = null;
    const { seedInfo: info } = props;
    const [seedInfo, setSeedInfo] = useState<any>({});

    const isHideSeed = () => {
        const { status, id } = seedInfo || {};

        return !id || [3, 4].includes(status);
    }

    const isReverse = () => {
        const stage = showSeedStatus();

        return stage === Stage.MATURE;
    }

    const showSeedStatus = () => {
        const { status, if_water } = seedInfo;
        switch (status) {
            case 1:
                if (if_water) {
                    return Stage.GROW;
                }
                return Stage.GERMINATE;
            case 2:
                return Stage.MATURE;
            case 3:
                return Stage.MATURE;
            default:
                return Stage.GERMINATE;
        }
    }

    const getTime = () => {
        const { created_at = 0, growing_time = 0, matured_time = 0 } = seedInfo || {};
        const stage = showSeedStatus();

        switch (stage) {
            case Stage.GERMINATE:
            case Stage.GROW:
                return {
                    start: created_at * 1000,
                    end: growing_time * 1000,
                }
            case Stage.MATURE:
                return {
                    start: growing_time * 1000,
                    end: matured_time * 1000,
                }
        }
    }

    const getSingleSeed = async () => {
        const response = await getOneSeed({ id: seedInfo.id });
        if (response.code === 200) {
            setSeedInfo(response?.data);
        }
    }

    const handleSeedOnWater = async () => {
        await waterGrownSeed({ earn_id: seedInfo.id });
        getSingleSeed();
    }

    const handleSeedOnRecieve = async () => {
        await receiveEarn({ earn_id: seedInfo.id });
        getSingleSeed();
    }

    const canGetMoney = () => {
        const { fix_earn = 0, float_earn = 0 } = seedInfo;

        return String((fix_earn + float_earn).toFixed(2));
    }

    useEffect(() => {
        setSeedInfo(info || {});
    }, [info])

    useEffect(() => {
        const { next_time, status } = seedInfo;
        if (next_time) {
            const nextUpdateTime = next_time * 1000 - new Date().getTime();
            if ([1, 2].includes(status)) {
                if (timer) {
                    clearInterval(timer);
                }
                timer = setTimeout(() => {
                    getSingleSeed();
                }, nextUpdateTime);
            }
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        }
    }, [seedInfo])

    return (
        <>
            {!isHideSeed() && (<TabSeed
                stage={showSeedStatus()}
                money={canGetMoney()}
                reverse={isReverse()}
                onRecieve={handleSeedOnRecieve}
                onWater={handleSeedOnWater}
                startTime={getTime().start || 0}
                endTime={getTime().end || 0}
            />)}
        </>
    )
}

export default WrapperSeedTab;
