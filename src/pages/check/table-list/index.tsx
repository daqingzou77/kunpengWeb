import React, { useEffect, useState } from 'react';
import { Form } from '@ant-design/compatible';
import moment from 'moment';
import '@ant-design/compatible/assets/index.css';
import { Input, Card, Icon, Typography } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  checkInfo
} from './service'
import { times } from 'lodash';

const { Paragraph, } = Typography;

const TableList: React.FC<TableListProps> = () => {

  const [loading, changeLoading] = useState<boolean>(false);
  const [data, changeData] = useState<any>({
    point: '',
    raw: '',
    timetamp: '',
    type: ''
  })

  const mainSearch = (
    <div style={{ textAlign: 'center' }}>
      <Input.Search
        placeholder="请输入需要校验的哈希值"
        enterButton="搜索"
        size="large"
        loading={loading}
        onSearch={val => handleOnSearch(val)}
        style={{ maxWidth: 400, width: '100%' }}
      />
    </div>
  );
  // 区块存证哈希：,45cac0331d35f6f0c471d1e63cb6ba012cef2d8de0fec28f033384e56f58c768

  const handleOnSearch = value => {
    changeLoading(true);
    setTimeout(async () => {
      const resp = await checkInfo({ hash: value });
      if (resp.msg === 'ok') {
        const data = JSON.parse(resp.data)[0];
        data.timestamp = data.time_stamp.substring(0, 13);
        changeData(data);
      }
      changeLoading(false);
    }, 1000)
  }


  return (
    <PageHeaderWrapper
      content={mainSearch}
    >
      <Card
        title='校验信息详情'
        bodyStyle={{ marginLeft: '30%' }}
        headStyle={{ fontWeight: 'bold' }}
      >
        <Card
          hoverable
          style={{ width: 400 }}
          cover={<img src={require('../../../../public/images/pic1.jpg')} height={200} width={400} />}
        >
          <Card.Meta description={
            <div>
              <Paragraph>
                <Icon style={{ color: '#52c41a' }} type="check-circle" />传感器类型：<span>{data.type}</span>
              </Paragraph>
              {/* <Paragraph>
                <Icon style={{ color: '#52c41a' }} type="check-circle" /> 大小（MB）：<span>10.2</span>
              </Paragraph>
              <Paragraph>
                <Icon style={{ color: '#52c41a' }} type="check-circle" /> 分辨率（像素）：<span>5184x3000</span>
              </Paragraph> */}
              <Paragraph>
                <Icon style={{ color: '#52c41a' }} type="check-circle" /> 所属采集点：<span>{data.point}</span>
              </Paragraph>
              <Paragraph>
                <Icon style={{ color: '#52c41a' }} type="check-circle" /> 时间戳：<span>{moment(new Date(Number(data.timestamp))).format('YYYY/MM/DD hh:mm:ss')}</span>
              </Paragraph>
              {/* <Paragraph>
              <Icon style={{ color: '#52c41a' }} type="check-circle" /> 所在区块高度：<span>22</span>
            </Paragraph> */}
              <Paragraph>
                <Typography.Text copyable ellipsis><Icon style={{ color: '#52c41a' }} type="check-circle" /> 所在区块哈希：{data.raw}</Typography.Text>
              </Paragraph>
            </div>
          } />
        </Card>,

        </Card>
    </PageHeaderWrapper>
  );
};

export default Form.create<TableListProps>()(TableList);
