
import { request as http} from '@/utils/requestCloud';
import { AxiosRequestConfig } from 'axios';

export const getSensors = (data: {sensor_type: string, sensor_id: string, start: string, stop: string  }) => {
  const opt: AxiosRequestConfig={
    url:`/api/data/std/${data.sensor_type}/${data.sensor_id}`,
    method: 'get',
    params:{},
    data:{}
  }
    
  opt.params.start = data.start;
  opt.params.stop = data.stop;
    
  return http<any>(opt)
}