import { DatePickerMode } from "antd/lib/date-picker/interface";

export interface TableListItem {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  title: string;
  owner: string;
  desc: string;
  callNo: number;
  status: number;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter?: string;
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
}

export interface OfflineChartData {
  x: any;
  y1: number;
  y2: number;
}

/**
 *  新增请求参数
 * 
 */
export interface requestParam {
  startTime: Date,
  endTime: Date,
  collecetPoint: String
}

export interface SensorData {
  x: any;
  y1: number;
  y2: number;
  y3: number;
  y4: number;
}

export interface realTimePics {
  id: string,
  title: string,
  cover: string,
  updatedAt: number,
  subDescription: string,
}

export interface culturalData {
  hash: string,
  time: moment,
  conductor: string,
  operation: string,
  description: string
}

export interface StateType {
  charts: SensorData[],
  realpics: realTimePics[],
  culturalData: culturalData[]
}