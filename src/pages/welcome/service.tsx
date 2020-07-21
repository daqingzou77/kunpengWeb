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

// 查询所有节点信息
export function queryPeers(): Promise<responseData> {
  const opt: AxiosRequestConfig={
    url:`/api/v1/bcs/peers`,
    method: 'get',
    params:{},
    data:{}
  }
  return http<responseData>(opt)
}

// 条件查询所有采集点信息
export function getPoints(data: {number: number}): Promise<responseData> {
  const opt: AxiosRequestConfig={
    url:`/api/v1/bcs/points/${data.number}`,
    method: 'get',
    params:{},
    data:{}
  }

  return http<responseData>(opt)
}

// 条件查询交易数
export function getTransByOpt(data: { type: number}): Promise<responseData> {
  const opt: AxiosRequestConfig={
    url:`/api/v1/bcs/transactions`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data.type = data.type;
  return http<responseData>(opt)
}