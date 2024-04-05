import React, { useEffect, useState } from 'react';
import delMaskCloseImg from "@/assets/img/profile/photoAlbum/del-mask-close.svg";
import buttonLoading from "@/assets/img/login/button-loading.gif";
import styles from './index.module.less';

interface ModalProps {
    open: boolean;
    title: string;
    loadingFlag?: boolean;
    okText?: string;
    cancelText?: string;
    okStyle?: any;
    onCancel: () => void;
    onConfirm: () => void;
    [key: string]: any;
}

const ShowInfoModal = (props: ModalProps) => {
    const {
        title = 'title', children = 'content',
        open = false, loadingFlag = false,
        okText = '', cancelText = '', okStyle = {},
        onCancel, onConfirm,
    } = props;
    const [visible, setValue] = useState<boolean>(false);

    useEffect(() => {
        setValue(open);
    }, [open]);

    const handleClose = (value: boolean) => {
        setValue(value)
    };

    const handleOnCancel = () => {
        onCancel && onCancel();
        handleClose(false);
    }

    const handleOnConfirm = () => {
        onConfirm && onConfirm();
    }

    if (!visible) {
        return <></>;
    }

    return (
        <div className={styles['modal']}>
            <div onClick={handleOnCancel} className={styles.mask}>
                <div onClick={(e) => e.stopPropagation()} className={'modal-box'}>
                    <img onClick={handleOnCancel} className={styles['close-icon']} src={delMaskCloseImg} alt="" />
                    <div className={styles['title']}>{title}</div>
                    <div className={styles['content']}>
                        {children}
                    </div>
                    <div className={styles['footer']}>
                        <div className={styles['action-btn']}>
                            <button onClick={handleOnCancel}>{cancelText || 'Cancel'}</button>
                            <button onClick={handleOnConfirm} style={okStyle}>{
                                loadingFlag
                                    ?
                                    <img src={buttonLoading} alt="" />
                                    :
                                    (okText || 'Confirm')
                            }</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowInfoModal;
