import React, { useState } from 'react';
import { Form } from '@ant-design/compatible';
import moment from 'moment';
import sha256 from 'sha256';
import '@ant-design/compatible/assets/index.css';
import { Input, Card, Icon, Typography, Empty, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  checkInfo,
  backPic
} from './service';
import { Base64 } from '@/utils/Base64';
import styles from './style.less';

const { Paragraph } = Typography;


const TableList: React.FC<TableListProps> = () => {

  const [loading, changeLoading] = useState<boolean>(false);
  const [data, changeData] = useState<any>({
    point: '',
    raw: '',
    timetamp: '',
    type: '',
    name: '',
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

  const handleCheck = async (name: string) => {
  }

  const handleOnSearch = value => {
    changeLoading(true);
    setTimeout(async () => {
      const resp = await checkInfo({ hash: value });
      if (resp.msg === 'ok') {
        const data = JSON.parse(resp.data)[0];
        data.timestamp = data.time_stamp.substring(0, 13);
        const dataParse = JSON.parse(Base64.decode(data.raw).split('~')[0]);
        const assData = Object.assign(data, dataParse)
        changeData(assData);
      }
      changeLoading(false);
    }, 1000)
  }

  const showStatus = data.type !== '' && data.point !== '' && data.timetamp !== '';
  const height = showStatus ? 500 : 200;

  return (
    <PageHeaderWrapper
      content={mainSearch}
    >
      <Card
        title='校验信息详情'
        headStyle={{ fontWeight: 'bold' }}
        bodyStyle={{ position: 'relative', height }}
      >
        {
          showStatus ? (
            <Card
              hoverable
              className={styles.desc}
              style={{ width: 400, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              cover={<img src={`/0018DE743E31/2020-07-13/${data.name}.jpg`} height={200} width={400} />}
            >
              <Card.Meta description={
                <div>
                  <Paragraph>
                    <Icon style={{ color: '#52c41a' }} type="check-circle" /> 传感器类型：<span>{data.type}</span>
                  </Paragraph>
                  <Paragraph>
                    <Icon style={{ color: '#52c41a' }} type="check-circle" /> 所属采集点：<span>{data.point}</span>
                  </Paragraph>
                  <Paragraph>
                    <Icon style={{ color: '#52c41a' }} type="check-circle" /> 时间戳：<span>{moment(new Date(Number(data.timestamp))).format('YYYY/MM/DD hh:mm:ss')}</span>
                  </Paragraph>
                  <Paragraph>
                    <Typography.Text ellipsis editable><Icon style={{ color: '#52c41a' }} type="check-circle" /> 文件哈希：{data.name}</Typography.Text>
                  </Paragraph>
                  <Button style={{ float: 'right' }} onClick={() => handleCheck(data.name)}>核验</Button>
                </div>
              } />
            </Card>
          ) : (
              <Empty description="暂无数据" />
            )
        }
      </Card>
    </PageHeaderWrapper>
  );
};

export default Form.create<TableListProps>()(TableList);
