import { Result } from 'antd';
import React from 'react';

// 这里应该使用 antd 的 404 result 组件，
// 但是还没发布，先来个简单的。

const NoAuthority: React.FC<{}> = () => (
  <Result
    status="403"
    title="403"
    subTitle="需要登录"
  ></Result>
);


export default NoAuthority;
