import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import {  SensorData, realTimePics, culturalData } from './data.d';

import { getSensorData, getRealTimePics, getAgriculturalData, getGardenData } from './service';

export interface StateType {
  charts: SensorData[],
  realpics: realTimePics[],
  culturalData: culturalData[]
  responseData: []
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;



export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    fetchPics: Effect,
    fetchTable: Effect,
    queryByConditions: Effect,
    
  };
  reducers: {
    save: Reducer<StateType>;
    savePics: Reducer<StateType>,
    saveTables: Reducer<StateType>,
    saveGardenData: Reducer<StateType>
  };
}

const Model: ModelType = {
  namespace: 'trace',

  state: {
    charts: [],
    realpics: [],
    culturalData: [],
    responseData: []
  },

  effects: {
    // 获取传感器数据
    *fetch(_, { call, put }) {
      const response = yield call(getSensorData);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    // 获取图片信息
    *fetchPics(_, { call, put }) {
      const response = yield call(getRealTimePics);
      yield put({
        type: 'savePics',
        payload: response.data,
      });
    },

    // 获取表格数据
    *fetchTable(_, { call, put}) {
      const response = yield call(getAgriculturalData)
      yield put({
        type: 'saveTables',
        payload: response.data,
      });
    },

    // 条件查询
    *queryByConditions({ payload }, { call, put }) {
      const response = yield call(getGardenData, payload)
      yield put({
        type: 'saveGardenData',
        payload: response.data
      })
    }
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        charts: payload.data,
      };
    },

    savePics(state, { payload }) {
      return {
        ...state,
        realpics: payload,
      };
    },

    saveTables(state, { payload }) {
      return {
        ...state,
        culturalData: payload,
      };
    },
     
    saveGardenData(state, { payload }) {
      return {
        ...state,
        responseData: payload
      }
    }

  },
};

export default Model;
