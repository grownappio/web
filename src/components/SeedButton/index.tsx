import React, { ReactNode, memo, useRef, useState } from 'react';
import { NativeProps, withNativeProps } from 'antd-mobile/es/utils/native-props';
import { delay } from '@/units';

import { Period } from './type';
import loadGif from '@/assets/img/login/button-loading.gif';
import shootSvg from '@/assets/img/earn/seed/shoot.svg';

type SeedProps = {
    text?: ReactNode;
    stage?: Period;
    loading?: boolean
    disabled?: boolean
    animated?: boolean;
    children?: ReactNode
    onBeforeRequest?: () => boolean | void
    onRequest: () => Promise<any> | void;
    onSucceed?: (response: any) => void;
    onFailed?: () => void;
} & NativeProps

const ButtonSeed = (props: SeedProps) => {
    const { onRequest, onSucceed, onFailed } = props;
    const elref = useRef<HTMLButtonElement>(null)
    const done = useState(false)
    const loading = useState(false)

    const up = elref.current?.getBoundingClientRect().top! > 100

    const onClick = async () => {
        try {
            if (props.onBeforeRequest?.() === false) return
            loading[1](true)
            const [res] = await Promise.all([onRequest(), delay(1000)])
            loading[1](false)
            done[1](true)
            if (props.animated) await delay(1000)
            onSucceed?.(res)
        } finally {
            loading[1](false)
        }
    }

    return withNativeProps(props, (
        <button ref={elref} className={`btn-primary relative flex justify-center items-center ${props.disabled || done[0] ? 'disabled' : ''}`} onClick={onClick}>
            {
                loading[0] ? <img className='absolute inset-0 h-full object-cover rounded-[inherit]' src={loadGif} alt="" /> :
                done[0] ? 'Done' :
                (props.children ?? props.text)
            }
            {
                props.animated && (loading[0] || done[0])
                &&
                <div className={`absolute inset-0 flex justify-center items-center opacity-0 transition-[all_500ms] text-primary text-16 ${done[0] ? `opacity-100 z-10 ${up ? '-translate-y-30' : 'translate-y-30'}` : ''}`}>
                    <img className='w-16 h-16 mr-2' src={shootSvg} alt="" />
                    <span>+1</span>
                </div>
            }
        </button>
    ))
}

export default memo(ButtonSeed);
