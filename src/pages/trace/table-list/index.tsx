import React, { Dispatch } from 'react';
import { RouteChildrenProps } from 'react-router';
import moment from 'moment';
import { connect } from 'dva';
import '@ant-design/compatible/assets/index.css';
import { Input, DatePicker, Tabs, Card, Table, Icon, List, Typography, message, Button, Select } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TimelineChart from '../../welcome/components/Charts/TimelineChart';
import Pagination from './components/Pagination';
import { StateType } from './model';
import {
  formDataTrace,
  picTrace,
  sensorTrace,
  getPoints
} from './service';
import styles from './styles.less';

const { Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;

//  定义接口
interface CenterProps extends RouteChildrenProps {
  dispatch: Dispatch<any>;
  trace: StateType;
}

class Trace extends React.PureComponent<CenterProps> {

  columns = [
    {
      title: '操作名称',
      dataIndex: 'oper_name',
      align: 'center'
    },
    {
      title: '哈希值',
      dataIndex: 'tx_id',
      align: 'center'
    },
    {
      title: '操作时间',
      dataIndex: 'time',
      render: (_, record) => {
        return `${moment(Number(record.start_time)).format('YYYY-MM-DD hh:mm:ss')}-${moment(Number(record.end_time)).format('YYYY-MM-DD hh:mm:ss')}`
      },
      align: 'center'
    },
    {
      title: '操作人',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '操作行为',
      dataIndex: 'oper_type',
      align: 'center'
    },
  ];

  sensorCloumns = [{
    title: '采集点',
    dataIndex: 'point',
    align: 'center'
  }, {
    title: '传感器类型',
    dataIndex: 'type',
    align: 'center'
  }, {
    title: '传感器数值',
    dataIndex: 'value',
    align: 'center'
  }, {
    title: '单位',
    dataIndex: 'unit',
    align: 'center'
  }, {
    title: '交易哈希',
    dataIndex: 'tx_id',
    align: 'center'
  }, {
    title: '时间戳',
    dataIndex: 'timestamp',
    align: 'center'
  }]

  state = {
    startTime: '',
    endTime: '',
    loading: false,
    tabKey: '1',
    value: undefined,
    sensorData: [],
    picList: [],
    dataSource: [],
    pageSize: '10',
    senBook_mark: '',
    nextBook: '',
    firstBook: '',
    preBookArray: [],
    selectPonitData: [],
  }

  componentDidMount() {
    // this.getPointsData();
  }

  getPointsData = async () => {
    const resp = await getPoints({ number: 10 });
    if (resp.msg === 'ok') {
      const dataArray = []
      resp.data.map(item => {
        dataArray.push(item);
      })
      this.setState({
        selectPonitData: dataArray
      })
    }
  }

  handleFresh = () => {
    this.setState({
      sensorData: [],
      picList: [],
      dataSource: [],
      tabKey: '1',
      nextBook: '',
      firstBook: '',
      preBookArray: [],
      value: undefined
    })
  }

  //  处理日期组件变化
  handleRangerPicker = (time: any) => {
    if (time !== undefined) {
      this.setState({
        startTime: time[0],
        endTime: time[1]
      })
    }
  }

  // 处理tab
  handleChange = (val: any) => {
    this.setState({
      tabKey: val,
      value: undefined,
      loading: false,
      firstBook: '',
      preBookArray: [],
      nextBook: '',
      sensorData: [],
      picList: []
    })
  }

  // 处理输入框
  handleInputChange = () => {
    const { startTime, endTime, tabKey, pageSize, value } = this.state;
    if (!startTime || !endTime) {
      message.warning('请选择时间');
      return;
    }
    if (!value) {
      if (tabKey === '3') {
        message.warning('请输入上传数据的用户名');
      } else {
        message.warning('请输入采集点');
      }
      return;
    }
    this.setState({
      loading: true
    })
    const params = {
      start_time: moment(startTime).valueOf().toString(),
      end_time: moment(endTime).valueOf().toString(),
      point: value,
      page_size: pageSize,
      book_mark: ''
    }
    if (tabKey === '1') {
      params.book_mark = `s~${value}~${moment(startTime).valueOf().toString()}`
      this.handleSensorTrace(params);
    } else if (tabKey === '2') {
      params.page_size = '8'; // 显示8条数据
      params.book_mark = `p~${value}~${moment(startTime).valueOf().toString()}`
      this.handlePicTrace(params);
    } else if (tabKey === '3') {
      params.book_mark = `f~${value}~${moment(startTime).valueOf().toString()}`
      this.handleFormDataTrace(params);
    }
  }

  handleValueChange  = e => {
    this.setState({
      value: e.target.value
    })
  }

  handleChangeValue = value => {
    this.setState({
      value
    })
  }

  // 农事数据溯源
  handleFormDataTrace = async data => {
    const { preBookArray } = this.state;
    const resp = await formDataTrace(data);
    const dataArray: Array<any> = [];
    if (resp.msg === 'ok') {
      const parseData = JSON.parse(resp.data).data;
      const nextBook = JSON.parse(resp.data).page.book_mark;
      if (parseData.length > 0) {
        parseData.map(item => {
          const { k, t, v } = item;
          const name = k.split('~')[1];
          const tx_id = t;
          dataArray.push({
            name,
            tx_id,
            ...v
          })
        });
      } else {
        message.info('溯源数据为空，请重新尝试')
      }
      preBookArray.splice(0, preBookArray.length);
      preBookArray.push(data.book_mark);
      this.setState({
        loading: false,
        dataSource: dataArray,
        firstBook: data.book_mark,
        preBookArray,
        nextBook
      })
    }
  }

  // 图片信息溯源
  handlePicTrace = async data => {
    const { preBookArray } = this.state;
    const resp = await picTrace(data);
    const picListArray: Array<any> = [];
    if (resp.msg === 'ok') {
      const parseData = JSON.parse(resp.data).data;
      const nextBook = JSON.parse(resp.data).page.book_mark;
      if (parseData.length > 0) {
        parseData.map(item => {
          const { k, t, v } = item;
          const timestamp = k.split('~')[2].substring(0, 13);
          const tx_id = t;
          picListArray.push({
            timestamp,
            tx_id,
            ...v
          })
        });
      } else {
        message.info('溯源数据为空，请重新尝试');
      }
      preBookArray.splice(0, preBookArray.length);
      preBookArray.push(data.book_mark);
      this.setState({
        picList: picListArray,
        loading: false,
        firstBook: data.book_mark,
        nextBook,
        preBookArray,
      })
    }
  }

  // 传感器数据溯源 
  handleSensorTrace = async data => {
    const { preBookArray } = this.state;
    const resp = await sensorTrace(data);
    const sensorArray: Array<any> = [];
    if (resp.msg === 'ok') {
      const nextBook = JSON.parse(resp.data).page.book_mark;
      const parseData = JSON.parse(resp.data).data;
      if (parseData.length > 0) {
        parseData.map(item => {
          const { k, t, v } = item;
          const timestamp = moment(new Date(Number(k.split('~')[2].substring(0, 13)))).format('YYYY-MM-DD hh:mm:ss');
          const tx_id = t;
          sensorArray.push({
            timestamp,
            tx_id,
            ...v
          })
        });
      } else {
        message.info('溯源数据返回为空，请重新尝试')
      }
      preBookArray.splice(0, preBookArray.length);
      preBookArray.push(data.book_mark);
      this.setState({
        sensorData: sensorArray,
        firstBook: data.book_mark,
        nextBook,
        preBookArray,
        loading: false
      })
    }
  }

  // 传感器翻页
  handleSensorPage = async (book_mark, type) => {
    const { startTime, endTime, value, pageSize, preBookArray } = this.state;
    const start_time = moment(startTime).valueOf().toString();
    const end_time = moment(endTime).valueOf().toString();
    const resp = await sensorTrace({ start_time, end_time, point: value, book_mark, page_size: pageSize });
    const sensorArray: Array<any> = [];
    if (resp.msg === 'ok') {
      const nextBook = JSON.parse(resp.data).page.book_mark;
      const parseData = JSON.parse(resp.data).data;
      if (type === 'up') {
        if (book_mark == preBookArray[0]) {
          preBookArray.splice(1, preBookArray.length);
        } else {
          preBookArray.pop();
        }
      }
      if (type == 'down') {
        preBookArray.push(book_mark);
      }
      parseData.map(item => {
        const { k, t, v } = item;
        const timestamp = moment(new Date(Number(k.split('~')[2].substring(0, 13)))).format('YYYY-MM-DD hh:mm:ss');
        const tx_id = t;
        sensorArray.push({
          timestamp,
          tx_id,
          ...v
        })
      })
      this.setState({
        sensorData: sensorArray,
        preBookArray,
        nextBook,
      })
    }
  }

  // 图片溯源翻页
  handlePicPage = async (book_mark, type) => {
    const { startTime, endTime, value, preBookArray } = this.state;
    const start_time = moment(startTime).valueOf().toString();
    const end_time = moment(endTime).valueOf().toString();
    const resp = await picTrace({ start_time, end_time, point: value, book_mark, page_size: '8' });
    const picListArray: Array<any> = [];
    if (resp.msg === 'ok') {
      const parseData = JSON.parse(resp.data).data;
      const nextBook = JSON.parse(resp.data).page.book_mark;
      if (type === 'up') {
        if (book_mark == preBookArray[0]) {
          preBookArray.splice(1, preBookArray.length);
        } else {
          preBookArray.pop();
        }
      }
      if (type == 'down') {
        preBookArray.push(book_mark);
      }
      parseData.map(item => {
        const { k, t, v } = item;
        const timestamp = k.split('~')[2].substring(0, 13);
        const tx_id = t;
        picListArray.push({
          timestamp,
          tx_id,
          ...v
        })
      })
      this.setState({
        picList: picListArray,
        preBookArray,
        nextBook
      })
    }
  }

  // 农事数据翻页
  handleFarmPage = async (book_mark, type) => {
    const { startTime, endTime, value, pageSize, preBookArray } = this.state;
    const start_time = moment(startTime).valueOf().toString();
    const end_time = moment(endTime).valueOf().toString();
    const resp = await formDataTrace({ start_time, end_time, point: value, book_mark, page_size: pageSize });
    const dataArray: Array<any> = [];
    if (resp.msg === 'ok') {
      const parseData = JSON.parse(resp.data).data;
      const nextBook = JSON.parse(resp.data).page.book_mark;
      if (type === 'up') {
        if (book_mark == preBookArray[0]) {
          preBookArray.splice(1, preBookArray.length);
        } else {
          preBookArray.pop();
        }
      }
      if (type == 'down') {
        preBookArray.push(book_mark);
      }
      parseData.map(item => {
        const { k, t, v } = item;
        const name = k.split('~')[1];
        const tx_id = t;
        dataArray.push({
          name,
          tx_id,
          ...v
        })
      })
      this.setState({
        dataSource: dataArray,
        preBookArray,
        nextBook
      })
    }
  }

  handleSearch = () => {
    this.getPointsData();
  }

  handleSelectChange = value => {
    this.setState({ searchValue: value });
  }

  render() {
    const { loading, tabKey, sensorData, dataSource, picList, value, firstBook, nextBook, preBookArray, selectPonitData, searchValue } = this.state;
    const options = selectPonitData.map(d => <Option key={d.point}>{d.point}</Option>);
    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <RangePicker
          style={{ maxWidth: 440, width: '100%', marginRight: 10 }}
          size="large"
          showTime
          placeholder={['起始时间', '截止时间']}
          format="YYYY/MM/DD HH:mm:ss"
          onChange={time => this.handleRangerPicker(time)}
        />
        {tabKey === '3' ? (
          <Input.Search
            placeholder={tabKey === '3' ? '请输入上传用户名' : '请输入采集点'}
            loading={loading}
            enterButton="搜索"
            size="large"
            onSearch={val => this.handleInputChange(val)}
            style={{ maxWidth: 322, width: '100%' }}
            onChange={e => this.handleValueChange(e)}
            value={value}
          />
        ) : (
            <>
              <Select
                className={styles.selectStyle}
                showSearch
                value={value}
                defaultActiveFirstOption={false}
                placeholder={"请输入采集点"}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch}
                style={{ maxWidth: 322, width: '100%' }}
                onChange={this.handleChangeValue}
                notFoundContent={null}
              >
                {options}
              </Select>
              <Button loading={loading} className={styles.search} onClick={this.handleInputChange} type="primary" style={{ height: 40, marginLeft: 10 }}>搜索</Button>
            </>
          )}


        <Button type="primary" style={{ height: 40, marginLeft: 10 }} onClick={this.handleFresh}>
          <Icon type="sync" />
        </Button>
      </div>
    );

    const cardList = (
      <List
        rowKey="id"
        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
        dataSource={picList}
        renderItem={item => (
          <List.Item>
            <Card
              className={styles.card}
              hoverable
              cover={<img alt='采集图片' src={`${item.point}/${moment(new Date(Number(item.timestamp))).format('YYYY-MM-DD')}/${item.name}.jpg`} height={124} width={207} />}
            >
              <Card.Meta
                title={<span>传感器类型：{item.type}</span>}
                description={
                  <>
                    <Paragraph>图片哈希：<Text ellipsis copyable>{item.name}</Text></Paragraph>
                    <Paragraph>区块存证哈希：<Text ellipsis copyable>{item.tx_id}</Text></Paragraph>
                    <Paragraph>采集点：<Text>{item.point}</Text></Paragraph>
                  </>
                }
              />
              <div className={styles.cardItemContent}>
                <span>图片时刻：{moment(new Date(Number(item.timestamp))).format('YYYY/MM/DD hh:mm:ss')}</span>
              </div>
            </Card>
          </List.Item>
        )}
      />
    )
    return (
      <PageHeaderWrapper
        title='农业物信息溯源'
        content={mainSearch}
      >
        <Card>
          <Tabs defaultActiveKey={tabKey} onChange={this.handleChange}>
            {/* 传感器数据统计 */}
            <TabPane tab="传感器数据统计" key="1">
              <Table
                rowKey="sensor"
                columns={this.sensorCloumns}
                dataSource={sensorData}
                pagination={false}
              />
              <div style={{ float: 'right', marginTop: 10 }}>
                <Pagination type="sensor" nextBook={nextBook} preBookArray={preBookArray} firstBook={firstBook} handleSensorPage={this.handleSensorPage} />
              </div>
              {/* <TimelineChart
                height={400}
                data={offlineChartData}
                titleMap={{
                  y1: '传感器1',
                  y2: '传感器2',
                  y3: '传感器3',
                  y4: '传感器4'
                }}
              /> */}
            </TabPane>
            {/* 实时采集图片 */}
            <TabPane tab="实时采集图片" key="2">
              <div className={styles.coverCardList}>
                <Card
                  bordered={false}
                >
                  <div className={styles.cardList}>{cardList}</div>
                </Card>
                {
                  picList.length > 0 ? (
                    <div style={{ textAlign: 'center' }}>
                      <Pagination type="pic" nextBook={nextBook} preBookArray={preBookArray} firstBook={firstBook} handlePicPage={this.handlePicPage} />
                    </div>
                  ) : null
                }
              </div>
            </TabPane>
            {/* 农事管理数据 */}
            <TabPane tab="农事管理数据" key="3">
              <Table
                rowKey="farm"
                expandedRowRender={record => <p><span style={{ fontWeight: 'bold' }}>详细信息：</span>{record.info}</p>}
                columns={this.columns}
                dataSource={dataSource}
                pagination={false}
              />
              <div style={{ float: 'right', marginTop: 10 }}>
                <Pagination type="farm" nextBook={nextBook} preBookArray={preBookArray} handleFarmPage={this.handleFarmPage} />
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    trace
  }: {
    trace: StateType;
  }) => ({
    trace
  })
)(Trace);

