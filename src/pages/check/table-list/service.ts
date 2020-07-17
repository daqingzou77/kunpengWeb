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

// 19372180/2020-07-08/84cd4138f7b37b46f05b43bd9a0663571dfeff7e10586d0f9bd4df385f23d972.jpg

export function backPic(data: {picUrl: string }): Promise<respType> {
  const opt: AxiosRequestConfig = {
    url:`/0018DE743E31/2020-07-13/${data.picUrl}.jpg`,
    method: 'get',
    params:{},
    data:{}
  }
  return http<respType>(opt)
}
