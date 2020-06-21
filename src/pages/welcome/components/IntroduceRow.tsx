import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip, Icon, Avatar } from 'antd';
import React from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from './Charts';
import { VisitDataType } from '../data';
import Trend from './Trend';
import styles from '../style.less'; // 支持响应式

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

const IntroduceRow = ({ loading, visitData }: { loading: boolean; visitData: VisitDataType[] }) => (
  <Row gutter={24} type="flex">
    {/* 区块高度 */}
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="区块高度"
        action={
          <Tooltip title="当前区块高度为">
            <InfoCircleOutlined />
          </Tooltip>
        }
        avatar={
          <Avatar
            style={{
              backgroundColor: '#87d068',
            }}
            icon="user"
          />
        }
        loading={loading}
        total={() => 200}
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
          <Tooltip title="系统信息交易数为">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(88).format('0,0')}
        avatar={
          <Avatar
            style={{
              backgroundColor: '#ffbf00',
            }}
            icon="user"
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
          <Tooltip title="系统交易总量为">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(6560).format('0,0')}
        avatar={
          <Avatar
            style={{
              backgroundColor: '#7265e6',
            }}
            icon="user"
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
          <Tooltip title="当前系统活跃节点数为">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(6).format('0,0')}
        avatar={
          <Avatar
            style={{
              backgroundColor: '#f56a00',
            }}
            icon="user"
          />
        }
        contentHeight={46}
      ></ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
