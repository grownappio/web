import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import { Divider } from 'antd-mobile';
import { NativeProps, withNativeProps } from 'antd-mobile/es/utils/native-props';

import dotsSvg from '@/assets/img/grow/dots.svg';
import triangleImg from '@/assets/img/earn/banner/triangle.svg';

type ViewMoreProps = {
    answerList: any[];
    answerNum: number;
} & NativeProps & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

const CardMore = (props: ViewMoreProps) => {
    const { answerList, answerNum } = props;
    return withNativeProps(props,
        <div onClick={props.onClick}>
            {
                !!answerList.length
                &&
                <Divider className='mt-24 mb-32 border-text/8'>{ answerList.length ? 'More answers' : 'No more answers' }</Divider>
            }
            {
                !!answerList.length
                &&
                <div className='flex items-center my-24 px-12 py-8 b-1 border-text/8 rounded-8 bg-white'>
                    {answerList.slice(0, 3).map((item: any, index: number) => (
                        <img key={index} className='p-[1.5px] w-32 h-32 rounded-full -ml-8 first:ml-0 bg-[#ECEDEF]' src={item?.User?.icon} alt="" />
                    ))}
                    { answerNum > 3 && <img className='-ml-30 p-2 w-28 h-28 bg-text/30 rounded-full' src={dotsSvg} alt="" /> }
                    <span className='ml-12'>{answerNum} answered</span>
                    <div className='flex items-center ml-auto text-primary'>
                        <span>View all</span>
                        <img className='ml-8 mr-2' src={triangleImg} alt="" />
                    </div>
                </div>
            }
        </div>
    )
}

export default CardMore;
