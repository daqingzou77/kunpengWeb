import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import numeral from 'numeral';
import { Bar } from './Charts';
import {
  getPoints,
} from '../service';
import styles from '../style.less';

const rankingListData: {
  title: string;
  total: number;
}[] = [];

for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: '工专路 {no} 号店',
    total: 323234,
  });
}

const SalesCard = ({
  loading,
  selectDate,
  data,
  types
}: {
  loading: boolean;
  selectDate: (key: 'today' | 'week' | 'month' | 'year') => void;
  data: any[],
  types: string
}) => {
  const [rankData, changeRankData] = useState<any[]>([]);

  const queryData = async () => {
    const resp = await getPoints();
    if (resp.msg === 'ok') {
      console.log(resp.data);
      changeRankData(resp.data)
    }
  }

  useEffect(() => {
    queryData();
  }, []);

  const isActive = (type: 'today' | 'week' | 'month' | 'year') => {
    if (type === types) {
      return styles.currentDate;
    }
    return '';
  };

  const Right = () => {
    return (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={isActive('today')} onClick={() => selectDate('today')}>
            今日
                </a>
          <a className={isActive('week')} onClick={() => selectDate('week')}>
            本周
                </a>
          <a className={isActive('month')} onClick={() => selectDate('month')}>
            本月
                </a>
          <a className={isActive('year')} onClick={() => selectDate('year')}>
            全年
                </a>
        </div>
      </div>
    )
  }
  return (
    <Row gutter={24}>
      <Col xl={17} lg={24} md={24} sm={24} xs={24}>
        <Card
          extra={<Right />}
          title="交易数"
          bodyStyle={{ height: 400 }}
        >
          <div className={styles.salesBar}>
            <Bar height={292} title="交易量趋势" data={data} />
          </div>
        </Card>
      </Col>
      <Col xl={7} lg={24} md={24} sm={24} xs={24} >
        <Card
          title="采集点及其信息数量"
          bodyStyle={{ height: 400 }}
        >
          <div className={styles.salesRank}>
            <ul className={styles.rankingList}>
              {rankData.map((item, i) => (
                <li key={item.point}>
                  <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                    {i + 1}
                  </span>
                  <span className={styles.rankingItemTitle} title={item.title}>
                    {item.point}
                  </span>
                  <span>{numeral(item.cnt).format('0,0')}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default SalesCard;