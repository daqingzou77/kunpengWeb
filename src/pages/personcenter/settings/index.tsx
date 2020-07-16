import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col, Card, Icon } from 'antd';
import BaseView from './components/base';
import { getLoginUser, getAvatar, getuploadRecords } from './service';
import styles from './style.less';

interface SettingsProps {
  dispatch: Dispatch<any>;
}

interface SettingsState {
  avatar: string,
  username: string,
  signature: string,
  email: string,
  phone: string,
  address: string,
  records: number
}

class Settings extends Component<SettingsProps, SettingsState> {
  main: HTMLDivElement | undefined = undefined;

  constructor(props: SettingsProps) {
    super(props);
    this.state = {
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      username: '',
      signature: '',
      email: '',
      phone: '',
      address: '',
      records: 0
    };
  }


  componentDidMount() {
    this.getUser();
    this.getAvatarUrl();
    this.getUpRecords();
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

  getUpRecords = async () => {
    const resp = await getuploadRecords();
    if (resp.msg === 'ok') {
      this.setState({
        records: resp.data
      })
    }
  }

  renderChildren = (username: string, signature: string, phone: string, email: string, address: string, avatar: string, records: number) => {
    const data = {
      username, signature, phone, email, address, avatar, records
    }
    return <BaseView data={data} setAvatar={this.setAvatar} getUser={this.getUser} />;
  };

  setAvatar = (avatar: string) => {
    this.setState({
      avatar
    })
  }

  render() {
    const { username, signature, phone, email, address, avatar, records } = this.state;

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
                          {records}
                        </span>
                        条农事记录
                      </div>
                    </p>
                    {
                      phone ? (
                        <p>
                          <Icon type="phone" />
                          {phone}
                        </p>
                      ) : ''
                    }
                    {
                      email ? (
                        <p>
                          <Icon type="mail" />
                          {email}
                        </p>
                      ) : ''
                    }
                    {
                      address ? (
                        <p>
                          <Icon type="bank" />
                          {address}
                        </p>
                      ) : ''
                    }
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
                  {this.renderChildren(username, signature, phone, email, address, avatar, records)}
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
