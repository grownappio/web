// import { infuraProvider } from 'wagmi/providers/infura'
// import { alchemyProvider } from 'wagmi/providers/alchemy'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { configureChains, createClient } from 'wagmi'
import {bsc,bscTestnet,mainnet,goerli,polygon,polygonMumbai} from 'wagmi/chains'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

export const infuraId= '76a0a5eef392487fad82508799759859'
export const AlchemyApiKey= 'I6Uwtm3wy969b1-S8b2LMSsMOSrPGhP0'
export const walletConnectProjectId = '3314bb8122b62b6ee5e97790d6a38d0d'

export const getRpcUrl=()=>{
    const NetWork = Number(sessionStorage.getItem('NetWork'))
    switch(NetWork){
        case 1:
            return  {
                RpcUrl:'https://mainnet.infura.io/v3/',
                webSocket:'wss://mainnet.infura.io/v3/',
                DefaultChains:mainnet,
            }
        case 5:
            return  {
                RpcUrl:'https://goerli.infura.io/v3/',
                webSocket:'wss://goerli.infura.io/v3/',
                DefaultChains:goerli,
            }
        case 56:
            return  {
                RpcUrl:'https://bsc-dataseed1.defibit.io',
                webSocket:'wss://bsc-dataseed1.defibit.io',
                DefaultChains:bsc,
            }
        case 97:
            return  {
                RpcUrl:'https://bsc-testnet.public.blastapi.io',
                webSocket:'wss://bsc-testnet.public.blastapi.io',
                DefaultChains:bscTestnet,
            }
        case 137:
            return  {
                RpcUrl:'https://polygon-rpc.com',
                webSocket:'wss://polygon-rpc.com',
                DefaultChains:polygon,
            }
        case 80001:
            return  {
                RpcUrl:'https://rpc-mumbai.maticvigil.com',
                webSocket:'wss://rpc-mumbai.maticvigil.com',
                DefaultChains:polygonMumbai,
            }
        default:
            return  {
                RpcUrl:'https://bsc-dataseed1.defibit.io',
                webSocket:'wss://bsc-dataseed1.defibit.io',
                DefaultChains:bsc,
            }
    }
}

const { chains, provider, webSocketProvider } = configureChains(
    [getRpcUrl().DefaultChains ],
    [
      // alchemyProvider({ apiKey: AlchemyApiKey,priority: 1,stallTimeout: 3000}),
      // infuraProvider({ apiKey: infuraId,priority: 2,stallTimeout: 3000}),
      jsonRpcProvider({
        rpc: (chain) => ({
          http: getRpcUrl().RpcUrl,
          webSocket: getRpcUrl().webSocket,  //可选的选项
        }),
        priority: 3,
        stallTimeout: 3000,
      }),
      publicProvider()
    ],
    { targetQuorum: 1 },//不能关掉否则无法弹窗
)

export const walletConnector= new WalletConnectConnector({
  chains,
  options: {
      qrcode: true,
  },
})

export const client = createClient({
  autoConnect: true,
  connectors: [
    walletConnector,
  ],
  provider,
  webSocketProvider,
})

export { chains }
