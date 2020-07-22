import { request as http } from '@/utils/requestCloud';
import { AxiosRequestConfig } from 'axios';

interface respType {
  code?: string,
  msg?: string,
  data?: []
}

// 农事数据溯源
export function formDataTrace(data: { start_time: string, end_time: string, point: string, page_size: string, book_mark: string }): Promise<respType>{
  const opt: AxiosRequestConfig = {
    url:`/api/v1/trace/farmData`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data = {
    star_time: data.start_time,
    end_time: data.end_time,
    user: data.point,
    book_mark: data.book_mark,
    page_size: data.page_size
  }
  return http<respType>(opt)
}

// 图片信息溯源
export function picTrace(data: { start_time: string, end_time: string, point: string, page_size: string, book_mark: string }): Promise<respType> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/trace/picture`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data = {
    star_time: data.start_time,
    end_time: data.end_time,
    point: data.point,
    book_mark: data.book_mark,
    page_size: data.page_size
  }
  return http<respType>(opt)
}

// 传感器溯源
export function sensorTrace(data: { start_time: string, end_time: string, point: string, page_size: string, book_mark: string }) : Promise<respType> {
  const opt: AxiosRequestConfig = {
    url:`/api/v1/trace/sensor`,
    method: 'post',
    params:{},
    data:{}
  }
  opt.data = {
    star_time: data.start_time,
    end_time: data.end_time,
    point: data.point,
    book_mark: data.book_mark,
    page_size: data.page_size
  }
  return http<respType>(opt)
}

// 条件查询所有采集点信息
export function getPoints(data: {number: number}): Promise<respType> {
  const opt: AxiosRequestConfig={
    url:`/api/v1/bcs/points/${data.number}`,
    method: 'get',
    params:{},
    data:{}
  }

  return http<respType>(opt)
}