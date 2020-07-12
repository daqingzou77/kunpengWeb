import { request as http} from '@/utils/requestCloud';
import { AxiosRequestConfig } from 'axios';

export interface responseData {
  msg?: string;
  code?: number;
  data?: any;
}

// 获取区块高度、信息数量、总交易量、活跃节点
export function blockInfo(): Promise<responseData> {
  const opt: AxiosRequestConfig={
    url:`/api/v1/bcs/info`,
    method: 'get',
    params:{},
    data:{}
  }
  return http<responseData>(opt)
}