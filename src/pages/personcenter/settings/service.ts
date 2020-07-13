import { request as http } from '@/utils/requestCloud';
import { AxiosRequestConfig } from 'axois';

export interface responseData {
  msg?: string;
  code?: number;
  data?: any;
}

// 获取头像
export function getAvatar(): Promise<responseData> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/user/getHeader`,
    method: 'post',
    params:{},
    data:{}
  }
  return http<responseData>(opt)
}


// 获取登录用户信息
export function getLoginUser(): Promise<responseData> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/user/current`,
    method: 'get',
    params:{},
    data:{}
  }
  return http<responseData>(opt)
}

// 修改登录用户信息
export function updateLoginUser(): Promise<responseData> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/user/password`,
    method: 'post',
    params:{},
    data:{}
  }
  return http<responseData>(opt)
}