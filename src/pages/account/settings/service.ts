import { request as http } from '@/utils/requestCloud';
import { AxiosRequestConfig } from 'axois';

export interface responseData {
  msg?: string;
  code?: number;
  data?: any;
}

// 更换头像
export function updateAvartar(file: string): Promise<responseData> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/user/setHeader`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.params.file = file;
  return http<responseData>(opt)
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