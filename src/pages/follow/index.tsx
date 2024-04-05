import React, { useEffect, useRef, useState } from "react";
import { message } from "antd";
import { useHistory } from "react-router-dom";
import returnImg from "@/assets/img/grow/return.svg";
import location from "@/assets/img/follow/location.svg"
import { follower, followPerson, getFollowerList, getFollowingList, getUserNickName } from "@/pages/follow/service";
import { SEX_LIST } from "@/units/commonData";
import { getAgeByBirthDatyTimeStamp, getUrlHashParam } from "@/units";
import { setBrowerTabTitle } from '@/utils';
import PersonCard from "@/components/PersonCard";
import Loading from "@/components/Loading";
import { useData } from "@/reducer";

import styles from "./index.module.less";

const Follow = () => {
    const [params] = useState<any>(getUrlHashParam());
    const history = useHistory();
    const [tabActive, setTabActive] = useState<string>(params?.tab || 'follows');
    const [pageNum, setPageNum] = useState<number>(1)
    const [folloList, setFolloList] = useState<follower[]>([])
    const bottomRef = useRef<any>()
    const [currentID, setCurrentID] = useState<any>(undefined);
    const [userNickName, setUserNickName] = useState<any>();
    const [loadingFlag, setLoadingFlag] = useState<boolean>(true);

    const state = useData();

    const callback = async () => {
        const scrollTop = bottomRef?.current.scrollTop
        const clientHeight = bottomRef?.current.clientHeight
        const scrollHeight = bottomRef?.current.scrollHeight
        if (scrollHeight - scrollTop === clientHeight) {
            if (tabActive === "follows") {
                await followerList(pageNum + 1)
            } else if (tabActive === "following") {
                await followingList(pageNum + 1)
            }
            setPageNum(pageNum + 1)
        }
    }

    const followingList = async (pNum: number) => {
        const result = await getFollowingList({
            uid: Number(params.id),
            page: {
                page_num: pNum,
                page_size: 20,
            }
        })
        if (result?.code === 200) {
            setTimeout(() => {
                setLoadingFlag(false);
            }, 500);
            setFolloList([...folloList || [], ...(result?.data || []).map((item: follower) => {
                return {
                    ...item,
                    sex: item.sex || 5,
                    age: getAgeByBirthDatyTimeStamp(item?.birthday || 0)
                }
            })])
        } else {
            setLoadingFlag(false);
        }
    }

    const followerList = async (pNum: number) => {
        const result = await getFollowerList({
            uid: Number(params.id),
            page: {
                page_num: pNum,
                page_size: 20,
            }
        })
        if (result?.code === 200) {
            setTimeout(() => {
                setLoadingFlag(false);
            }, 500);
            setFolloList([...folloList || [], ...(result?.data || []).map((item: follower) => {
                return {
                    ...item,
                    sex: item.sex || 5,
                    age: getAgeByBirthDatyTimeStamp(item?.birthday || 0)
                }
            })])
        } else {
            setLoadingFlag(false);
        }

    }

    const followOne = async (uid: number, isFollow: boolean, index: number) => {
        const result = await followPerson({ user_id: uid })
        if (result?.code === 200) {
            let TempList = [...folloList || []]
            TempList[index].is_follow = !isFollow
            setFolloList(TempList)
            message.success(isFollow ? 'Unfollow succeeded' : 'Follow succeeded');
        }
    }

    const getFollowUserNick = async () => {
        const result = await getUserNickName({ id: Number(params.id) })
        if (result.code === 200) {
            setUserNickName(result?.data?.nick_name)
        }
    }

    useEffect(() => {
        getFollowUserNick()
        setLoadingFlag(true);
        if (tabActive === "follows") {
            followerList(pageNum)
        } else if (tabActive === "following") {
            followingList(pageNum)
        }
    }, [tabActive])

    useEffect(() => {
        if (RegExp('/follow', 'i').test(window.location.hash)) {
            setBrowerTabTitle(`${state?.userInfo?.nickName} (@${state?.userInfo?.name}) / Grown`);
        }
    })

    const userCard = (item: follower, index: number) => {
        return (
            <div className={styles['card-box']}>
                <div className={styles['user-header']}>
                    <img
                        src={item.icon}
                        alt={''} />
                    <div className={styles['user-info']}>
                        <div className={styles['name']}>
                            <PersonCard id={item?.id} name={item?.nick_name} />
                            <span className={styles['nick-name']}>@{item.name}</span>
                        </div>
                        <div className={styles['extra']}>
                            <span className={styles['sex']}><img src={SEX_LIST[item.sex].icon} alt={''} />{item.age}</span>
                            <span className={styles['location']}><img src={location} alt={''} />{item.location}</span>
                        </div>
                    </div>
                    {
                        (state?.userInfo?.id !== item.id) &&
                        <button
                            className={[styles['button'], item.is_follow ? (currentID === index ? styles.active2 : styles.active1) : ''].join(' ')}
                            onMouseEnter={() => {
                                setCurrentID(index)
                            }}
                            onMouseLeave={() => {
                                setCurrentID(undefined)
                            }}
                            onClick={async () => {
                                await followOne(item.id, item.is_follow, index)
                            }}
                        >{item.is_follow ? (currentID === index ? 'Unfollow' : 'Following') : 'Follow'}</button>}
                </div>
                {
                    item.intro !== '' &&
                    <div className={styles['user-bio']}>
                        {item.intro}
                    </div>
                }
            </div>
        )
    }

    return (
        <div className={styles['follow-box']}>
            <div className={styles['follow-header']}>
                <img onClick={() => { history.goBack() }} src={returnImg} alt="" />
                <span>{userNickName ? userNickName : state?.userInfo?.nickName}</span>
            </div>
            <div className={styles['banner']}>
                <span
                    className={[styles['following'], tabActive === 'following' ? styles.active : ''].join(' ')}
                    onClick={() => { setFolloList([]); setTabActive('following'); setPageNum(1) }}>
                    Following
                </span>
                <span
                    className={[styles['follows'], tabActive === 'follows' ? styles.active : ''].join(' ')}
                    onClick={() => { setFolloList([]); setTabActive('follows'); setPageNum(1) }}
                >
                    Followers
                </span>

            </div>
            <div ref={bottomRef} className={styles['follow-list']} onScroll={async () => { await callback() }}>
                {/*用户列表*/}
                {
                    loadingFlag
                    &&
                    <Loading />

                }
                {
                    !loadingFlag &&
                    folloList?.map((value, index, array) => {
                        return (
                            <div key={index}>
                                {userCard(value, index)}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Follow;