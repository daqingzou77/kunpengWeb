import { request as http } from '@/utils/requestCloud';
import { AxiosRequestConfig } from 'axios';

interface respType {
  code?: string,
  msg?: string,
  data?: []
}

// 农事数据溯源
export function formDataTrace(data: { start_time: string, end_time: string, point: string }): Promise<respType>{
  const opt: AxiosRequestConfig = {
    url:`/api/v1/trace/farmData`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data = {
    star_time: data.start_time,
    end_time: data.end_time,
    point: data.point
  }
  return http<respType>(opt)
}

// 图片信息溯源
export function picTrace(data: { start_time: string, end_time: string, point: string }): Promise<respType> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/trace/picture`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data = {
    star_time: data.start_time,
    end_time: data.end_time,
    point: data.point
  }
  return http<respType>(opt)
}

// 传感器溯源
export function sensorTrace(data: { start_time: string, end_time: string, point: string }) : Promise<respType> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/trace/sensor`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data = {
    star_time: data.start_time,
    end_time: data.end_time,
    point: data.point
  }
  return http<respType>(opt)
}