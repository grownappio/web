import React, { useState, useEffect } from 'react'
import PersonCard from '@/components/PersonCard'
import { useData } from '@/reducer'
import Nodata from '@/pages/grow/components/Nodata'
import { calculationThousand, formatPublishTime } from '@/units/index'
import WrapperSeedTab from '@/components/SeedTab/wrapperSeedTab'
import { checkEarnType } from '../../../grow/comment'
import { deleteComment } from '../../service'
import dots from '@/assets/img/growDetail/dots.svg'
import fabulousImg from '@/assets/img/grow/fabulous.svg'
import fabulousSelectImg from '@/assets/img/grow/fabulous-enter.svg'
import commentImg from '@/assets/img/grow/comment.svg'
import triangleImg from '@/assets/img/grow/triangle-black-select.svg'
import styles from './index.module.less'
import commentLoadingImg from '@/assets/img/loading-white.gif'
import delIcon from '@/assets/img/grow/editAndDel/del.svg'
import { Confirm, showActionSheet } from '@/components/_utils/Confirm'
import * as EMOJI from '@/components/RichInput/Emoji'
import DelModalTip from '@/pages/grow/components/DelModalTip'

export type CommentProps = {
    commentLoading: boolean
    commentData: any[]
    commentNum: number
    thumbsUp: (id: number, isReplay: boolean, isLike: boolean, index: number, subIndex: number, num: number, parentId?: number) => void
    viewAllList: (type: number) => void
    getReplyList: (id: number, index: number) => void
    updateCommentList: () => void
    onReply: (e: any, at: any) => void
}

