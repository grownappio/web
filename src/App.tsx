import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AliveScope } from 'react-activation'
import 'react-quill/dist/quill.snow.css';
import { ConfigProvider } from "antd-mobile";
import enUS from 'antd-mobile/es/locales/en-US'
import 'wc-fill-remain'
import 'wc-waterfall'
import { isApp } from "./units";
import { GlobalLoadingProvider } from "./reducer/index";
import { navigateOnChange } from './router/navigate';
import AppContent from "@/components/AppContent";
import "./antd.less";
import "./App.css";
import "./grow-ql-editor.less"
import "./ql-editor.less"
import "./Common.less";
import { client } from "./units/wagmi";
import { WagmiConfig } from 'wagmi';

function App() {
  const history = useHistory();
  useEffect(() => {
    if ((process.env.SYSTEM_ENV !== 'production') && isApp()) {
      // import('vconsole').then(e => new e.default());
    }
  }, [])
  useEffect(() => {
    const unListen = history.listen(location => {
      const { pathname, search } = location;

      navigateOnChange(pathname, search);
    })
    return () => unListen();
  }, [])

  return (
    <ConfigProvider locale={enUS}>
      <GlobalLoadingProvider>
        <AliveScope>
          {/* todo */}
          {/* <WagmiConfig client={client}> */}
            <AppContent />
          {/* </WagmiConfig> */}
        </AliveScope>
      </GlobalLoadingProvider>
    </ConfigProvider>
  )
}

export default App;
