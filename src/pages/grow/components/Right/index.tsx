import React, { useState } from "react";
import { useData } from '@/reducer/index';
import historySearch from '@/assets/img/grow/history-search.svg';
import historySearch2 from '@/assets/img/grow/history-search2.svg';

import historySearchSelect from '@/assets/img/grow/history-search-select.svg';
import historyClose from '@/assets/img/grow/history-close.svg';
import seacrhImg from '@/assets/img/grow/search.svg';
import delImg from '@/assets/img/grow/del.svg';
import hotSearch from '@/assets/img/grow/hot-search.svg';

import hotSearch2 from '@/assets/img/grow/hot-search2.svg';
import hotSearchSelect from '@/assets/img/grow/hot-search-select.svg';
import styles from './index.module.less';
import seacrhSelectImg from "@/assets/img/grow/search-select.svg";


export type RightProps = {
    hotData: any[];
    isSearch: boolean;
    latestSearch: string;
    searchValue: string;
    clearAllHistory: (value: string) => void;
    fillSearch: (value: string) => void;
    setSearchValue: (value: string) => void;
}

const RightComponents = (props: RightProps) => {
    const state = useData();
    const { hotData, isSearch, clearAllHistory, fillSearch, setSearchValue, searchValue } = props;
    const [currentTab, setCurrentTab] = useState<number>(0);
    const [inputType, setInputType] = useState<boolean>(false);
    return (
        <div className={styles['right-search']}>
            {
                !isSearch
                &&
                <div className={[styles['search-input-box'], inputType ? styles.active : ''].join(' ')}>
                    <div style={{ flex: 1 }}>
                        <input placeholder="Search In Grown" className={styles['search-input']} type="text"
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                            }} value={searchValue}
                            onFocus={() => {
                                setInputType(true);
                            }}
                            onBlur={() => {
                                setInputType(false);
                            }}
                            onKeyUp={(e) => {
                                const keyCode = e.keyCode || e.which || e.charCode;
                                if (keyCode === 13) {
                                    if (searchValue) {
                                        fillSearch(searchValue)
                                    }
                                }
                            }}
                        />

                        <div className={styles['clear-box']}></div>
                    </div>
                    <img className={styles['search-icon']} src={inputType ? seacrhSelectImg : seacrhImg} style={{ opacity: (inputType || searchValue) ? 1 : 0.3 }} alt=""
                        onClick={() => {
                            if (!searchValue) return
                            fillSearch(searchValue)
                        }}
                    />
                </div>
            }
            {
                isSearch
                    ?
                    <div className={styles['options-tags']}>
                        <div className={styles['tabs']}>
                            <div className={[styles['search-item']].join(' ')}>
                                <div className={styles['tab-title']}>
                                    <img src={hotSearch2} alt={''} />
                                    <span>Hot search</span>
                                </div>
                                <div className={styles['sub-tab-list']}>
                                    {
                                        (hotData || []).map((item: any) => {
                                            return (
                                                <div onClick={() => {setSearchValue(item.word);fillSearch(item.word);}}
                                                     key={item.id}
                                                     className={[styles['tab-option']].join(' ')}>{item.word.length > 10 ? `${item.word.substring(0, 10)}...` : item.word}</div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <div
                                className={[styles['search-item']].join(' ')}
                                style={{ marginTop: '21px' }}
                            >
                                <div className={styles['tab-title']}>
                                    <img src={historySearch2} alt={''} />
                                    <span>History</span>
                                </div>
                                <div className={styles['sub-tab-list']}>
                                    {
                                        (state.historySearchData || []).map((item: any) => {
                                            return (
                                                <div onClick={() => {
                                                    setSearchValue(item);
                                                    fillSearch(item);
                                                }} key={item} className={[styles['tab-option']].join(' ')}>
                                                    {item.length > 10 ? `${item.substring(0, 10)}...` : item}
                                                    <img onClick={(e) => {
                                                        e.stopPropagation();
                                                        clearAllHistory(item);
                                                    }} src={historyClose} alt="" />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div onClick={() => {
                                    clearAllHistory('');
                                }} className={styles['history-clear-btn']}>
                                    <img src={delImg} alt="" />
                                    <span>Clear all</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className={styles['new-tab-box']}>
                        <div className={styles['new-tab-list']}>
                            <div onClick={() => {
                                setCurrentTab(0)
                            }} className={[styles['new-tab-option'], currentTab === 0 ? styles.active : ''].join(' ')}>
                                <img src={currentTab === 0 ? hotSearchSelect : hotSearch} alt="" />
                                <span>Hot</span>
                            </div>
                            <div onClick={() => {
                                setCurrentTab(1)
                            }} className={[styles['new-tab-option'], currentTab === 1 ? styles.active : ''].join(' ')}>
                                <img src={currentTab === 1 ? historySearchSelect : historySearch} alt="" />
                                <span>History</span>
                            </div>
                        </div>
                        {
                            currentTab === 0
                            &&
                            <div className={styles['sub-tab-list']}>
                                {
                                    (hotData || []).map((item: any, index: number) => {
                                        return (
                                            <div onClick={() => {
                                                setSearchValue(item.word);
                                                fillSearch(item.word);
                                            }} key={item.id} className={[styles['tab-option']].join(' ')}>{item.word.length > 10 ? `${item.word.substring(0, 10)}...` : item.word}</div>
                                        )
                                    })
                                }
                            </div>
                        }
                        {
                            currentTab === 1
                            &&
                            <div className={styles['sub-tab-list']}>
                                {
                                    (state.historySearchData || []).map((item: any) => {
                                        return (
                                            <div onClick={() => {
                                                setSearchValue(item);
                                                fillSearch(item);
                                            }} key={item} className={[styles['tab-option']].join(' ')}>
                                                {item.length > 10 ? `${item.substring(0, 10)}...` : item}
                                                <img onClick={(e) => {
                                                    e.stopPropagation();
                                                    clearAllHistory(item);
                                                }} src={historyClose} alt="" />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                        {
                            currentTab === 1
                            &&
                            <div onClick={() => {
                                clearAllHistory('');
                            }} className={styles['history-clear-btn']}>
                                <img src={delImg} alt="" />
                                <span>Clear all</span>
                            </div>
                        }
                    </div>
            }
        </div>
    )
}

export default RightComponents;