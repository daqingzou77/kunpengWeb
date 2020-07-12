import { Col, Row, DatePicker, Button } from 'antd';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType } from './model';
import Columnar from './components/ChartCustom/Columnar';
import Polyline from './components/ChartCustom/Polyline';
import WindDirection from './components/ChartCustom/WindDirection';
import { getSensors } from './service';

const { RangePicker } = DatePicker

interface MonitorProps {
  dashboardAndmonitor: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}

class Monitor extends Component<MonitorProps> {
  componentDidMount() {
    // this.getData();
  }

  getData = async () => {
    const data = {
      sensor_type: 'mqtt',
      sensor_id: '19372180',
      start: '2020-07-07 05:17:12',
      stop: '2020-07-08 15:33:26'
    }
    // const resp = await getSensors(data);
    console.log(resp);
  }

  render() {
    const { dashboardAndmonitor, loading } = this.props;
    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <RangePicker
          style={{ maxWidth: 440, width: '100%', marginRight: 10 }}
          size="large"
          showTime
          format="YYYY/MM/DD HH:mm:ss"
          placeholder={["起始时间", "截止时间"]}
        // onChange={time => this.handleRangerPicker(time)}
        />
        <Button type="primary" style={{ width: 100, height: 40 }}>分析</Button>
      </div>
    );

    return (
      <PageHeaderWrapper
        title="数据分析"
        content={mainSearch}
      >
        <GridContent>
          <React.Fragment>
            <Row gutter={24}>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}
                style={{
                  marginBottom: 24,
                }}
              >
                <Columnar title="空气湿度" />
              </Col>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                 <Polyline title="光照强度" />
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}
                style={{
                  marginBottom: 24,
                }}
              >
                <Polyline title="光照强度" />
              </Col>

              <Col xl={12} lg={24} md={24} sm={24} xs={24}
                style={{
                  marginBottom: 24,
                }}
              >
                <Polyline title="降雨量" />
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xl={8} lg={24} md={24} sm={24} xs={24}
                style={{
                  marginBottom: 24,
                }}
              >
                <Polyline title="空气温度" />
              </Col>
              <Col xl={8} lg={24} md={24} sm={24} xs={24}
                style={{
                  marginBottom: 24,
                }}
              >
                <WindDirection title="风向" />
              </Col>
              <Col xl={8} lg={24} md={24} sm={24} xs={24}
                style={{
                  marginBottom: 24,
                }}
              >
                <Columnar title="风速" />
              </Col>
            </Row>
          </React.Fragment>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    dashboardAndmonitor,
    loading,
  }: {
    dashboardAndmonitor: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    dashboardAndmonitor,
    loading: loading.models.dashboardAndmonitor,
  }),
)(Monitor);
