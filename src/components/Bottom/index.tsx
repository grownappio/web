import React, { useLayoutEffect, useState } from "react";
import companyWhiteIcon from "@/assets/svg/company-icon-allwhite.svg";
import companyWhiteMobileIcon from "@/assets/svg/company-icon-allwhite-mobile.svg";
import styles from "./index.module.less";
import { isApp } from "@/units";

const Bottom = () => {
    let path = window.location.hash.split('?')[0];
    const [isDisplay, setIsDisplay] = useState<boolean>(true);
    const isapp = isApp()
    useLayoutEffect(() => {
        if (isapp) {
            switch (path) {
                case '#/profile/edit':
                    setIsDisplay(false)
                    break;
                case '#/community/communitySetting':
                    setIsDisplay(false)
                    break;
                case '#/community/releaseDynamics':
                    setIsDisplay(false)
                    break;
                case '#/community/MemberManage':
                    setIsDisplay(false)
                    break;
                case '#/community/commentInteraction':
                    setIsDisplay(false)
                    break;
                default:
                    setIsDisplay(true)
                    break;
            }
        }
    }, [path])

    return (
        <div className={styles.bottom}
            style={{ display: isDisplay ? '' : 'none' }}
        >
            <img src={isApp() ? companyWhiteMobileIcon : companyWhiteIcon} alt="" />
            <div className={styles.line} />
            <span>© 2022 The Rift, Inc.</span>
        </div>
    )
}

export default Bottom;