import request from "@/units/request";

import mintIcon from '@/assets/wallets/mint.svg';
import lostIcon from '@/assets/wallets/lost.svg';
import depositIcon from '@/assets/wallets/deposit.svg';
import withdrawIcon from '@/assets/wallets/withdraw.svg';
import onChianFeeIcon from '@/assets/wallets/on-chian-fee.svg';
import earn from '@/assets/wallets/earn.svg';
import gasIcon from '@/assets/wallets/gas.svg';
import prizePoolIcon from '@/assets/wallets/prize-pool.svg';

export type Chain = {
    id: number;
    name: string;
    rpc: string;
    step: number;
    chain_id: number;
    confirm_block: number;
    created_at: string;
    image_url: string;
    updated_at: string;
}

export const sessionStorageKey = ['current_chain_id',]//记录当前窗口记录链ID

export const defaultCurrentChain = {
    id: 97,
    icon: 'https://rift-upload.s3.ap-southeast-1.amazonaws.com/img0/16780722321678072232280990300MUHLKB',
    name: 'BNB Smart Chain Testnet',
    rpcUrl: 'https://rpc.ankr.com/bsc_testnet_chapel'
}


export type transformInstance = {
    amount: string
    balance: string
    chain_id: number
    chain_name: string
    created_at: string
    explore_url: string
    from: string
    id: number
    remark: string
    status: keyof typeof RecordStatus
    to: string
    token_address: string
    token_id: number
    token_name: string
    token_symbol: string
    tx_id: string
    type: keyof typeof RecordType
    sub_type: keyof typeof RecordType
    updated_at: string
    user_id: number
    timestamp:number
    action:number
    source_id:number
}

export const RecordType: { [key: number]: { name: string; icon: string } } = {
    // 铸造
    1: { name: 'Mint', icon: mintIcon },
    // 丢失
    2: { name: 'Lost', icon: lostIcon },
    // 充值
    3: { name: 'Deposit', icon: depositIcon },
    // 提现
    4: { name: 'Withdraw', icon: withdrawIcon },
    // 链上手续费
    5: { name: 'On-chain fee', icon: onChianFeeIcon },
    // 赚取
    6: { name: 'Earn', icon: earn },
    // 手续费
    7: { name: 'Gas', icon: gasIcon },
    // 转入奖池
    8: { name: 'Prize pool', icon: prizePoolIcon },
}

export const RecordStatus = {
    1: 'In progress',
    2: 'Confirmed',
    3: 'Failed'
}

export const ClassNameType = {
    1: 'inProgress',
    2: 'completed',
    3: 'failed'
}


/**
 * 发送验证码
 */
export async function sendCode() {
    return request({
        method: "POST",
        url: "/user/sendCode"
    });
}


/**
 * 验证code
 */
export async function checkCode(data: { code: number | string }) {
    return request({
        method: "POST",
        url: "/user/checkCode",
        data,
    });
}



/**
*  获取所有钱包
*/
export async function getWallet(data: {
    chain_id: number
    passphrase?: string
}) {
    return request({
        method: "POST",
        url: "/wallet/getWalletAddress",
        data,
    });
}

/**
 *  获取所有链
 */
export async function getAllChain(data?: any) {
    return request({
        method: "POST",
        url: "/wallet/chains",
        data,
    });
}

/**
 *  获取用户钱包地址
 */
export async function getUserAddress(data: {
    chain_id: number
}) {
    return request({
        method: "POST",
        url: "/wallet/address",
        data,
    });
}

/**
 *  获取用户钱包地址
 */
export async function creatWallet(data: {
    chain_id: number,
    password: string,
}) {
    return request({
        method: "POST",
        url: "/wallet/createWallet",
        data,
    });
}

/**
 *  获取用ToKenLists
 */
export async function getToKenLists(data: {
    chain_id: number,
}) {
    return request({
        method: "POST",
        url: "/wallet/getAssets",
        data,
    });
}

/**
 *  获取获取资金记录(Spending)
 */
export async function getFundRecords(data: any) {
    return request({
        method: "POST",
        url: "/spending/getFundRecords",
        data,
    });
}

/**
 *  获取获取资金记录(wallet)
 */
export async function getTxlist(data: any) {
    return request({
        method: "POST",
        url: "/wallet/getTxlist",
        data,
    });
}

/**
 *  
转账给spending账户(Wallet)
 */
export async function transferToSpending(data: {
    chain_id: number;
    token_id: number;
    amount: string;
}) {
    return request({
        method: "POST",
        url: "/wallet/transferToSpending",
        data,
    });
}

/**
 *  转账给钱包账户(Spending)
 */
export async function transferToWallet(data: {
    chain_id: number;
    token_id: number;
    amount: string;
}) {
    return request({
        method: "POST",
        url: "/spending/transferToWallet",
        data,
    });
}

/**
 *  转账给钱包账户(Spending)
 */
export async function transferToExternal(data: {
    chain_id: number;
    token_id: number;
    amount: string;
    to: string;
}) {
    return request({
        method: "POST",
        url: "/wallet/transferToExternal",
        data,
    });
}




// 获取手续费
export async function getGasFee(data: any) {
    return request({
        method: "POST",
        url: "/wallet/getGasFee",
        data,
    });
}

// 获取钱包余额 （我们自己这边的）
export async function getBalance(data: any) {
    return request({
        method: "POST",
        url: "/user/balance",
        data
    });
}

// 验证钱包密码
export async function checkPassword(data: any) {
    return request({
        method: "POST",
        url: "/wallet/checkPassword",
        data
    });
}

// 获取代币列表
export async function getTokens(data: any) {
    return request({
        method: "POST",
        url: "/wallet/getTokens",
        data
    });
}