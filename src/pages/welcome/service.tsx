import request from '@/utils/request';
import { func } from 'prop-types';

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

// 获取区块高度、信息数量、总交易量、活跃节点
export async function getBlockInfo() {

}

// 获取信息数
export async function getInfomation() {
  
}

// 获取交易数
export async function getTransactions() {

}

