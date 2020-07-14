import React from 'react';
import { Card } from 'antd';
import { Chart, Axis, Tooltip, Geom } from 'bizcharts';

const Columnar: React.FC<any> = ({ title, xAxias, yAxias, data }) => {
  
    return (
     <Card
      title={title}
    >
      <Chart
        height={300}
        data={data}
        forceFit
        padding="auto"
    >
        <Axis name={xAxias} />
        <Axis name={yAxias} />
        <Tooltip />
        <Geom
          type="interval"
          position={`${xAxias}*${yAxias}`}
          tooltip={[`${xAxias}*${yAxias}`, (xAxias, yAxias) => {
            return {
              name: `${title}`,
              value: yAxias
            }
          }]}
        />
    </Chart>

    </Card>
  )
}

export default Columnar;