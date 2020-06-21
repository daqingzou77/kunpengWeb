import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import { Menu, Row, Col, Card, Icon } from 'antd';
import { connect } from 'dva';
import BaseView from './components/base';
import BindingView from './components/binding';
import { CurrentUser } from './data';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import styles from './style.less';

const { Item } = Menu; // 头像组件 方便以后独立，增加裁剪之类的功能


interface SettingsProps {
  dispatch: Dispatch<any>;
  currentUser: CurrentUser;
}

type SettingsStateKeys = 'base' | 'security' | 'binding' | 'notification';
interface SettingsState {
  mode: 'inline' | 'horizontal';
  menuMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: SettingsStateKeys;
}

class Settings extends Component<SettingsProps, SettingsState> {
  main: HTMLDivElement | undefined = undefined;

  constructor(props: SettingsProps) {
    super(props);
    const menuMap = {
      base: '个人信息', // 已上传农事数据
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'base',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountAndsettings/fetchCurrent',
    })
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = (key: SettingsStateKeys) => {
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }

    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }

      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = this.main;

      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      this.setState({
        mode,
      });
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;

    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }

    return '';
  }

  renderChildren = () => {
    const { selectKey } = this.state;

    switch (selectKey) {
      case 'base':
        return <BaseView />;

      case 'security':
        return <SecurityView />;

      case 'binding':
        return <BindingView />;

      case 'notification':
        return <NotificationView />;

      default:
        break;
    }

    return null;
  };

  render() {
    const { currentUser } = this.props;

    if (!currentUser.userid) {
      return '';
    }

    return (
      <PageHeaderWrapper>
        <GridContent>
          <Row gutter={24}>
            <Col lg={7} md={24}>
              <Card
                bordered={false}
                style={{
                  marginBottom: 24,
                }}
              >
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.avatar} />
                    <div className={styles.name}>{currentUser.name}</div>
                    <div>{currentUser.signature}</div>
                  </div>
                  <div className={styles.detail}>
                    <p>
                      <Icon type="cloud-upload" />
                      <div>
                        已上传
                        <span
                          style={{
                            fontWeight: 'bold',
                            fontSize: 14,
                          }}
                        >
                          {currentUser.uploadedItems}
                        </span>
                        条农事记录
                      </div>
                    </p>
                    <p>
                      <Icon type="phone" />
                      {currentUser.phone}
                    </p>
                    <p>
                      <Icon type="mail" />
                      {currentUser.email}
                    </p>
                    <p>
                      <Icon type="bank" />
                      {currentUser.address}
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg={17} md={24}>
              <div
                className={styles.main}
                ref={(ref) => {
                  if (ref) {
                    this.main = ref;
                  }
                }}
              >
                <div className={styles.right}>
                  <div className={styles.title}>个人信息详情</div>
                  {this.renderChildren()}
                </div>
              </div>
            </Col>
          </Row>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    accountAndsettings,
  }: {
    accountAndsettings: {
      currentUser: CurrentUser;
    };
  }) => ({
    currentUser: accountAndsettings.currentUser,
  }),
)(Settings);
