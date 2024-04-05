import React from "react";
// import loading1 from "./img/loading1.png";
import styles from './index.module.less';

export type LoadingProps = {
    isPadding?: boolean;
    className?: string;
}

const SearchLoading = (props: LoadingProps) => {
    const { isPadding = true } = props;
    return (
        <div className={[styles['loading-box'], isPadding ? styles.padding3 : '', props.className].join(' ')}>
            <div className={styles['loading-item']}>
                {/* <img src={loading1} alt="" /> */}
                <div className="wave" />
                <div className="mask" />
                <div className={styles['loading-item-content']}>
                    <div className={styles['content-header']}>
                        <div></div>
                        <div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div className={styles['content-box']}>
                        <div className={styles['user-box']}>
                            <div className={styles['user-icon']} />
                            <div className={styles['user-mmessage']}>
                                <div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div></div>
                            </div>
                        </div>
                        <div className={styles['content-text']}>
                            <div />
                        </div>
                    </div>
                    <div className={styles['content-img']} />
                    <div className={styles['content-bottom']}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
            <div className={styles['loading-item']}>
                {/* <img src={loading1} alt="" /> */}
                <div className="wave" />
                <div className="mask" />
                <div className={styles['loading-item-content']}>
                    <div className={styles['content-header']}>
                        <div></div>
                        <div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div className={styles['content-box']}>
                        <div className={styles['user-box']}>
                            <div className={styles['user-icon']} />
                            <div className={styles['user-mmessage']}>
                                <div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div></div>
                            </div>
                        </div>
                        <div className={styles['content-text']}>
                            <div />
                            <div />
                            <div />
                            <div />
                            <div />
                        </div>
                    </div>
                    <div className={styles['content-img']} />
                    <div className={styles['content-bottom']}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
            <div className={styles['loading-item']}>
                <div className="wave" />
                <div className="mask" />
                <div className={styles['loading-item-content']}>
                    <div className={styles['content-header']}>
                        <div></div>
                        <div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div className={styles['content-box']}>
                        <div className={styles['user-box']}>
                            <div className={styles['user-icon']} />
                            <div className={styles['user-mmessage']}>
                                <div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div></div>
                            </div>
                        </div>
                        <div className={styles['content-text']}>
                            <div />
                            <div />
                            <div />
                            <div />
                            <div />
                        </div>
                    </div>
                    <div className={styles['content-img']} />
                    <div className={styles['content-bottom']}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
            <div className={styles['loading-item']}>
                {/* <img src={loading1} alt="" /> */}
                <div className="wave" />
                <div className="mask" />
                <div className={styles['loading-item-content']}>
                    <div className={styles['content-header']}>
                        <div></div>
                        <div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div className={styles['content-box']}>
                        <div className={styles['user-box']}>
                            <div className={styles['user-icon']} />
                            <div className={styles['user-mmessage']}>
                                <div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div></div>
                            </div>
                        </div>
                        <div className={styles['content-text']}>
                            <div />
                        </div>
                    </div>
                    <div className={styles['content-img']} />
                    <div className={styles['content-bottom']}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SearchLoading;