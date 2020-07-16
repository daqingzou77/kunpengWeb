import React, { useState } from 'react';
import { Form } from '@ant-design/compatible';
import moment from 'moment';
import sha256 from 'sha256';
import '@ant-design/compatible/assets/index.css';
import { Input, Card, Icon, Typography, Empty, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  checkInfo
} from './service';
import styles from './style.less';

const { Paragraph } = Typography;

var Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  decode: function(e) {
   var t = "";
   var n, r, i;
   var s, o, u, a;
   var f = 0;
   e=e.replace(/[^A-Za-z0-9+/=]/g,"");
   while (f < e.length) {
    s = this._keyStr.indexOf(e.charAt(f++));
    o = this._keyStr.indexOf(e.charAt(f++));
    u = this._keyStr.indexOf(e.charAt(f++));
    a = this._keyStr.indexOf(e.charAt(f++));
    n = s << 2 | o >> 4;
    r = (o & 15) << 4 | u >> 2;
    i = (u & 3) << 6 | a;
    t = t + String.fromCharCode(n);
    if (u != 64) {
     t = t + String.fromCharCode(r)
    }
    if (a != 64) {
     t = t + String.fromCharCode(i)
    }
   }
   t = Base64._utf8_decode(t);
   return t
  },
  _utf8_decode: function(e) {
   var t = "";
   var n = 0;
   var c2 = 0;
   var c1 = 0;
   var r = 0;
   while (n < e.length) {
    r = e.charCodeAt(n);
    if (r < 128) {
     t += String.fromCharCode(r);
     n++
    } else if (r > 191 && r < 224) {
     c2 = e.charCodeAt(n + 1);
     t += String.fromCharCode((r & 31) << 6 | c2 & 63);
     n += 2
    } else {
     c2 = e.charCodeAt(n + 1);
     c3 = e.charCodeAt(n + 2);
     t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
     n += 3
    }
   }
   return t
  }
 }

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

  const handleCheck = () => {

  }

  const handleOnSearch = value => {
    changeLoading(true);
    setTimeout(async () => {
      const resp = await checkInfo({ hash: value });
      if (resp.msg === 'ok') {
        const data = JSON.parse(resp.data)[0];
        data.timestamp = data.time_stamp.substring(0, 13);
        console.log(Base64.decode(data.raw).split('{'))
        changeData(data);
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
              cover={<img src={require('../../../../public/images/pic1.jpg')} height={200} width={400} />}
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
                    <Typography.Text copyable ellipsis><Icon style={{ color: '#52c41a' }} type="check-circle" /> 所在区块哈希：{data.raw}</Typography.Text>
                  </Paragraph>
                  <Button style={{ float: 'right' }} onClick={() => handleCheck()}>核验</Button>
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
