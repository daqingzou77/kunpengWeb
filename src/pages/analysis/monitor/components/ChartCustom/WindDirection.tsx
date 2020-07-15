/* eslint-disable no-irregular-whitespace */
import React from 'react';
import { Card, } from 'antd';
import { Chart, Shape, Geom, Axis, Tooltip } from 'bizcharts';

if (Shape.registerShape) {
    Shape.registerShape('point', 'wind', {
        draw(cfg: any, container: any) {
            cfg.points = this.parsePoints(cfg.points);
            const coord = this._coord;
            const { windDirection } = cfg.origin._origin;
            container.addShape('line', {
                attrs: {
                    x1: cfg.points[0].x,
                    y1: cfg.points[0].y,
                    x2: cfg.points[0].x,
                    y2: coord.start.y,
                    stroke: "#ccc",
                    lineWidth: 1,
                    lineDash: [4, 2]
                }
            });
            return container.addShape('text', {
                attrs: {
                    x: cfg.points[0].x,
                    y: cfg.points[0].y,
                    fill: cfg.color,
                    text: '➤',
                    fontSize: cfg.size,
                    textBaseline: 'middle',
                    rotate: 270 + windDirection
                },
            });
        },
    });
}

const scols = {
    windDirection: {
        range: [0, 1]
    }
}

const WindDirections: React.FC<{ title: string, xAxias: string, yAxias: string, data: any }> = ({ title, xAxias, yAxias, data }) => {
    return (
        <Card title={title}>
            <Chart  data={data} height={300} scale={scols} forceFit padding="auto">
                <Axis name={xAxias} />
                <Axis name={yAxias} visible={false} />
                <Geom
                    type="point"
                    shape="wind"
                    position={`${xAxias}*${yAxias}`}
                    color="value"
                    size={14}
                    tooltip={false}
                />
              <Tooltip />
                <Geom
                    type="line"
                    position={`${xAxias}*${yAxias}`}
                    tooltip={[`${xAxias}*${yAxias}`, (xAxias, yAxias) => { // array
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

export default WindDirections;