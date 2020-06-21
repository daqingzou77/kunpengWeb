import React from 'react';
import { Form } from '@ant-design/compatible';
import moment from 'moment';
import '@ant-design/compatible/assets/index.css';
import { Input, Card, Icon, Typography } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { Paragraph,  } = Typography;

const TableList: React.FC<TableListProps> = () => {


  const mainSearch = (
    <div style={{ textAlign: 'center' }}>
      <Input.Search
        placeholder="请输入需要校验的哈希值"
        enterButton="搜索"
        size="large"
        onSearch={() => {
        }}
        style={{ maxWidth: 400, width: '100%' }}
      />
    </div>
  );


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
          <Card.Meta  description={
            <div>
            <Paragraph>
              <Icon style={{ color: '#52c41a' }} type="check-circle" /> 图片哈希：<span>1232321321</span>
            </Paragraph>
            <Paragraph>
              <Icon style={{ color: '#52c41a' }} type="check-circle" /> 大小（MB）：<span>10.2</span>
            </Paragraph>
            <Paragraph>
              <Icon style={{ color: '#52c41a' }} type="check-circle" /> 分辨率（像素）：<span>5184x3000</span>
            </Paragraph>
            <Paragraph>
              <Icon style={{ color: '#52c41a' }} type="check-circle" /> 所属采集点：<span>桂林电子科技大学</span>
            </Paragraph>
            <Paragraph>
              <Icon style={{ color: '#52c41a' }} type="check-circle" /> 时间戳：<span>{moment(new Date()).format('YYYY/MM/DD hh:mm:ss')}</span>
            </Paragraph>
            <Paragraph>
              <Icon style={{ color: '#52c41a' }} type="check-circle" /> 所在区块高度：<span>22</span>
            </Paragraph>
            <Paragraph>
              <Typography.Text copyable ellipsis><Icon style={{ color: '#52c41a' }} type="check-circle" /> 所在区块哈希：8218f00d1ec732e871b3e4e93608ec297cbdebf0419c264f4a12ad2a1498f949</Typography.Text>
            </Paragraph>

            </div>
           } />
        </Card>,

        </Card>
    </PageHeaderWrapper>
  );
};

export default Form.create<TableListProps>()(TableList);
