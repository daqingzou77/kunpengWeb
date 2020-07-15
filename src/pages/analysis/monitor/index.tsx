import { Col, Row, DatePicker, Button, Empty } from 'antd';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import Columnar from './components/ChartCustom/Columnar';
import Polyline from './components/ChartCustom/Polyline';
import WindDirection from './components/ChartCustom/WindDirection';
import { getSensors } from './service';
import styles from './style.less';

const { RangePicker } = DatePicker

interface MonitorProps {
  dashboardAndmonitor: StateType;
  dispatch: Dispatch<any>;
}


function convert(dataArray: []) {
  let airHumidityList = [], airPressureList = [], illuminanceList = [], rainfallList = [], airTemperatureList = [], windDirectionList = [], windSpeedList = [];
  dataArray.map(item => {
    const { airHumidity, airPressure, illuminance, rainfall, airTemperature, windDirection, windSpeed } = item;
    const collectTime = moment(item.collectTime).format('hh:mm:ss');
    airHumidityList.push({ collectTime, airHumidity });
    airPressureList.push({ collectTime, airPressure });
    illuminanceList.push({ collectTime, illuminance });
    rainfallList.push({ collectTime, rainfall });
    airTemperatureList.push({ collectTime, airTemperature });
    windDirectionList.push({ collectTime, windDirection });
    windSpeedList.push({ collectTime, windSpeed })
  })
  return {
    airHumidityList,
    airPressureList,
    illuminanceList,
    rainfallList,
    airTemperatureList,
    windDirectionList,
    windSpeedList
  };
}

function divideTime(array: any) {
  if (Object.prototype.toString.call(array) !== '[object Array]') return {};

  if (array.length < 1) return {};

  if (array.lentgth < 10) {
    return convert(array)
  }

  const len = array.length;
  const spare = (len - 10) % 2 === 0 ? (len - 10) / 2 : Math.floor((len - 10) / 2);
  const newArray = array.slice(spare, spare + 10);
  return convert(newArray);
}

class Monitor extends Component<{}> {

  state = {
    airHumidityList: [],
    airPressureList: [],
    illuminanceList: [],
    rainfallList: [],
    airTemperatureList: [],
    windDirectionList: [],
    windSpeedList: [],
    loading: false,
    start: '',
    stop: '',
    showEmpty: true,
  }

  handleRangerPicker = time => {
    if (Array.isArray(time)) {
      this.setState({
        start: moment(time[0]).format('YYYY-MM-DD hh:mm:ss'),
        stop: moment(time[1]).format('YYYY-MM-DD hh:mm:ss')
      })
    }
  }

  handleAnalysis = () => {
    const { start, stop } = this.state;
    const data = {
      sensor_type: 'mqtt',
      sensor_id: '19372180',
      start,
      stop
    }
    this.setState({
      loading: true
    })
    setTimeout(async () => {
      const resp = await getSensors(data);
      if (Object.prototype.toString.call(resp) === '[object Array]' && resp.length > 0) {
        const newData = divideTime(resp);
        const { airHumidityList, airPressureList, illuminanceList, rainfallList, airTemperatureList, windDirectionList, windSpeedList } = newData;
        this.setState({
          airHumidityList,
          airPressureList,
          illuminanceList,
          rainfallList,
          airTemperatureList,
          windDirectionList,
          windSpeedList,
          showEmpty: false
        })
      }
      this.setState({
        loading: false
      })
    }, 1000)


  }

  render() {
    const { airHumidityList, airPressureList, illuminanceList, rainfallList, airTemperatureList, windDirectionList, windSpeedList, loading, showEmpty } = this.state;
    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <RangePicker
          style={{ maxWidth: 440, width: '100%', marginRight: 10 }}
          size="large"
          showTime
          format="YYYY/MM/DD HH:mm:ss"
          placeholder={["起始时间", "截止时间"]}
          onChange={time => this.handleRangerPicker(time)}
        />
        <Button type="primary" style={{ width: 100, height: 40 }} loading={loading} onClick={this.handleAnalysis}>分析</Button>
      </div>
    );

    return (
      <PageHeaderWrapper
        title="数据分析"
        content={mainSearch}
      >
        <GridContent>
          {
            showEmpty ? (
              <div className={styles.empty}>
                <Empty description="暂无数据" style={{ minHeight: 400, background: 'white' }} />
              </div>
            ) : (
                <React.Fragment>

                  <Row gutter={24}>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24}
                      style={{
                        marginBottom: 24,
                      }}
                    >
                      <Columnar title="空气湿度" xAxias="collectTime" yAxias="airHumidity" data={airHumidityList} />
                    </Col>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                      <Polyline title="大气压强" xAxias="collectTime" yAxias="airPressure" data={airPressureList} />
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24}
                      style={{
                        marginBottom: 24,
                      }}
                    >
                      <Polyline title="光照强度" xAxias="collectTime" yAxias="illuminance" data={illuminanceList} />
                    </Col>

                    <Col xl={12} lg={24} md={24} sm={24} xs={24}
                      style={{
                        marginBottom: 24,
                      }}
                    >
                      <Polyline title="降雨量" xAxias="collectTime" yAxias="rainfall" data={rainfallList} />
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col xl={8} lg={24} md={24} sm={24} xs={24}
                      style={{
                        marginBottom: 24,
                      }}
                    >
                      <Polyline title="空气温度" xAxias="collectTime" yAxias="airTemperature" data={airTemperatureList} />
                    </Col>
                    <Col xl={8} lg={24} md={24} sm={24} xs={24}
                      style={{
                        marginBottom: 24,
                      }}
                    >
                      <WindDirection title="风向" xAxias="collectTime" yAxias="windDirection" data={windDirectionList} />
                    </Col>
                    <Col xl={8} lg={24} md={24} sm={24} xs={24}
                      style={{
                        marginBottom: 24,
                      }}
                    >
                      <Columnar title="风速" xAxias="collectTime" yAxias="windSpeed" data={windSpeedList} />
                    </Col>
                  </Row>
                </React.Fragment>
              )
          }
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default Monitor;