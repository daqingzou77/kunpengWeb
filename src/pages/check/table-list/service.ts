import { request as http } from '@/utils/requestCloud';
import { AxiosRequestConfig } from 'axios';

interface respType {
  code?: string,
  msg?: string,
  data?: []
}

export function checkInfo(data: {}): Promise<respType> {
  const opt: AxiosRequestConfig = {
    url:`/api/`,
    method: 'get',
    params:{},
    data:{}
  }
  
  return http<respType>
}