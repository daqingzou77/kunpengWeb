import { request as http } from '@/utils/requestCloud';
import { AxiosRequestConfig } from 'axois';

export interface responseData {
  msg?: string;
  code?: number;
  data?: any;
}

// 新增用户列表

export function addUser(data: {username: string, password: string, role: number, identity: string}): Promise<responseData> {
    const opt: AxiosRequestConfig = {
      url:`/api/v1/user/register`,
      method: 'post',
      params:{},
      data:{}
    }
    opt.data.username = data.username;
    opt.data.password = data.password;
    opt.data.role = data.role;
    opt.data.identity = data.identity;

    return http<responseData>(opt)
  }
  

// 获取用户列表
export function getUserList(): Promise<responseData> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/user/list`,
    method: 'get',
    params:{},
    data:{}
  }
  return http<responseData>(opt)
}


// 注销用户
export function revokeUser(data: { user_name: any[] }): Promise<responseData> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/user/revoke`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data.user_name = data.user_name;
  return http<responseData>(opt)
}
