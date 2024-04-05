import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Tooltip } from "antd";
import Receive from "@/pages/wallet/components/Receive";
import { desensitizedCommon, copyTest } from "@/units/index";
import { retainDecimals } from "@/units";
import receiveImg from '@/assets/img/wallet/receive.svg';
import transferImg from '@/assets/img/wallet/transfer.svg';
import sendImg from '@/assets/img/wallet/send.svg';
import tradeImg from '@/assets/img/wallet/trade.svg';
import copyAddressImg from '@/assets/img/wallet/copy-address.svg';
import assetLoadingFlag from '@/assets/wallets/asset-loading.gif';
import { defaultCurrentChain, getAllChain, getToKenLists, sessionStorageKey } from "../../service";

// import { ethers, utils } from 'ethers';
// import ERC20ABI from "@/assets/erc20.json";
import { DataContext, useData } from "@/reducer";
import styles from "./index.module.less";
import { ReceiveQRApi } from "@/pages/wallet/api";
const Wallet = (props: { walletAddress: string }) => {
    const history = useHistory();
    const { walletAddress } = props;
    const state = useData();
    const { dispatch } = useContext<any>(DataContext);
    const chainListRef = useRef<any>();
    const [assetLoading, setAssetLoading] = useState<boolean>(false); // 加载钱包loading
    const getWalletChains = async () => {
        const result = await getAllChain()
        if (result?.code === 200) {
            const currentChainID = Number(sessionStorage.getItem(sessionStorageKey[0]))
            if (currentChainID) {
                const tempCurrentChain = (result?.data?.filter((item: any) => { return item.chain_id === currentChainID }))?.[0]
                dispatch({ type: 'changeChainCurrent', value: { id: currentChainID, icon: tempCurrentChain?.image_url, name: tempCurrentChain.name, rpcUrl: tempCurrentChain.rpc } });
                await getWalletList(currentChainID, tempCurrentChain.rpc)
            } else {
                dispatch({ type: 'changeChainCurrent', value: { id: defaultCurrentChain.id, icon: state.chainCurrent.icon, name: state.chainCurrent.name, rpcUrl: state.chainCurrent.rpcUrl } });
                sessionStorage.setItem(sessionStorageKey[0], String(defaultCurrentChain.id))
                await getWalletList(defaultCurrentChain.id, defaultCurrentChain.rpcUrl)
            }
        }
    }

    const getWalletList = async (chainID: number, rpcUrl: string) => {
        setAssetLoading(true);
        const TokenLists = await getToKenLists({
            chain_id: chainID,
        })
        setAssetLoading(false);
        if (TokenLists?.data?.length >= 1) {
            let tempwalletList = TokenLists?.data;
            /*向区块链请求 资产*/
            const tempArr = tempwalletList?.map((item: any) => {
                return (
                    {
                        name: item.token_symbol,
                        icon: item.token_icon,
                        num: item.token_balance
                    }
                )
            })
            dispatch({ type: 'changeWalletList', value: tempArr || [] });
        }
    }

    useEffect(() => {
        getWalletChains();
    }, [state.assetTriggerPsw])

    useLayoutEffect(() => {
        getWalletChains()
    }, [])

    return (
        <div className={styles['sub-wallet-box']}>
            <div className={styles['switch-chain']}>
                <div className={styles['default_chain']}>
                    <div ref={chainListRef} className={styles['switch-button']} >
                        <img src={state.chainCurrent.icon} alt={''} />
                        {/* {
                            ifChainList && (chainList.length > 0) &&
                            <div className={styles['chain-list']}>
                                {

                                    chainList.map((item, index) => {
                                        return (
                                            <div key={index} className={[styles['option-item'], state.chainCurrent?.id === item.chain_id ? styles.active : ''].join(' ')}
                                                onClick={async () => { await handelChainSelect(item) }}>
                                                <div className={styles['option-left']}>
                                                    <img src={item.image_url} alt={''} />
                                                    <span>{item.name}</span>
                                                </div>
                                                {
                                                    state.chainCurrent?.id === item.chain_id &&
                                                    <img src={isCreating ? chainLoading : chainActive} alt={''} />
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        } */}
                    </div>
                    <span>{state.chainCurrent?.name}</span>
                    {/* <img src={ifChainList ? currentChainActive : currentChain}
                        ref={copenRef}
                        alt={''}
                        onClick={(e) => { setChainList(!ifChainList) }} /> */}
                </div>
            </div>

            <div className={styles.address}>
                <span>{desensitizedCommon(walletAddress, 6, 6)}</span>
                <img onClick={(e) => {
                    e.stopPropagation();
                    copyTest(walletAddress);
                }} src={copyAddressImg} alt="" />
            </div>

            <div className={styles['wallet-btns']}>
                <div onClick={() => ReceiveQRApi({ walletAddress })} className={styles.option}>
                    <img src={receiveImg} alt="" />
                    <span>Receive</span>
                </div>
                <div onClick={() => {
                    history.push('/transfer');
                }} className={styles.option}>
                    <img src={transferImg} alt="" />
                    <span>Transfer</span>
                </div>
                <div onClick={() => {
                    history.push('/assetSend')
                }} className={styles.option}>
                    <img src={sendImg} alt="" />
                    <span>Send</span>
                </div>
                <Tooltip overlayInnerStyle={{ width: `3.1rem` }} title="Token trading is temporarily not supported during the closed beta." color={'#112438'}>
                    <div className={styles.option}>
                        <img src={tradeImg} alt="" />
                        <span>Trade</span>
                    </div>
                </Tooltip>
            </div>
            {
                assetLoading
                    ?
                    <div className={styles['asset-loading-box']}><img src={assetLoadingFlag} alt="" /></div>
                    :
                    <div className={styles['wallet-list']}  style={{display:(state?.walletList || []).length===0?'none':''}}>
                        {
                            (state?.walletList || []).map((item: { name: string; icon: string; num: string }, index: number) => {
                                return (
                                    <div key={index} className={styles['wallet-option']}>
                                        <div className={styles['option-left']}>
                                            <img src={item.icon} alt="" />
                                            <span>{item.name}</span>
                                        </div>

                                        {
                                            item.num.length > 10
                                                ?
                                                <Tooltip title={retainDecimals(item?.num || 0, 9)} color={'#112438'}>
                                                    <div className={styles.num}>{retainDecimals(item?.num || 0, 9)}</div>
                                                </Tooltip>
                                                :
                                                <div className={styles.num}>{retainDecimals(item?.num || 0, 9)}</div>
                                        }

                                    </div>
                                )
                            })
                        }
                    </div>
            }
        </div>
    )
}

export default Wallet;