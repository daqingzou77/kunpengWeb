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
    method: 'get',
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
export function updateLoginUser(data:{ address?:string, email?: string, phone?: string }): Promise<responseData> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/user/update`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data = {
    address: data.address,
    email: data.email,
    phone: data.phone
  }
  return http<responseData>(opt)
}

// 已上传农事数据查询
export function getuploadRecords(): Promise<responseData> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/user/getRecords`,
    method: 'get',
    params:{},
    data:{}
  }
  return http<responseData>(opt)
}