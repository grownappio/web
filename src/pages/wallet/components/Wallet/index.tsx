import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import eventbus from "@/units/eventbus";
import { retainDecimals } from "@/units";
import { CaretDownOutlined } from '@ant-design/icons';
import { desensitizedCommon, copyTest } from "@/units/index";
import copyAddressImg from '@/assets/img/wallet/copy-address.svg';
import receiveImg from '@/assets/img/wallet/receive.svg';
import transferImg from '@/assets/img/wallet/transfer.svg';
import sendImg from '@/assets/img/wallet/send.svg';
import tradeImg from '@/assets/img/wallet/trade.svg';
import { Chain, defaultCurrentChain, getAllChain, getToKenLists, sessionStorageKey } from "../../service";
import { DataContext, useData } from "@/reducer";
import Tokens from "../Tokens";
import { ReceiveQRApi } from "../../api";

export type WalletProps = {
    setIfCreateWallet?: () => void;
    walletAddress: string;
}

const Wallet = (props: WalletProps) => {
    const { walletAddress } = props;
    const history = useHistory();
    const state = useData();
    const { dispatch } = useContext<any>(DataContext);
    const [chainList, setAllChainList] = useState<Chain[]>([]);
    const [isCreating, setCreating] = useState<boolean>(false);
    const [assetLoading, setAssetLoading] = useState<boolean>(false); // 加载钱包loading
    const [chain_id, setChainId] = useState<number>(Number(sessionStorage.getItem(sessionStorageKey[0])))

    // 钱包地址
    const [chanMaincurrency, setChanMaincurrency] = useState<{ token_symbol: string; token_balance: string }>({
        token_symbol: '',
        token_balance: '0'
    });

    const getWalletChains = async () => {
        const result = await getAllChain()
        setAllChainList(result.data)
        if (chain_id) {
            const chain = result.data?.find((e: any) => e.chain_id === chain_id)
            dispatch({ type: 'changeChainCurrent', value: { id: chain_id, icon: chain?.image_url, name: chain.name, rpcUrl: chain.rpc } });
            await getWalletList(chain_id, chain.rpc)
        } else {
            dispatch({ type: 'changeChainCurrent', value: { id: defaultCurrentChain.id, icon: state.chainCurrent.icon, name: state.chainCurrent.name, rpcUrl: state.chainCurrent.rpcUrl } });
            sessionStorage.setItem(sessionStorageKey[0], String(defaultCurrentChain.id))
            await getWalletList(defaultCurrentChain.id, defaultCurrentChain.rpcUrl)
        }
    }

    const getWalletList = async (chainID: number, rpcUrl: string) => {
        setCreating(true)
        // dispatch({ type: 'changeWalletList', value: [] })
        setAssetLoading(true);
        const TokenLists = await getToKenLists({
            chain_id: chainID,
        })
        setAssetLoading(false);
        if (TokenLists?.data?.length >= 1) {
            let tempwalletList = TokenLists?.data
            tempwalletList.forEach((item: any) => {
                if (!item.token_address) {
                    setChanMaincurrency({
                        token_symbol: item.token_symbol,
                        token_balance: item.token_balance
                    })
                }
            });
            /*向区块链请求 资产*/
            const tempArr = tempwalletList?.map((item: any) => {
                return (
                    {
                        name: item.token_symbol,
                        icon: item.token_icon,
                        num: item.token_balance,
                        token_address: item.token_address
                    }
                )
            })
            dispatch({ type: 'changeWalletList', value: tempArr || [] });
        }
        setCreating(false)
    }

    const handelChainSelect = async (item: Chain) => {
        if (isCreating) {
            return
        }
        sessionStorage.setItem(sessionStorageKey[0], String(item.chain_id))
        dispatch({ type: 'changeChainCurrent', value: { id: item.chain_id, icon: item.image_url, name: item.name, rpcUrl: item.rpc } });
        await getWalletList(item.chain_id, item.rpc)
    }

    useEffect(() => {
        if (!chain_id) return
        getWalletChains();
    }, [state.assetTriggerPsw, chain_id])

    useEffect(() => {
        eventbus.on('defaultChain', (value) => {
            setChainId(value);
        })
        // getWalletChains()
    }, [])

    return (
        <div>
            <div className="flex items-center justify-center mt-20">
                <img className="w-20 h-20" src={state.chainCurrent.icon} alt={''} />
                <span className="ml-8 mr-6">{ state.chainCurrent?.name }</span>
                <CaretDownOutlined className="text-10" />
                {/* todo: chainList e.chain_id e.image_url e.name */}
                {/* handelChainSelect(e) */}
            </div>

            <div className='my-16 text-30 font-medium leading-[36px] text-center'>{retainDecimals(chanMaincurrency?.token_balance || 0, 9)} {chanMaincurrency.token_symbol}</div>

            <div className="flex items-center mx-auto mb-24 py-8 px-16 w-fit rounded-full bg-text/6 leading-[17px]">
                <span className="opacity-60">{ desensitizedCommon(walletAddress, 6, 6) }</span>
                <img className="ml-16 w-10 h-10" onClick={() => copyTest(walletAddress)} src={copyAddressImg} alt="" />
            </div>
            
            <div className='flex justify-between my-16 px-30 [&_img]:rounded-full'>
                <div onClick={() => ReceiveQRApi({ walletAddress })} className="flex flex-col items-center">
                    <img className="mb-6 w-46 h-46" src={receiveImg} alt="" />
                    <span>Receive</span>
                </div>
                <div onClick={() => history.push('/transfer')} className="flex flex-col items-center">
                    <img className="mb-6 w-46 h-46" src={transferImg} alt="" />
                    <span>Transfer</span>
                </div>
                <div onClick={() => history.push('/assetSend')} className="flex flex-col items-center">
                    <img className="mb-6 w-46 h-46" src={sendImg} alt="" />
                    <span>Send</span>
                </div>
                {/* popover "Token trading is temporarily not supported during the closed beta." */}
                <div className="flex flex-col items-center">
                    <img className="mb-6 w-46 h-46" src={tradeImg} alt="" />
                    <span>Trade</span>
                </div>
            </div>

            <Tokens
                className='my-30 mx-16'
                list={state?.walletList || []}
                onItem={item => {
                    localStorage.setItem('walletAssetDetail', JSON.stringify({ ...item, wallet_address: walletAddress }))
                    history.push(`/walletRecord?walletAddress=${walletAddress}`)
                }}
            />
        </div>
    )
}

export default Wallet;