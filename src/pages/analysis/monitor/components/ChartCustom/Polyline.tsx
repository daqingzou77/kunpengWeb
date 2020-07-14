import React from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from 'bizcharts';
import { Card } from 'antd';
import styles from './style.less';

const AirPressure: React.FC<any> = ({ title, xAxias, yAxias, data }) => {
  const cols = {
    collectTime: {
      min: 0,
      range: [0, 0.93],
      alias: '次'
    },
    airPressure: {
      range: [0, 0.9],
      alias: '时间'
    }
  };

  return (
    <Card
      title={title}
      className={styles.pieCard}
    >
      <Chart height={300} data={data} scale={cols} forceFit padding="auto">
        <Axis name={xAxias}
        // title={{
        //   position: 'end',
        //   offset: 15,
        //   textStyle: {
        //     fontSize: '12',
        //     textAlign: 'center',
        //     fill: '#999',
        //     fontWeight: 'bold',
        //     rotate: 0,
        //     autoRotate: true
        //   }
        // }}
        />
        <Axis name={yAxias}
        // title={{
        //   position: 'end',
        //   offset: 5.5,
        //   textStyle: {
        //     fontSize: '12',
        //     textAlign: 'right',
        //     fill: '#999',
        //     fontWeight: 'bold',
        //     rotate: 0
        //   }
        // }}
        />
        {/* <Tooltip
        crosshairs={{
          type: "y"
        }}
      /> */}
        <Tooltip />
        <Geom type="line" position={`${xAxias}*${yAxias}`} size={2}
          tooltip={[`${xAxias}*${yAxias}`, (xAxias, yAxias) => {
            return {
              name: `${title}`,
              value: yAxias,
            }
          }]} />
        <Geom
          type="point"
          position={`${xAxias}*${yAxias}`}
          size={4}
          shape={"circle"}
          style={{
            stroke: "#fff",
            lineWidth: 1
          }}
          tooltip={[`${xAxias}*${yAxias}`, (xAxias, yAxias) => {
            return {
              name: `${title}`,
              value: yAxias,
            }
          }]}
        />
      </Chart>
    </Card>
  )
}



export default AirPressure;