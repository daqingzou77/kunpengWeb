import { request as http } from '@/utils/requestCloud';
import { AxiosRequestConfig } from 'axios';

interface respType {
  code?: string,
  msg?: string,
  data?: []
}
export function checkInfo(data: { hash: string }): Promise<respType> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/trace/verify`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data.hash = data.hash;
  return http<respType>(opt)
}

export function picCheck(data: {date: string, hash: string, point: string }): Promise<respType> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/trace/check`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data.date = data.date;
  opt.data.hash = data.hash;
  opt.data.point = data.point;
  return http<respType>(opt)
}
