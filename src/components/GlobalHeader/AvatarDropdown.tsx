/* eslint-disable no-shadow */
import { Avatar, Icon, Menu, Modal, Form, Input, message } from 'antd';
import { LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { router } from 'umi';
import { ConnectProps } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import { userLogin, userRigester, userLogout } from '@/services/login';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {

  state = {
    modalVisible: false,
    loginModalVisible: false,
  }

  onMenuClick = (event: ClickParam) => {
    const { key } = event;
    if (key === 'logout') {
      this.handleLogout()
      // const { dispatch } = this.props;
      // if (dispatch) {
      //   dispatch({
      //     type: 'login/logout',
      //   });
      // }
      return;
    }
    router.push(`/account/${key}`);
  };

  compareToFirstPassword = (_, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码不一致');
    } else {
      callback();
    }
  };

  validateToNextPassword = (_, value, callback) => {
    const { form } = this.props;
    if (value) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  };

  handleLogin = () => {
    this.setState({
      loginModalVisible: true
    })
  }

  handleLoginCancel = () => {
    this.setState({
      loginModalVisible: false
    })
    this.props.form.resetFields();
  }

  handleReigister = () => {
    this.setState({
      modalVisible: true
    })
  }

  handleRigsterCancel = () => {
    this.setState({
      modalVisible: false
    })
    this.props.form.resetFields();
  }

  handleLogout = async () => {
    const resp = await userLogout();
    if (resp.msg === 'ok') {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.reload()
    }
  }

  // 登录提交
  handleOnSubmitLogin = () => {
    const { form } = this.props;
    form.validateFields(async (_: any, values: any) => {
      const { username, password } = values;
      const resp = await userLogin({ username, password });
      const { msg, data } = resp;
      if (msg === 'ok') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', username)
        this.setState({
          currentUser: username
        })
        message.success('用户登录成功')
      } else {
        message.error('用户登录失败');
      }
      this.setState({
        loginModalVisible: false
      })
      form.resetFields();
    });
  }

  // 注册提交
  handleOnSubmitRigster = () => {
    const { form } = this.props;
    form.validateFields(async (_: any, values: any) => {
      const { username, password, identity } = values;
      const resp = await userRigester({ username, password, identity});
      const { msg } = resp;
      if (msg === 'ok') {
        message.success('用户注册成功')
      } else {
        message.error('用户注册失败');
      }
      this.setState({
        modalVisible: false
      })
      form.resetFields();
    });
  }

  render(): React.ReactNode {
    const { menu } = this.props;
    const { modalVisible, loginModalVisible } = this.state;
    const currentUser = localStorage.getItem('currentUser')
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
             账户设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <Icon type="logout" />
          系统退出
        </Menu.Item>
      </Menu>
    );

    return (
      <>
        {currentUser ? (
          <HeaderDropdown overlay={menuHeaderDropdown}>
            <span>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} alt="avatar" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
                <span className={styles.name}>{currentUser}</span>
              </span>
            </span>
          </HeaderDropdown>
        ) : (
            <div style={{ paddingRight: 12, cursor: 'pointer' }}>
              <span style={{ marginRight: 10 }} onClick={this.handleLogin}><LoginOutlined style={{ marginRight: 10 }} />登录</span>
              <span onClick={this.handleReigister}><LogoutOutlined style={{ marginRight: 10 }} />注册</span>
            </div>
          )}
        <Modal
          title="用户注册"
          visible={modalVisible}
          onCancel={this.handleRigsterCancel}
          onOk={this.handleOnSubmitRigster}
          okText="注册"
          cancelText="取消"
        >
          <Form className="login-form" {...formItemLayout}>
            <Form.Item label="用户名">
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '注册名不能为空' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="请输入注册用户名"
                />,
              )}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '注册密码不能为空' },
                  {
                    validator: this.validateToNextPassword,
                  }
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="请输入注册密码"
                />,
              )}
            </Form.Item>
            <Form.Item label="确认密码">
              {getFieldDecorator('confirmPassword', {
                rules: [
                  { required: true, message: '注册密码不能为空' },
                  {
                    validator: this.compareToFirstPassword,
                  }
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="请输入注册密码"
                />,
              )}
            </Form.Item>
            <Form.Item label="身份标识">
              {getFieldDecorator('identity', {
                rules: [{ required: true, message: '身份标识不能为空' }],
              })(
                <Input
                  prefix={<Icon type="environment" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="identity"
                  placeholder="请输入身份标识"
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="用户登录"
          visible={loginModalVisible}
          okText="登录"
          cancelText="取消"
          onOk={this.handleOnSubmitLogin}
          onCancel={this.handleLoginCancel}
        >
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="用户名">
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '用户名不能为空' }],
              })(
                <Input
                  placeholder="请输入登录用户名"
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
              )}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '密码不能为空' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="请输入登录密码"
                />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </>
    )
  }
}

export default Form.create({ name: 'avatarDrowndown' })(AvatarDropdown);
