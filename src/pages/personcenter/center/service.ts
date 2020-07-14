import { request as http} from '@/utils/requestCloud';
import { AxiosRequestConfig } from 'axios';

export const uploadRecord = (data: {oper_name: string, info: string, start_time: string, end_time: string  }) => {
  const opt: AxiosRequestConfig={
    url:`/api/v1/user/record`,
    method: 'post',
    params:{
      oper_name: data.oper_name,
      info: data.info,
      start_time: data.start_time,
      end_time: data.end_time
    },
    data:{}
  }
  return http<any>(opt)
}