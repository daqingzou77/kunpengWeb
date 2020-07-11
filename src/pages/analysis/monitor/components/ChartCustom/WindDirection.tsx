/* eslint-disable no-irregular-whitespace */
import React from 'react';
import { Card, } from 'antd';
import { Chart, Shape, Geom, Axis, Tooltip } from 'bizcharts';

if (Shape.registerShape) {
    Shape.registerShape('point', 'wind', {
        draw(cfg: any, container: any) {
            const group = container.addGroup();
            cfg.points = this.parsePoints(cfg.points);
            const { deg } = cfg.origin._origin;
            container.addShape('text', {
                attrs: {
                    x: cfg.points[0].x,
                    y: cfg.points[0].y,
                    fill: cfg.color,
                    text: '➤',
                    fontSize: cfg.size,
                    textBaseline: 'middle',
                    rotate: 270 + deg
                },
            });
            return group;
        },
    });
}

const dataMock: Array<any> = [
    {
        name: "风向1",
        value: 1,
        deg: 30
    },
    {
        name: "风向2",
        value: 1.5,
        deg: 75
    },
    {
        name: "风向3",
        value: 2,
        deg: 120
    },
    {
        name: "风向4",
        value: 1,
        deg: 220
    },
    {
        name: "风向5",
        value: 2,
        deg: 330
    },
    {
        name: "风向6",
        value: 1,
        deg: 10
    }
];

const cols = {
    value: {
        nice: false,
        max: 5,
        min: 0
    }
};

const WindDirection: React.FC<{ title: string }> = ({ title }) => {
    return (
        <Card title={title}>
            <Chart scale={cols} data={dataMock} height={300} forceFit padding="auto">
                <Axis name="name" />
                <Axis name="value" />
                <Geom
                    type="point"
                    shape="wind"
                    position="name*value"
                    color="value"
                    size={40}
                    tooltip={['name*value*deg', (name, value, deg) => { // array
                        return {
                            name: `风力${value}`,
                            value: `风向${deg}`
                        }
                    }]}
                />
                <Tooltip />
                <Geom
                    type="line"
                    position="name*value"
                    tooltip={['name*value*deg', (name, value, deg) => { // array
                        return {
                            name: `风力${value}`,
                            value: `风向${deg}`
                        }
                    }]}
                />
            </Chart>
        </Card>
    )
}

export default WindDirection;