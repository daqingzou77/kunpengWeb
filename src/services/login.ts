import { request as http} from '@/utils/requestCloud';
import { AxiosRequestConfig } from 'axios';

export interface LoginParamsType {
  username: string;
  password: string;
  identity?: string;
}

export interface responseData {
  msg?: string;
  code?: number;
  data?: any;
}

// 用户登录
export function userLogin(data: LoginParamsType): Promise<responseData> {
  const opt: AxiosRequestConfig={
    url:`/api/v1/user/login`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data = {
    user_name: data.username,
    password: data.password
  };
  return http<responseData>(opt)
}

// 用户注册
export function userRigester(data: LoginParamsType): Promise<responseData> {
  const opt: AxiosRequestConfig={
    url:`/api/v1/user/register`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data = data;
  return http<responseData>(opt)
}

// 用户登出
export function userLogout(): Promise<responseData> {
  const opt: AxiosRequestConfig={
    url:`/api/v1/user/logout`,
    method: 'post',
  }
  return http<responseData>(opt)
}

// 获取用户头像
export function getAvatar(): Promise<responseData> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/user/getHeader`,
    method: 'get',
    params:{},
    data:{}
  }
  return http<responseData>(opt)
}

// 修改用户密码
export function updateUserPwd(data: { new_password: string, old_password: string }): Promise<responseData> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/user/password`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data.new_password = data.new_password;
  opt.data.old_password = data.old_password;
  return http<responseData>(opt)
}