import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import { Menu, Row, Col, Card, Icon } from 'antd';
import BaseView from './components/base';
import BindingView from './components/binding';
import { CurrentUser } from './data';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import { getLoginUser, getAvatar } from './service';
import styles from './style.less';
import { string } from 'prop-types';

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
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
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
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      username: '',
      signature: '',
      email: '',
      phone: '',
      address: '',
    };
  }


  componentDidMount() {
    this.getUser();
    this.getAvatarUrl();
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getAvatarUrl = async () => {
    const resp = await getAvatar();
    if (resp.msg === 'ok') {
      this.setState({
        avatar: `http://202.193.60.112:8000/header/${resp.data}`
      })
    }
  }

  getUser = async () => {
    const resp = await getLoginUser();
    if (resp.msg === 'ok') {
      const { data: { username, email, address, phone } } = resp.data;
      this.setState({
        username,
        email,
        address,
        phone
      })
    }
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
  const { username, signature, phone, email, address, avatar } = this.state;

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
                    <img alt="用户头像" src={avatar} width={70} height={70} style={{ borderRadius: '50%' }} />
                    <div className={styles.name}>{username}</div>
                    <div>{signature}</div>
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
                          0
                        </span>
                        条农事记录
                      </div>
                    </p>
                    <p>
                      <Icon type="phone" />
                      {phone}
                    </p>
                    <p>
                      <Icon type="mail" />
                      {email}
                    </p>
                    <p>
                      <Icon type="bank" />
                      {address}
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

export default Settings;
