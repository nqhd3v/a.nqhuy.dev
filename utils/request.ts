import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10001/api';

const request = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});
const requestCustom = axios.create({
  timeout: 10000,
});

// REQUEST INTERCEPTORS =====================

const onRequestFullFilledHandler = function (config: AxiosRequestConfig) {
  const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || '';
  if (API_TOKEN) {
    return {
      ...config,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
      },
    };
  }
  return config;
};
const onRequestRejected = function (error: any) {
  return {
    isError: true,
    type: 'request',
    errCode: error.code,
    err: error,
  };
}
request.interceptors.request.use(onRequestFullFilledHandler, onRequestRejected);
requestCustom.interceptors.request.use(onRequestFullFilledHandler, onRequestRejected);


// RESPONSE INTERCEPTORS =====================
const onResponseSuccess: any = (res: AxiosResponse<any, any>) => {
  return res.data;
}
const onResponseError = (error: any) => {
  return {
    isError: true,
    type: 'response',
    errCode: error.code,
    err: error,
  };
}
request.interceptors.response.use(onResponseSuccess, onResponseError);
requestCustom.interceptors.response.use(onResponseSuccess, onResponseError);

export default request;
export {
  requestCustom,
};