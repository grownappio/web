import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAsyncEffect } from "ahooks";
import { useSearchQuerys } from "@/hooks/useSearchQuerys";
import { DataContext } from "@/reducer";
import Spending from "../Spending";
import SubWallet from "../Wallet";
import { CheckAccountApi } from "../../api";

export type WalletProps = {
    setCurrentTab: (value: number) => void;
}

const Wallets = () => {
    const { dispatch } = useContext<any>(DataContext);
    const history = useHistory();
    const qs = useSearchQuerys({ type: 'spending' })
    const [walletAddress, setWalletAddress] = useState<string>('');

    const toTransfer = async () => {
        await CheckAccountApi()
        history.push('/transfer?type=towallet');
    }

    useEffect(() => {
        return () => dispatch({ type: 'changeWalletInfo', value: { chainId: 0, userAddress: '' } });
    }, [])

    useAsyncEffect(async () => {
        if (qs.type !== 'wallet') return
        const address = await CheckAccountApi() as string
        setWalletAddress(address)
    }, [qs.type])


    return (
        qs.type === 'spending'
            ? <Spending toTransfer={toTransfer} />
            : <SubWallet walletAddress={walletAddress} />
    )
}
export default Wallets