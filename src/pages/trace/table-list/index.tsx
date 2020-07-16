import React, { Dispatch } from 'react';
import { RouteChildrenProps } from 'react-router';
import moment from 'moment';
import { connect } from 'dva';
import '@ant-design/compatible/assets/index.css';
import { Input, DatePicker, Tabs, Card, Table, Pagination, List, Typography, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TimelineChart from '../../welcome/components/Charts/TimelineChart';
import { StateType } from './model';
import {
  formDataTrace,
  picTrace,
  sensorTrace
} from './service';
import styles from './styles.less';



const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack',
];

const covers = [
  'http://img1.imgtn.bdimg.com/it/u=2100856578,582599785&fm=26&gp=0.jpg',
  'http://img3.imgtn.bdimg.com/it/u=2538903943,1614489590&fm=26&gp=0.jpg',
  'http://img2.imgtn.bdimg.com/it/u=4191322647,3205219533&fm=26&gp=0.jpg',
  'http://img2.imgtn.bdimg.com/it/u=975198133,2514065197&fm=26&gp=0.jpg'
];
const desc = [
  '8218f00d1ec732e871b3e4e93608ec297cbdebf0419c264f4a12ad2a1498f949',
  '2d751ce7858c6ff087098ac74c23231d39e57e00e884680266c27e105bb86230',
  'c4ffcb68acc7ce1be75274f57a155cea57152040cdf5b0aaff63b1234f19f145',
  '634201b27c888963e3fa3130861c0b2535f60c2c25fa6a3085d7c2cec074db2b',
  'a9a7cd577e8dfbe39001596a2c8cbb666a62cdaff499757504441b0ab789e5c5'
]


const list = [];
for (let i = 0; i < 2; i += 1) {
  list.push({
    id: `fake-list-${i}`,
    title: titles[i % 8],
    cover: parseInt(`${i / 4}`, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)],
    updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
    subDescription: desc[i % 5],
  });
}


const offlineChartData: { x: number; y1: number; y2: number; y3: number; y4: number; }[] = [];

for (let i = 0; i < 20; i += 1) {
  offlineChartData.push({
    x: new Date().getTime() + 1000 * 60 * 30 * i,
    y1: Math.floor(Math.random() * 100) + 10,
    y2: Math.floor(Math.random() * 100) + 10,
    y3: Math.floor(Math.random() * 100) + 10,
    y4: Math.floor(Math.random() * 100) + 10,
  });
}


// 随机生成64位的哈希字符串
const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const len = 64;
function randomHash() {
  let randStr = '';
  for (let i = 0; i < len; i += 1) {
    randStr += str.charAt(Math.floor(Math.random() * str.length));
  }
  return randStr;
}

