import request from "@/units/request";


export const sessionStorageKey = ['current_chain_id',]

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

export const defaultCurrentChain = {
    id: 80001,
    icon: 'https://rift-upload.s3.ap-southeast-1.amazonaws.com/img0/16780722321678072232280990300MUHLKB',
    name: 'Polygon Testnet',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com'
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