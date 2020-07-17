import React, { useState } from 'react';
import { Form } from '@ant-design/compatible';
import moment from 'moment';
import '@ant-design/compatible/assets/index.css';
import { Input, Card, Icon, Typography, Empty, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  checkInfo,
  picCheck
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

  const handleCheck = async (time: string, hash: string, point: string) => {
    const date = moment(Number(time)).format('YYYY-MM-DD').toString();
    const resp = await picCheck({ date, hash, point });
    if (resp.msg === 'ok') {
      const { checkHash, fileHash } = resp.data;
      Modal.success({
        title: '哈希检验成功',
        content:
          (
            <div>
              <p>文件哈希：{fileHash}</p>
              <p>校验哈希: {checkHash}</p>
            </div>
          )
      })
    } else {
      Modal.warning({
        title: '文件校验失败'
      })
    }
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
              cover={<img src={`/${data.point}/${moment(new Date(Number(data.timestamp))).format('YYYY-MM-DD')}/${data.name}.jpg`} height={200} width={400} />}
            >
              {/* 5decf29874586915f21d792c7abd1aa50bb69c461ababdba52a68eef2618d60d */}
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
                  <Button style={{ float: 'right' }} onClick={() => handleCheck(data.timestamp, data.name, data.point)}>核验</Button>
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