const Comment = (props: CommentProps, ref: any) => {
    const { getReplyList, thumbsUp, updateCommentList, commentData, commentLoading, onReply } = props
    const state = useData()
    const expanded = useState<any>({})
    
    const [showBefore, setShowBefore] = useState<boolean>(false)

    // 将emoji表情转换为图片
    const changeEmojiCon = (str: string) => {
        if (!str) return ''
        Object.entries(EMOJI.EMOJIS).forEach(([code, src]) => {
            const index = str.indexOf(code)
            if (index !== -1) {
                str = str.replaceAll(code, EMOJI.getImg(code, src))
            }
        })
        return str
    }

    const onDel = async (comment: any) => {
        const status = await checkEarnType(comment.id, 3)
        await Confirm({
            title: 'Delete reply',
            content: <DelModalTip content="reply" seedStatus={status} />
          })
        await deleteComment({ id: comment.id })
        updateCommentList()
    }

    const openMenu = async (comment: any) => {
        showActionSheet({
            cancelText: 'Cancel',
            empty: 'More features are coming soon',
            actions: [
                { key: 'edit', text: 'Delete reply', icon: delIcon, onClick: () => onDel(comment) }
            ]
        })
    }

    useEffect(() => {
        const condition0 = (commentData || []).filter((item) => { return !(item.status === 2 && !(item.reply_list.filter((child: any) => { return !(child.status === 2) }).length > 0)) }).length > 0
        if (condition0) {
            setShowBefore(true)
        } else {
            setShowBefore(false)
        }
    }, [])

    const renderCommentLoading = () => {
        return <div className={styles['comment-loading']}>
            <img src={commentLoadingImg} alt='' />
        </div>
    }

    const renderCommentList = () => {
        const tempCommentData = (commentData || []).filter(item =>
            !(item.status === 2 && !((item?.reply_list || []).filter((item: any) => item.status !== 2)).length)
        )
        if (tempCommentData.length) {
            return tempCommentData.map((item, index) => {
                const isdel = item.status === 2
                return (
                    <div className={styles['main-option']} key={item.id}>
                        {
                            isdel
                                ?
                                <div className={styles['repply-no-exist'] + ` ${expanded[0][item.id] && 'after:!h-8'}`}>The reply does not exist.</div>
                                :
                                <div className={[styles['comment-option']].join(' ')}>
                                    <div className={styles['comment-user-icon']}>
                                        <PersonCard id={item.user_id} >
                                            <img className={styles['user-img']} src={item.user_icon} alt='' />
                                        </PersonCard>
                                    </div>

                                    <div className={styles['comment-right']}>
                                        <div className={styles['comment-user-name']}>
                                            <PersonCard id={item.user_id} className='truncate'>{item?.user_nick_name}</PersonCard>
                                            <PersonCard id={item.user_id} className={styles['reply-name'] + ' truncate'}>@{item.user_name}</PersonCard>
                                            <span className={styles.time}>{formatPublishTime(item.create_at)}</span>
                                            <span className={styles.seed}>
                                                <WrapperSeedTab seedInfo={item.my_seed} />
                                            </span>
                                        </div>
                                        <div className={styles['comment-content']} dangerouslySetInnerHTML={{ __html: changeEmojiCon(item?.context) }} />
                                        <div className={styles['comment-btns']}>
                                            <div onClick={() => {
                                                if (item.status === 2) return
                                                thumbsUp(item.id, false, !item.is_like, index, -1, item.is_like ? item.like_num - 1 : item.like_num + 1)
                                            }} className={styles.btn}>
                                                <img src={item.is_like ? fabulousSelectImg : fabulousImg} alt='' />
                                                <span
                                                    style={{ color: item.is_like ? '#34D026' : '' }}>{calculationThousand(item?.like_num || 0)}</span>
                                            </div>
                                            <div onClick={() => item.status !== 2 && onReply(item, item) } className={styles.btn}>
                                                <img src={commentImg} alt='' />
                                                <span>{calculationThousand(item?.reply_num || 0)}</span>
                                            </div>
                                            {
                                                state.userInfo && state.userInfo.id === item.user_id && item.status !== 2
                                                &&
                                                <div className={styles.dot} onClick={() => openMenu(item)}><img src={dots} alt={''} /></div>
                                            }
                                        </div>
                                    </div>
                                </div>
                        }

                        {
                            (!isdel || (isdel && expanded[0][item.id]))
                            &&
                            (item.reply_list || []).slice(0, expanded[0][item.id] ? undefined : 5).filter((e: any) => e.status !== 2).map((reply: any, subIndex: number) => (
                                <div key={reply.id} className={[styles['comment-option'], styles['sub-comment-option']].join(' ')}>
                                    <div className={styles['comment-user-icon']}>
                                        <PersonCard id={reply.user_id} >
                                            <img className={styles['user-img']} src={reply.user_icon} alt='' />
                                        </PersonCard>
                                    </div>
                                    <div className={styles['comment-right']}>
                                        <div className={styles['comment-user-name']}>
                                            <PersonCard id={reply.user_id} className='truncate'>{reply?.user_nick_name}</PersonCard>
                                            <PersonCard id={reply.user_id} className={styles['reply-name'] + ' truncate'}>@{reply.user_name}</PersonCard>
                                            <span className={styles.time}>{formatPublishTime(reply.create_at)}</span>
                                            <span className={styles.seed}>
                                                <WrapperSeedTab seedInfo={reply.my_seed} />
                                            </span>
                                        </div>
                                        <div className={styles['comment-content']}>
                                            Reply <PersonCard id={reply.at_user_id} className='inline-block max-w-[8em] truncate align-middle text-primary' name={'@' + reply.at_user_name} />:
                                            <span dangerouslySetInnerHTML={{ __html: changeEmojiCon(reply?.context) }} />
                                        </div>
                                        <div className={styles['comment-btns']}>
                                            <div onClick={() => thumbsUp(reply.id, true, !reply.is_like, index, subIndex, reply.is_like ? reply.reply_like_num - 1 : reply.reply_like_num + 1, item.id)} className={styles.btn}>
                                                <img src={reply.is_like ? fabulousSelectImg : fabulousImg} alt='' />
                                                <span style={{ color: reply.is_like ? '#34D026' : '' }}>{calculationThousand(reply?.reply_like_num || 0)}</span>
                                            </div>
                                            <div onClick={() => onReply(item, reply)} className={styles.btn}>
                                                <img src={commentImg} alt='' />
                                                {/* <span>{items?.reply_num || 0}</span> */}
                                            </div>
                                            {
                                                state.userInfo && state.userInfo.id === reply.user_id
                                                &&
                                                <div className={styles.dot} onClick={() => openMenu(reply)}><img src={dots} alt={''} /></div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        }

                        {
                            !expanded[0][item.id] && ((isdel && item.reply_list?.length) || (!isdel && (item.reply_list?.length > 5 || item.reply_num > 5)))
                            &&
                            <div className={`${isdel ? `-mt-4 ml-74 mb-14` : 'ml-45 mb-16'} font-medium text-primary`} onClick={() => {getReplyList(item.id, index); expanded[1]({ ...expanded[0], [item.id]: true })}}>
                                { isdel ? 'Show replies' : `View all ${item.reply_num} replies` }
                                <img className={`ml-6 w-8 h-5 rotate-180`} src={triangleImg} alt='' />
                            </div>
                        }

                        {/* {
                            item.reply_num > 5 && item.reply_list && item.reply_num !== item?.reply_list.length
                            &&
                            <div onClick={() => getReplyList(item.id, index)} className={styles['sub-view-all']}>
                                <span>View All {item.reply_num} replies</span>
                                <img src={triangleImg} alt='' />
                            </div>
                        } */}
                    </div>
                )
            })
        } else {
            return (
                <wc-fill-remain class='flex items-center bg-[#f1f2f3]'>
                    <Nodata className='mx-auto w-146 h-full py-48 [&>img]:mb-20' type={6} height={100}></Nodata>
                </wc-fill-remain>
            )
        }
    }

    return (
        <div className={styles['comment-box']}>
            <div className={[styles['comment-list'], !commentLoading && showBefore ? styles.active : ''].join(' ')}>
                { commentLoading ? renderCommentLoading() : renderCommentList() }
            </div>
        </div>
    )
}

export default Comment