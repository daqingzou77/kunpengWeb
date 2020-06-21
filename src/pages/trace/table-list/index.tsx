import React, { Dispatch } from 'react';
import moment from 'moment';
import '@ant-design/compatible/assets/index.css';
import { Input, DatePicker, Tabs, Card, Table, Pagination, List, Typography, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TimelineChart from '../../welcome/components/Charts/TimelineChart';
import styles from './styles.less';
import { RouteChildrenProps } from 'react-router';
import { SensorData } from './data';
import { StateType } from './model';

import { connect } from 'dva';

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
for (let i = 0; i < 8; i += 1) {
  list.push({
    id: `fake-list-${i}`,
    title: titles[i % 8],
    cover: parseInt(`${i / 4}`, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)],
    updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
    subDescription: desc[i % 5],
  });
}

//  模拟图片数据来源
const cardList = (
  <List
    rowKey="id"
    grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
    dataSource={list}
    renderItem={(item, index) => (
      <List.Item>
        <Card
          className={styles.card}
          hoverable
          cover={<img alt={item.title} src={require(`../../../../public/images/pic${(index % 3) + 1}.jpg`)} height={124} width={207} />}
        >
          <Card.Meta
            title='存证哈希'
            description={
              <Typography.Text copyable ellipsis>{item.subDescription}</Typography.Text>
            }
          />
          <div className={styles.cardItemContent}>
            <span>图片时刻：{moment(item.updatedAt).format('YYYY/MM/DD hh:mm:ss')}</span>
          </div>
        </Card>
      </List.Item>
    )}
  />
)


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
      title: '哈希值',
      dataIndex: 'hash',
      align: 'center'
    },
    {
      title: '时间',
      dataIndex: 'time',
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      align: 'center'
    },
    {
      title: '操作人',
      dataIndex: 'conductor',
      align: 'center'
    },
    {
      title: '操作行为',
      dataIndex: 'operation',
      align: 'center'
    },
  ]

   state = {
     startTime: '',
     endTime: '',
   }

  componentDidMount() {

  }

  //  处理日期组件变化
  handleRangerPicker = time => {
     if (time !== undefined) {
      this.setState({
        startTime: time[0],
        endTime: time[1]
      })
     }
  }

  // 处理输入框
  handleInputChange = val => {
    const { dispatch } = this.props;
    const { startTime, endTime } = this.state; 
    if (!startTime || !endTime) {
      message.warning('请选择时间');
      return;
    }
    if (!val) {
      message.warning('请输入园林采集点');
      return;
    }
    const params = {
      startTime,
      endTime,
      collecetPoint: val
    }
    dispatch({
      type: 'trace/queryByConditions',
      payload: params
    })
  }


  render() {

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
          placeholder="请输入园林采集点"
          enterButton="搜索"
          size="large"
          onSearch={val => this.handleInputChange(val)}
          style={{ maxWidth: 322, width: '100%' }}
        />
      </div>
    );


    return (
      <PageHeaderWrapper
        title='冬枣信息溯源'
        content={mainSearch}
      >
        <Card>
          <Tabs defaultActiveKey="1" onChange={() => { }}>
            {/* 传感器数据统计 */}
            <TabPane tab="传感器数据统计" key="1">
              <TimelineChart
                height={400}
                data={offlineChartData}
                titleMap={{
                  y1: '传感器1',
                  y2: '传感器2',
                  y3: '传感器3',
                  y4: '传感器4'
                }}
              />
            </TabPane>
            {/* 实时采集图片 */}
            <TabPane tab="实时采集图片" key="2">
              <div className={styles.coverCardList}>
                <Card
                  bordered={false}
                >
                  <div className={styles.cardList}>{cardList}</div>
                  <div style={{ textAlign: 'center' }}><Pagination defaultCurrent={1} total={50} /></div>
                </Card>
              </div>
            </TabPane>
            {/* 农事管理数据 */}
            <TabPane tab="农事管理数据" key="3">
              <Table
                expandedRowRender={record => <p><span style={{ fontWeight: 'bold' }}>详细信息：</span>{record.description}</p>}
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

