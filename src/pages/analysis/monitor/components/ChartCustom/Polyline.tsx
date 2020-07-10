import React from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from 'bizcharts';
import { Card } from 'antd';
import styles from './style.less';

const data = [
  {
    year: "1991",
    value: 3
  },
  {
    year: "1992",
    value: 4
  },
  {
    year: "1993",
    value: 3.5
  },
  {
    year: "1994",
    value: 5
  },
  {
    year: "1995",
    value: 4.9
  },
  {
    year: "1996",
    value: 6
  },
  {
    year: "1997",
    value: 7
  },
  {
    year: "1998",
    value: 9
  },
  {
    year: "1999",
    value: 13
  }
];
const cols = {
  value: {
    min: 0,
    range: [0, 0.93],
    alias: '次'
  },
  year: {
    range: [0, 0.9],
    alias: '时间'
  }
};


const AirPressure: React.FC<any> = ({ title }) => (
  <Card 
    title={title} 
    className={styles.pieCard}
  >
    <Chart height={300} data={data} scale={cols} forceFit padding="auto">
      <Axis name="year" title={{
        position: 'end',
        offset: 15,
        textStyle: {
          fontSize: '12',
          textAlign: 'center',
          fill: '#999',
          fontWeight: 'bold',
          rotate: 0,
          autoRotate: true
        }
      }} />
      <Axis name="value" title={{
        position: 'end',
        offset: 5.5,
        textStyle: {
          fontSize: '12',
          textAlign: 'right',
          fill: '#999',
          fontWeight: 'bold',
          rotate: 0
        }
      }} />
      <Tooltip
        crosshairs={{
          type: "y"
        }}
      />
      <Geom type="line" position="year*value" size={2}
        tooltip={['year*value', (year, value) => {
          return {
            name: '数值', // 要显示的名字
            value,
            title: year
          }
        }]} />
      <Geom
        type="point"
        position="year*value"
        size={4}
        shape={"circle"}
        style={{
          stroke: "#fff",
          lineWidth: 1
        }}
        tooltip={['year*value', (year, value) => {
          return {
            name: '数值', // 要显示的名字
            value,
            title: year
          }
        }]}
      />
    </Chart>
  </Card>

)


export default AirPressure;