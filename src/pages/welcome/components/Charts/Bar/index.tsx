import { Axis, Chart, Geom, Tooltip } from 'bizcharts';
import { Empty, Spin } from 'antd';
import React, { Component } from 'react';
import autoHeight from '../autoHeight';

export interface BarProps {
  title: React.ReactNode;
  color?: string;
  padding?: [number, number, number, number];
  height?: number;
  data: any[],
  forceFit?: boolean;
  autoLabel?: boolean;
  style?: React.CSSProperties;
  types: string,
}

class Bar extends Component<BarProps, { autoHideXLabels: boolean }> {

  render() {
    const {
      height = 1,
      data,
      type
    } = this.props;
    const xais = ['xais', 'yais'];
    if (data.length > 0) {
      xais.splice(0, xais.length);
      Object.keys(data[0]).map(item => {
        xais.push(item)
      })
    }

    let selectType;
    switch (type) {
      case 'today': selectType = '本时交易';break;
      case 'week':  selectType = '当天交易';break;
      case 'month': selectType = '当日交易';break;
      case 'year':  selectType = '本月交易';break;
      default: selectType = '本时交易';
    }

    return (
      <div style={{ height }}>
        {
          data.length > 0 ? (
            <Chart height={400} data={data} forceFit>
              <Axis name={`${xais[0]}`} />
              <Axis name={`${xais[1]}`} />
              <Tooltip />
              <Geom type="interval" position={`${xais[0]}*${xais[1]}`}
                tooltip={
                  [`${xais[0]}*${xais[1]}`, (x, y) => {
                    return {
                      name: selectType,
                      value: y
                    }
                  }]
                }
              />
            </Chart>
          ) : (
              <Spin />
            )
        }

      </div>
    );
  }
}

export default autoHeight()(Bar);
