import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { dispatchRef } from "@/reducer";
import { message } from "antd";
import { getToken, setToken, checkLoginWhiteList, redirectToLoginPage, getWalletToken, setWalletToken } from "@/units/index";
import { ERRPR_CODE, IGNORE_ERRPR_CODE } from "@/units/commonData";
import { VerifyPasswordApi } from "@/pages/wallet/api";

axios.defaults.timeout = 100000;
axios.defaults.baseURL = process.env.API_ROOT;

export type Config = AxiosRequestConfig<any> & Partial<{
  showLoading: boolean;
  noToken: boolean;
  noMedicalInstitutionNo: boolean;
  showError: (s: string) => void
  [k: string]: any
}>;

type Response = AxiosResponse & { config: Config }

const API_STATUS = {
  TOKEN_ERROP: 1003,
  WALLET_TOKEN_ERROR: 1030
};

/**
 * http request 拦截器
 */
axios.interceptors.request.use(
  (config) => {
    config.headers ??= {}
    config.headers['token'] ??= getToken() || '';
    config.headers['wallet-token'] ??= getWalletToken() || ''
    config.headers["Content-Type"] ??= "application/json"
    // config.data = JSON.stringify(config.data);
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

/**
 * http response 拦截器
 */
axios.interceptors.response.use(
  (response) => {
    responseInterceptor(response);
    return response;
  },
  (error) => {
    const toast = (error.config as Config).showError ?? message.error
    toast(error.message)
  }
);

const onErrorFunc = (res: Response) => {
  const data = res.data
  if (!IGNORE_ERRPR_CODE.includes(String(data.code))) {
    // 显示错误信息
    const error = res.config.showError ?? message.error
    error(ERRPR_CODE[data.code ? String(data.code) : '2'] || 'request failed')
    throw res
  } else {
    return data
  }
};

// 响应拦截，查看请求是否有4xx，5xx错误
const responseInterceptor = (res: Response) => {
  if (res.data.code === 200) return
  if (res.data.code === API_STATUS.TOKEN_ERROP) {
    setToken('');
    const { hash } = window.location;
    if (!checkLoginWhiteList(hash)) {
      sessionStorage.setItem('returnUrl', window.location.href);
      dispatchRef.current({ type: 'changeIsLoging', value: false });
      redirectToLoginPage();
    }
    throw res
  } else if (res.data.code === API_STATUS.WALLET_TOKEN_ERROR) {
    setWalletToken('');
    // 钱包密码验证弹窗
    VerifyPasswordApi();
    throw res
  } else {
    onErrorFunc(res);
  }
};

//统一接口处理，返回数据
const ApiRequest = async (requestConfig: Config) => {
  const { method = "GET", ...config } = requestConfig;
  return (await axios({ method, ...config })).data;
};

export default ApiRequest;
