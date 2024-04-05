import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.less";
import Spending from "./components/Spending";
import SubWallet from "./components/Wallet";
import { useHistory } from "react-router-dom";
import { DataContext } from "@/reducer";
import WalletCreate from "./components/CreteWallet";

import { sessionStorageKey, getWallet } from "@/pages/wallet/service";

const tabList = [
    {
        id: 1,
        name: 'Spending'
    },
    {
        id: 2,
        name: 'Wallet'
    },
]

const Wallets = () => {
    const { dispatch } = useContext<any>(DataContext);
    const history = useHistory()
    const [currentId, setCurrentId] = useState<number>(1);
    const [ifSuccessed, setIfSuccessed] = useState<boolean>(false);
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [ifCreateWallet, setIfCreateWallet] = useState<boolean>(false);
    const [chain_id] = useState<number>(Number(sessionStorage.getItem(sessionStorageKey[0])));
    const [checkAddressType, setCheckAddressType] = useState<number>(1); // 1 切换wallet 2. 跳转transfer
    const handelSpandWallet = (key: number) => {
        if (key === 2) {
            setCheckAddressType(1);
            getWalletAddress(1);
        } else {
            setCurrentId(key);
        }
    }

    const toTransfer = () => {
        setCheckAddressType(2)
        getWalletAddress(2);
    }

    const getWalletAddress = async (type: number) => {
        const result = await getWallet({
            chain_id,
        })
        if (result?.data === "") {
            setIfCreateWallet(true)
            return
        }
        if (type === 1) {
            setCurrentId(2)
        } else {
            history.push('/transfer?type=towallet');
        }
        setWalletAddress(result?.data);
    }

    const toWallet = () => {
        if (currentId === 1) {
            history.push('/wallet');
        } else {
            history.push('/wallet?type=wallet');
        }
    }

    useEffect(() => {
        if (ifSuccessed) {
            setIfCreateWallet(false);
            if (checkAddressType === 1) {
                getWalletAddress(1);
            } else {
                history.push('/transfer?type=towallet');
            }
        }
    }, [ifSuccessed])

    useEffect(() => {
        return () => {
            dispatch({ type: 'changeWalletInfo', value: { chainId: 0, userAddress: '' } });
        }
    }, [])

    return (
        <>
            <div className={styles['tab-list']}>
                {
                    tabList.map((item) => {
                        return (
                            <div onClick={() => { handelSpandWallet(item.id) }} key={item.id}
                                className={[styles['tab-option'], currentId === item.id ? styles.active : ''].join(' ')}>
                                <div className={[styles['tab-name'], currentId === item.id ? styles.active : ''].join(' ')}>
                                    {item.name}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {
                currentId === 1
                    ?
                    <Spending />
                    :
                    <SubWallet walletAddress={walletAddress} />
            }
            <div className={styles.btns}>
                {
                    currentId === 1
                    &&
                    <div onClick={toTransfer} className={styles['transfer-btn']}>Transfer</div>
                }
                <div className={styles['view-asserts']} onClick={toWallet}>
                    View all assets
                </div>
            </div>
            {
                ifCreateWallet &&
                <div className={styles['wallet-create']}>
                    <WalletCreate
                        closeWalletCreate={() => { setIfCreateWallet(false) }}
                        callResult={(last: boolean) => { setIfSuccessed(last) }}
                        chainId={chain_id}
                    />
                </div>
            }
        </>
    )
}
export default Wallets