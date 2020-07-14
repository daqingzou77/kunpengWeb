import { request as http} from '@/utils/requestCloud';
import { AxiosRequestConfig } from 'axios';

interface respType  {
  code?: string,
  msg?: string,
  data?: []
}

export function uploadRecord(data: {oper_name: string, oper_type:string, info: string, start_time: string, end_time: string  }): Promise<respType>  {
  const opt: AxiosRequestConfig={
    url:`/api/v1/user/record`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data = {
    oper_name: data.oper_name,
    oper_type: data.oper_type,
    info: data.info,
    start_time: data.start_time,
    end_time: data.end_time
  }
  return http<respType>(opt)
}