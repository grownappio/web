import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client"
import styles from './index.module.less';
import SuccessIcon from '@/assets/img/success.png';
import InfoIcon from '@/assets/img/info.png';
import WarnIcon from '@/assets/img/warn.png';
import ErrorIcon from '@/assets/img/error.png';

const Message = (props: {type: 'success' | 'error' | 'info' | 'warn', message: string}) => {
    const { type, message } = props;
    const [boxStyle, setStyle] = useState({top: '-100px'})
    useEffect(() => {
        setTimeout(() => {
            setStyle({top: '30px'})
        }, 200)
    })
    const renderMsg = () => {
        switch(type) {
            case 'success':
                return (<div className={styles['show-success']}><img src={SuccessIcon} alt="" /><span>{message}</span></div>);
            case 'error': 
                return (<div className={styles['show-error']}><img src={ErrorIcon} alt="" /><span>{message}</span></div>);
            case 'info':
                return (<div className={styles['show-info']}><img src={InfoIcon} alt="" /><span>{message}</span></div>);
            case 'warn':
                return (<div className={styles['show-warn']}><img src={WarnIcon} alt="" /><span>{message}</span></div>);
        }
    }
    return (
        <div className={styles['pop-message']} style={boxStyle}>
            {renderMsg()}
        </div>
    )
}

export const myMessage = (opt: {type: 'success' | 'error' | 'info' | 'warn', message: string, duration?: number}) => {
    const {type, message, duration = 2000} = opt;
    const domDiv = document.createElement('div');
    document.body.appendChild(domDiv);
    ReactDOM.createRoot(domDiv).render(<Message type={type} message={message} />);
    setTimeout(() => {
        document.body.removeChild(domDiv);
    }, duration)
}