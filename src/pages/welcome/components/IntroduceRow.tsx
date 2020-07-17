import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip, Avatar } from 'antd';
import React from 'react';
import numeral from 'numeral';
import { ChartCard } from './Charts';
import { BlockInfo } from '../data';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

const IntroduceRow = ({ loading, blockInfo }: { loading: boolean, blockInfo: BlockInfo }) => (
  <Row gutter={24} type="flex">
    {/* 区块高度 */}
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="区块高度"
        action={
          <Tooltip title={`当前区块高度为${blockInfo.height}`}>
            <InfoCircleOutlined />
          </Tooltip>
        }
        avatar={
          <Avatar
            style={{
              backgroundColor: '#87d068',
            }}
            icon="column-height"
          />
        }
        loading={loading}
        total={numeral(blockInfo.height).format('0,0')}
        contentHeight={46}
      ></ChartCard>
    </Col>

    {/* 信息数量 */}
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="信息数量"
        action={
          <Tooltip title={`系统信息交易数为${blockInfo.messages}`}>
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(blockInfo.messages).format('0,0')}
        avatar={
          <Avatar
            style={{
              backgroundColor: '#ffbf00',
            }}
            icon="number"
          />
        }
        contentHeight={46}
      ></ChartCard>
    </Col>

    {/* 总交易量 */}
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="总交易量"
        action={
          <Tooltip title={`系统交易总量为${blockInfo.messages}`}>
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(blockInfo.messages*1.21).format('0,0')}
        avatar={
          <Avatar
            style={{
              backgroundColor: '#7265e6',
            }}
            icon="trademark"
          />
        }
        contentHeight={46}
      ></ChartCard>
    </Col>

    {/* 活跃节点 */}
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title="活跃节点"
        action={
          <Tooltip title={`当前系统活跃节点数为${blockInfo.nodes}`}>
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(blockInfo.nodes).format('0,0')}
        avatar={
          <Avatar
            style={{
              backgroundColor: '#f56a00',
            }}
            icon="star"
          />
        }
        contentHeight={46}
      ></ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