const dataSource: any[] | undefined = [];
for (let i = 0; i < 33; i += 1) {
  dataSource.push({
    hash: randomHash(),
    time: moment(new Date().getTime() + 1000 * 60 * 30 * i).format('YYYY/MM/DD hh:mm:ss'),
    conductor: 'daqing',
    operation: '良好',
    description: `请注意！这是具体信息${i}`
  })
}

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
  },{
    title: '文件名',
    dataIndex: 'name',
    align: 'center'
  }, {
    title: '区块哈希',
    dataIndex: 'tx_id',
    align: 'center'
  }, {
    title: '时间戳',
    dataIndex: 'timestamp',
    align: 'center'
  },{
    title: '传感器类型',
    dataIndex: 'type',
    align: 'center'
  }]

  state = {
    startTime: '',
    endTime: '',
    loading: false,
    tabKey: '1',
    sensorData: [],
    picList: [],
    dataSource: []
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
      tabKey: val
    })
  }

  // 处理输入框
  handleInputChange = async val => {
    const { startTime, endTime, tabKey } = this.state;
    if (!startTime || !endTime) {
      message.warning('请选择时间');
      return;
    }
    if (!val) {
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
      point: val
    }
    if (tabKey === '1') {
      this.handleSensorTrace(params);
    } else if (tabKey === '2') {
      this.handlePicTrace(params);
    } else if (tabKey === '3') {
      this.handleFormDataTrace(params);
    }
  }

  // 农事数据溯源
  handleFormDataTrace = async data => {
    const resp = await formDataTrace(data);
    const dataArray: Array<any> = [];
    if (resp.msg === 'ok') {
      const parseData = JSON.parse(resp.data);
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
        loading: false,
        dataSource: dataArray
      })
    }
  }

  // 图片信息溯源
  handlePicTrace = async data => {
    const resp = await picTrace(data);
    const picListArray: Array<any> = [];
    if (resp.msg === 'ok') {
      const parseData = JSON.parse(resp.data);
      parseData.map(item => {
        const { k, t, v } = item;
        const timestamp = k.split('~')[2].substring(0, 13);
        const tx_id = t;
        picListArray.push({
          timestamp,
          tx_id,
          ...v
        })
        this.setState({
          picList: picListArray
        })
      })
      this.setState({
        loading: false,
      })
    }
  }

  // 传感器数据溯源 
  handleSensorTrace = async data => {
    const resp = await sensorTrace(data);
    const sensorArray: Array<any> = [];
    if (resp.msg === 'ok') {
      const parseData = JSON.parse(resp.data);
      parseData.map(item => {
        const { k, t, v } = item;
        const timestamp = k.split('~')[2].substring(0, 13);
        const tx_id = t;
        sensorArray.push({
          timestamp,
          tx_id,
          ...v
        })
        this.setState({
          sensorData: sensorArray
        })
      })
      this.setState({
        loading: false
      })
    }
  }

  render() {
    const { loading, tabKey, sensorData, dataSource, picList } = this.state;
    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <RangePicker
          style={{ maxWidth: 440, width: '100%', marginRight: 10 }}
          size="large"
          showTime
          format="YYYY/MM/DD HH:mm:ss"
          onChange={time => this.handleRangerPicker(time)}
        />
        <Input.Search
          placeholder={tabKey === '3' ? '请输入上传用户名' : '请输入采集点'}
          loading={loading}
          enterButton="搜索"
          size="large"
          onSearch={val => this.handleInputChange(val)}
          style={{ maxWidth: 322, width: '100%' }}
        />
      </div>
    );

    const cardList = (
      <List
        rowKey="id"
        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
        dataSource={picList}
        renderItem={(item, index) => (
          <List.Item>
            <Card
              className={styles.card}
              hoverable
              cover={<img alt='采集图片' src={require(`../../../../public/images/pic${(index % 3) + 1}.jpg`)} height={124} width={207} />}
            >
              <Card.Meta
                title={<span>传感器类型：{item.type}</span>}
                description={
                  <>
                    <Typography.Text copyable ellipsis>图片哈希：{item.name}</Typography.Text>
                    <Typography.Text copyable ellipsis>区块存证哈希：{item.tx_id}</Typography.Text>
                    <Typography.Text>采集点：{item.point}</Typography.Text>
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
        title='冬枣信息溯源'
        content={mainSearch}
      >
        <Card>
          <Tabs defaultActiveKey={tabKey} onChange={this.handleChange}>
            {/* 传感器数据统计 */}
            <TabPane tab="传感器数据统计" key="1">
              <Table 
                columns={this.sensorCloumns}
                dataSource={sensorData}
              />
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
                  {/* <div style={{ textAlign: 'center' }}><Pagination defaultCurrent={1} total={50} /></div> */}
                </Card>
              </div>
            </TabPane>
            {/* 农事管理数据 */}
            <TabPane tab="农事管理数据" key="3">
              <Table
                expandedRowRender={record => <p><span style={{ fontWeight: 'bold' }}>详细信息：</span>{record.info}</p>}
                columns={this.columns}
                dataSource={dataSource}
              />
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

