import MetaMaskOnboarding from '@metamask/onboarding'
import { message } from "antd";
import Web3 from 'web3';
import { MerkleTree } from "merkletreejs"
import keccak256 from "keccak256"

/* 创建MerkleTree 验证是否在白名单里面*/
const handler = (address, whitelist) => {
    /*没有window.Buffer无法获得 whitelistProf-用来验证是否在 MerkleTree  中*/
    window.Buffer = window.Buffer || require("buffer").Buffer;
    const hashedAddresses = (whitelist || []).map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(hashedAddresses, keccak256, { sortPairs: true });
    const hashedAddress = keccak256(address)
    const proof = merkleTree.getHexProof(hashedAddress);
    const root = merkleTree.getHexRoot();
    const valid = merkleTree.verify(proof, hashedAddress, root);
    return ({
        proof,
        valid,
        root,
    })
}

export default handler
/*-----------------创建一个合约实例-----------------------------------*/
const web3 = new Web3(Web3.givenProvider)

export const connectMetaMask = async () => {
    const { ethereum } = window
    let address = ''
    address = await ethereum.request({ method: 'eth_requestAccounts', });
    return address[0]
}

// 检测连接的网络是否正确,不符合则切换网络，否则添加网络。
export const switchingNetwork = async (NetWork) => {
    const { ethereum } = window
    let networkId = ''
    try {
        networkId = await ethereum.request({
            method: 'net_version',
        })
    } catch (err) {
        console.error('获取链ID错误', err)
    }
    if (NetWork !== Number(networkId)) {
        console.log('NetWork!==networkId', typeof (NetWork), typeof (networkId))
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{
                chainId: Web3.utils.numberToHex(NetWork),// 目标链ID
            }],
        }).then(() => {
            message.success('NetWork switch succeeded!')
        }).catch((err) => {
            message.warning(`Please Add  NetWork ${NetWork}`);
        })
    }
}
export const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
};


export const meatMaskInstall = () => {
    const forwarderOrigin = '';
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
    onboarding.startOnboarding();
};

//----------------------------------------------------------------------------------

export const getUserWhiteMintCounts = async (account, NFT) => {
    function checkIfClaimed() {
        return NFT.methods.whitelistSaleMintCounts(account).call({ from: account })
    }
    return await checkIfClaimed()
};

export const getUserCommunityMintCounts = async (account, NFT) => {
    function checkIfClaimed() {
        return NFT.methods.communitySaleMintCounts(account).call({ from: account })
    }
    return await checkIfClaimed()
};

export const gettotalSupplyCounts = async (account, NFT) => {
    console.log(account)
    if (!NFT) return
    function checkIfClaimed() {
        return NFT?.methods?.totalSupply().call({ from: account })
    }
    return await checkIfClaimed()
};

/*------------------------真实----铸造--------------------------------*/

export const getEstimateGas = async (round, account, price, NFT, proof) => {
    console.log('getEstimateGas...');
    const amountToWei = web3.utils.toWei(price, 'ether');
    let estimateGas = null
    switch (round) {
        case 1:
            estimateGas = await NFT.methods.whitelistMint(1, proof)
                .estimateGas({
                    from: account,
                    value: amountToWei,
                });
            break
        case 2:
            estimateGas = await NFT.methods.communityMint(1, proof)
                .estimateGas({
                    from: account,
                    value: amountToWei,
                });
            break
        case 3:
            estimateGas = await NFT.methods.publicMint(1)
                .estimateGas({
                    from: account,
                    value: amountToWei,
                });
            break
        default:
    }
    console.log('getEstimateGas...:', estimateGas);
    return estimateGas
}

export const mintWhitelist = async (account, price, proof, NFT) => {
    console.log('minting whitelist...');
    const amountToWei = web3.utils.toWei(price, 'ether');
    let estimateGas = await NFT.methods.whitelistMint(
        1, proof
    ).estimateGas({
        from: account,
        value: amountToWei,
    });
    const result = NFT.methods.whitelistMint(1, proof).send({ from: account, value: amountToWei, gas: estimateGas }).then((result) => {
        console.log(`✅ Check out your transaction on Etherscan: https://etherscan.io/tx/` + result);
        return {
            success: true,
            status: `✅ Check out your transaction on Etherscan: https://etherscan.io/tx/` + result
        };
    }).catch((err) => {
        console.log("Mint transaction failed!");
        return {
            success: false,
            status: "😥 Something went wrong: " + err.message
        }
    }).finally((result) => {
        return result;
    });
    return result;
};

export const mintCommunity = async (account, proof, price, NFT) => {
    console.log('minting Community...');
    const amountToWei = web3.utils.toWei(price, 'ether');
    console.log('--------------', price, amountToWei)
    let estimateGas = await NFT.methods.communityMint(
        1, proof
    ).estimateGas({
        from: account,
        value: amountToWei,
    });
    const result = NFT.methods.communityMint(1, proof).send({ from: account, value: amountToWei, gas: estimateGas }).then((result) => {
        return {
            success: true,
            status: `✅ Check out your transaction on Etherscan: https://etherscan.io/tx/` + result
        };
    }).catch((err) => {
        return {
            success: false,
            status: "😥 Something went wrong: " + err.message
        }
    });
    return result;
};

export const mintPublic = async (account, price, NFT) => {
    console.log('minting publicMint...');
    const amountToWei = web3.utils.toWei(price, 'ether');
    // let estimateGas =  await  NFT.methods.publicMint(
    //     1
    // ).estimateGas({
    //     from:account,
    //     value: amountToWei,
    // });


    const result = NFT.methods.publicMint(1).send({ from: account, value: amountToWei }).then((result) => {
        return {
            success: true,
            status: `✅ Check out your transaction on Etherscan: https://etherscan.io/tx/` + result
        };
    }).catch((err) => {
        return {
            success: false,
            status: "😥 Something went wrong: " + err.message
        }
    });
    return result;
};
//--------------------------------------------------------------
