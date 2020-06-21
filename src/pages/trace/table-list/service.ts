import request from '@/utils/request';
import { TableListParams, requestParam } from './data.d';

export async function queryRule(params?: TableListParams) {
  return request('/api/rule', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}


export async function getChartData() {
  return request('/api/offlineChartData');
}


/**
 *  接口测试
 */

// 获取传感器数据
export async function getSensorData() {
  return  request('/api/getSensorData');;
}

// 获取实时图片
export async function getRealTimePics() {
  return request('/api/getRealTimePics');
}

// 获取农事管理数据
export async function getAgriculturalData() {
  return request('/api/getAgriculturalData');
}

// 条件查询园林数据
export async function getGardenData(params: requestParam) {
  console.log('params', params);
  return request('/api/getGardenData', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    }
  })
}
