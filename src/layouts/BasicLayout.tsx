/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
  SettingDrawer,
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Link } from 'umi';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { Icon, Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import Title from 'antd/lib/skeleton/Title';
import logo from '../assets/farm.svg';

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const defaultFooterDom = (
  <DefaultFooter
    links={[]}
    copyright="桂林电子科技大学 校址：中国广西桂林金鸡路1号　邮编：541004　传真：0773-2290083"
  />
);

const footerRender: BasicLayoutProps['footerRender'] = () => defaultFooterDom;

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  return (
    <>
      {/* 页面布局 */}
      <ProLayout
        logo={logo}
        // menuHeaderRender={(logoDom, titleDom) => (
        //   <Link to="/">
        //     {logoDom}
        //     {titleDom}
        //   </Link>
        // )}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: '首页',
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        // footerRender={footerRender}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
      >
        <Authorized authority={authorized!.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
    </>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
