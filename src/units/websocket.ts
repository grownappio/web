import { useState, useRef, useEffect } from 'react';
interface PropsWebStock {
  url?: string;
}
let timeoutObj: any = null;
let serverTimeoutObj: any = null;
const useWebsocket = ({ url = process.env.SOCKET_URL }: PropsWebStock) => {
  const ws = useRef<WebSocket | null>(null)
  // socket 数据
  const [wsData, setMessage] = useState<any>({})
  //  socket 状态
  const [readyState, setReadyState] = useState<any>({ key: 0, value: 'Connecting...' })

  const creatWebSocket = () => {

    const stateArr = [
      { key: 0, value: 'Connecting' },
      { key: 1, value: 'Connected and able to communicate' },
      { key: 2, value: 'Connection is closing' },
      { key: 3, value: 'Connection closed or unsuccessful' },
    ]

    try {
      ws.current = new WebSocket(url || '');
      ws.current.onopen = () => {
        heartCheck.start();
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      }
      ws.current.onclose = () => {
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      }
      ws.current.onerror = () => {
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      }
      ws.current.onmessage = (e) => {
        setMessage({ ...JSON.parse(e.data) });
      }

    } catch (error) {
      console.log(error);
    }
  }

  const webSocketInit = () => {
    if (!ws.current || ws.current.readyState === 3) {
      creatWebSocket();
    }
  }

  //  关闭 WebSocket
  const closeWebSocket = () => {
    ws.current?.close();
  }

  // 发送数据
  const sendMessage = (str: string) => {
    ws.current?.send(str);
  }

  //重连
  const reconnect = () => {
    try {
      closeWebSocket()
      ws.current = null;
      creatWebSocket()
    } catch (e) {
      console.log(e)
    }
  }

  //心跳检测
  const heartCheck = {
    timeout: 25 * 1000,
    start: function () {
      timeoutObj && clearTimeout(timeoutObj);
      serverTimeoutObj && clearTimeout(serverTimeoutObj);
      timeoutObj = setInterval(function () {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        const params: {
          type: number;
          body: string;
        } = {
          type: 1,
          body: 'ping'
        }
        ws?.current?.send(JSON.stringify(params));

      }, this.timeout)
    }
  }

  useEffect(() => {
    webSocketInit()
    return () => {
      ws.current?.close();
    }
  }, [ws])

  return {
    wsData,
    readyState,
    closeWebSocket,
    reconnect,
    sendMessage,
    ws
  }
}
export default useWebsocket