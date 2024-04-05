import React from 'react';
import { NoticeTypes } from './types';
import { behaviorList } from "./data";
import iconPic from '@/assets/img/header/wallect3.png';
import styles from './index.module.less';
import { useHistory, Link } from 'react-router-dom';
import { NoticeItem, noticeBehaviorData } from '@/components/Right/components/Notice/data.d';
import { formatPublishTime, getText } from '@/units';

const NoticeStage = (props: NoticeItem) => {
    const history = useHistory()

    const renderText = (e: NoticeItem['reference'], showAt = false) => (
        <div className={styles.showContent + ' line-clamp-3 leading-[1.5]'}>
            {showAt && e?.at_user_name && <span>Reply <Link to={`/profile?id=${e.at_user_id}`}>@{e.at_user_name}</Link> </span>}
            <span dangerouslySetInnerHTML={{ __html: getText(e?.content).replace(/style="(.*)"/gi,'') }} />
        </div>
    )

    const renderQuote = (e: NoticeItem) => props.reference_is_del
        ? (<span className={styles.abnormal}>The {noticeBehaviorData[props.type].refTxt(props)} does not exist.</span>)
        : (
            <div className={`${styles.noticeBoard} ${styles.quote}`}>
                <div className={styles.headLine}>
                    <span className={styles.headSculptureIcon} onClick={() => history.push(`/profile?id=${e.user_id}`)}>
                        <Link to={`/profile?id=${e.user_id}`}>
                            <img className={styles.avatar} src={e.user_icon ?? iconPic} alt="" />
                        </Link>
                    </span>
                    <p className='flex items-center flex-1 w-0'>
                        <Link to={`/profile?id=${e.user_id}`} className={styles.nick + ' flex-1 truncate text-inherit'}>{e.user_nick_name}</Link>
                        <Link to={`/profile?id=${e.user_id}`} className={styles.account + ' flex-1 truncate text-inherit'}>@{e.user_name}</Link>
                        <span className='shrink-0 ml-6'>·</span>
                        <span className='shrink-0 ml-6'>{formatPublishTime(props.created_at.toString())}</span>
                    </p>
                </div>
                <div className='mt-8' onClick={() => noticeBehaviorData[props.type].refClick(props)}>
                    {renderText(e, true)}
                </div>
            </div>
        )

    const renderUserText = (e: NoticeItem) => (
        <>
            <Link to={`/profile?id=${e.user_id}`} className={styles.nick + ' max-w-128 truncate text-inherit'}>{e.user_nick_name}</Link>
            <Link to={`/profile?id=${e.user_id}`} className={styles.account + ' truncate text-inherit'}>@{e.user_name}</Link>
        </>
    )

    const renderHeadMsg = () => {
        if (props.self_is_del) return (<span>The {noticeBehaviorData[props.type].txt} does not exist.</span>);
        switch (props.type) {
            case NoticeTypes.ANSWERED:
                return (<span>Answered your <a className={styles.questionLink} onClick={() => noticeBehaviorData[props.type].refClick(props)}>Question#{props.reference_id}</a></span>);
            case NoticeTypes.FOLLOWED:
                return (<span>Followed you</span>);
            case NoticeTypes.LIKED_ANSWER:
                return (<span>Upvoted your <a className={styles.questionLink} onClick={() => noticeBehaviorData[props.type].refClick(props)}>Answer#{props.reference_id}</a></span>);
            case NoticeTypes.LIKED_QUESTION:
                return (<span>Upvoted your <a className={styles.questionLink} onClick={() => noticeBehaviorData[props.type].refClick(props)}>Question#{props.reference_id}</a></span>);
            case NoticeTypes.LIKED_REPLY:
                return (<span>Upvoted your reply</span>);
            case NoticeTypes.REPLYED:
                return props.at_user_name
                    ? (<span>Replied to <Link to={`/profile?id=${props.at_user_id}`}><a className={styles.questionLink}>@{props.at_user_name}</a></Link></span>)
                    : (<span>Replied to your <a className={styles.questionLink} onClick={() => noticeBehaviorData[props.type].refClick(props)}>Answer#{props.reference_id}</a></span>);
            default:
                return null;
        }
    }

    const renderContent = () => {
        if (props.self_is_del) return undefined;
        switch (props.type) {
            case NoticeTypes.ANSWERED:
                return renderText(props);
            case NoticeTypes.FOLLOWED:
                return undefined;
            case NoticeTypes.LIKED_ANSWER:
                return renderText(props);
            case NoticeTypes.LIKED_REPLY:
                return renderText(props);
            case NoticeTypes.LIKED_QUESTION:
                return renderText(props);
            case NoticeTypes.REPLYED:
                return renderText(props);
            default:
                return undefined;
        }
    }

    return (
        <div className={styles.noticeBoard + ' py-12 px-16 mt-8 first:mt-0 bg-white'}>
            <div className={styles.headLine}>
                <span className={styles.headSculptureIcon} onClick={() => history.push(`/profile?id=${props.user_id}`)}>
                    <img className={styles.avatar} src={props.user_icon ?? iconPic} alt="" />
                    <img className={styles['behavior-icon']} src={behaviorList[props.type]} alt="" />
                </span>
                <div className='flex flex-col flex-1 w-0 justify-between'>
                    <p className='flex items-center truncate'>{renderUserText(props)}</p>
                    <p className='text-[12px]'>{formatPublishTime(props.created_at.toString())}</p>
                </div>
            </div>
            <div className={styles.showDetail + ' mt-8'}>
                <p className='text-[#11243899]'>{renderHeadMsg()}</p>
                <div className={!props.content ? 'hidden' : ''} onClick={() => noticeBehaviorData[props.type].onClick(props)}>
                    {renderContent()}
                </div>
                {props.reference && renderQuote(props.reference as NoticeItem)}
            </div>
        </div>
    )
}

export default NoticeStage;
