/* eslint-disable default-case */
import React, { Component, Suspense } from 'react';
import { Card, Table, Badge } from 'antd';
import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
// eslint-disable-next-line import/no-unresolved
import { AnalysisData, BlockInfo } from './data';
import { blockInfo, getTransByOpt, queryPeers } from './service';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));

interface AnalysisProps {
  dashboardAndanalysis: AnalysisData;
  dispatch: Dispatch<any>;
  loading: boolean;
}

interface AnalysisState {
  data: [],
  types: 'today' | 'week' | 'month' | 'year',
  dataSource: []
}

class Analysis extends Component<AnalysisProps, AnalysisState> {

  columns = [{
    title: '节点',
    render: (_, record, index) => {
      return `节点${index + 1}`
    }
  }, {
    title: '组织名称',
    dataIndex: 'msp_id',
    align: 'center',
  }, {
    title: '节点地址',
    dataIndex: 'peerAddr',
    align: 'center',
  }, {
    title: '节点状态',
    render: () => <Badge status="success" text="正常运行" />
  }];

  state: AnalysisState = {
    data: [],
    types: 'today',
    dataSource: []
  };

  reqRef: number = 0;

  timeoutId: number = 0;

  blocks: BlockInfo = {};

  componentDidMount() {
    const { types } = this.state;
    this.getInfo(types);
    this.getBlockInfo();
    this.getPeers();
  }

  getBlockInfo = async () => {
    const resp = await blockInfo();
    if (resp.msg === 'ok') {
      this.blocks = resp.data;
    }
  }

  getPeers = async () => {
    const resp = await queryPeers();
    const data :Array<any> = [];
    const mockAddr = ['grpcs://124.71.108.86:30605', 'grpcs://124.71.108.86:30606', 'grpcs://139.159.214.218:7051', 'grpcs://1.71.143.57:7051']
    if (resp.msg === 'ok') {
      resp.data.map((item: any, index: number) => {
        const datas = JSON.parse(item);
        datas.peerAddr = mockAddr[index];
        data.push(datas)
      })
      this.setState({
        dataSource: data
      })
    }
  }

  selectDate = async (type: 'today' | 'week' | 'month' | 'year') => {
    this.getInfo(type)
  };

  getInfo = async (type: string) => {
    let types
    switch (type) {
      case 'today': types = 1; break;
      case 'week': types = 2; break;
      case 'month': types = 3; break;
      case 'year': types = 4; break;
      default: types = 1;
    }
    const resp = await getTransByOpt({ type: types });
    if (resp.msg === 'ok') {
      this.setState({
        data: resp.data,
        types: type
      })
    }
  }

  render() {
    const { data, types, dataSource } = this.state;
    const { loading } = this.props;

    return (
      <GridContent>
        <React.Fragment>
          {/* Suspense进行lazy组件的包裹 */}
          <Suspense fallback={<PageLoading />}>
            <IntroduceRow loading={loading} blockInfo={this.blocks} />
          </Suspense>

          {/* 折线统计 */}
          <Suspense fallback={null}>
            <SalesCard
              loading={loading}
              selectDate={this.selectDate}
              data={data}
              types={types}
            />
          </Suspense>
          
          {/* 节点信息 */}
          <Card style={{ marginTop: 25 }}>
            <Table
              columns={this.columns}
              pagination={false}
              dataSource={dataSource}
            ></Table>
          </Card>
          {/* 节点信息 */}
        </React.Fragment>
      </GridContent>
    );
  }
}

export default connect(
  ({
    dashboardAndanalysis,
    loading,
  }: {
    dashboardAndanalysis: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    dashboardAndanalysis,
    loading: loading.effects['dashboardAndanalysis/fetch'],
  }),
)(Analysis);
