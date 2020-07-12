import React from 'react';
import { Card } from 'antd';
import { Chart, Axis, Tooltip, Geom } from 'bizcharts';

const ticks = ['java', 'jquery', 'es6', 'black', 'gold', 'team', 'less', 'javascript', '123', '456'];

const mockData = () => {
    const result = [];
    for (let i = 0, len = 10; i < len; i++) {
        result.push({
            xAxis: ticks[i],
            yAxis: Math.floor(Math.random() * 100)
        });
    }
    return result;
};

const Columnar: React.FC<any> = ({ title }) => {
    return (
     <Card
      title={title}
    >
      <Chart
        height={300}
        data={mockData()}
        forceFit
        padding="auto"
    >
        {/* x轴，横轴，以data数据的xAxis属性值为柱子的值 */}
        <Axis name="xAxis" />
        {/* y轴，纵轴，以data数据的yAxis属性值为柱子的值 */}
        <Axis name="yAxis" />
        {/* 鼠标hover直方图柱子的时候，tooltip显示的值 */}
        <Tooltip />
        {/* 几何标记对象，主要用以描述你要画的是什么图形（直方图、折线图、饼状图、区域图）：interval是直方图 */}
        <Geom
          type="interval"
          position="xAxis*yAxis"
        />
    </Chart>

    </Card>
  )
}

export default Columnar;