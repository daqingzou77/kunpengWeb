import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { notification } from 'antd';

const service = axios.create({
  baseURL: process.env.BACK_END_BASE, // url = base url + request url
  timeout: 5000*12,
  withCredentials: true // send cookies when cross-domain requests
});

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    const token = localStorage.getItem('token')
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// Response interceptors
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // Some example codes here:
    // code == 0: success
    // code == 401: invalid access token
    // You can change this part for your own usage.
    const res = response.data;
    // console.log(response)
    const {
      config: { url },
    } = response;
    if (response.status !== 200) { // 此处加status的判断是应对删除结构中不返回对象，只返回单个字段的问题
      // res.msg is backend error msg
      notification.error({
        type: 'error',
        message: `请求错误 ${res.code}: ${url}`,
        description: res.msg,
      });
      // if (res.code === 401) {
      //   // go to Login
      //   notification.error({
      //     type: 'error',
      //     message: `请求错误 ${res.code}:`,
      //     description: res.msg,
      //   });
      // }
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return response;
  },
  (error: AxiosError) => {
    const response = error.response! || ({} as AxiosResponse);
    const { data = {} } = response;
    console.warn(data);
    const { data: innerData = {} } = data;
    const resp = {
      code: data.code || response.status,
      msg: innerData.msg || data.msg || response.statusText || data.code,
      data: error,
    };
    const {
      config: { url },
    } = error;
    notification.error({
      type: 'error',
      message: `请求错误 ${resp.code}: ${url}`,
      description: resp.msg,
    });
    return Promise.reject(error);
  },
);

export default service;

function request<R>(opt: AxiosRequestConfig): Promise<R> {
  const promise = new Promise((resolve) => {
    service(opt)
      .then((resp) => {
        resolve(resp.data as R);
      })
      .catch((error) => {
        console.warn(error);
        resolve(error);
      });
  });
  return promise as Promise<R>;
}

export { request };
