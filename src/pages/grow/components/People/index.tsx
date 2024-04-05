import React, { useState } from "react";
import Nodata from "../Nodata";
import styles from './index.module.less';
import { follower } from "@/pages/follow/service";
import PersonCard from "@/components/PersonCard";
import { SEX_LIST } from "@/units/commonData";
import location from "@/assets/img/follow/location.svg";
import { useData } from "@/reducer";

export type PeoPleProps = {
    peopleList: any[];
    checkFollow: (id: number, value: boolean) => void;
}

const PeopleComponent = (props: PeoPleProps) => {
    const { peopleList, checkFollow } = props;
    const [currentID, setCurrentID] = useState<any>(undefined);
    const state = useData();
    const userCard = (item: follower, index: number) => {
        return (
            <div className={styles['card-box']}>
                <div className={styles['user-header']}>
                    <img
                        src={item.icon}
                        alt={''}
                    />
                    <div className={styles['user-info']}>
                        <div className={styles['name']}>
                            <PersonCard id={item?.id} name={item?.nick_name} />
                            <span className={styles['nick-name']}>@{item.name}</span>
                        </div>
                        <div className={styles['extra']}>
                            <span className={styles['sex']}><img src={SEX_LIST[item.sex || 5].icon} alt={''} />{item.age}</span>
                            <span className={styles['location']}><img src={location} alt={''} />{item.location}</span>
                        </div>
                    </div>
                    {
                        (state?.userInfo?.id !== item.id) &&
                        <button
                            className={[styles['button'], item.is_follow ? (currentID === index ? styles.active2 : styles.active1) : ''].join(' ')}
                            onMouseEnter={() => { setCurrentID(index) }}
                            onMouseLeave={() => { setCurrentID(undefined) }}
                            onClick={async () => { await checkFollow(item.id, !item.is_follow) }}
                        >{item.is_follow ? (currentID === index ? 'Unfollow' : 'Following') : 'Follow'}</button>
                    }
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
        <>
            {
                peopleList.length
                    ?
                    <div id="grow-option-list" className={styles['people-list-box']}>
                        <div className={styles['people-list']}>
                            {
                                (peopleList || []).map((item, index) => {
                                    return (
                                        <div key={index + item.name}>
                                            {userCard(item, index)}
                                        </div>
                                    )
                                })
                            }
                            <div className={styles['no-more']}><span>{"no more"}</span></div>
                        </div>
                    </div>
                    :
                    <Nodata type={2} />
            }
        </>
    )
}

export default PeopleComponent