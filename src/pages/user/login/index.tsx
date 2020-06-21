import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox, Button } from 'antd';
import React, { Component } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch } from 'redux';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import Link from 'umi/link';
import { connect } from 'dva';
import { StateType } from './model';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;
interface LoginProps {
  dispatch: Dispatch<any>;
  userAndlogin: StateType;
  submitting: boolean;
}
interface LoginState {
  type: string;
  autoLogin: boolean;
}
export interface FormDataType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}


class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
    autoLogin: true,
  };

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err: any, values: FormDataType) => {
    const { type } = this.state;

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'userAndlogin/login',
        payload: { ...values, type },
      });
    }
  };

  onTabChange = (type: string) => {
    this.setState({
      type,
    });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, (err: any, values: FormDataType) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          ((dispatch({
            type: 'userAndlogin/getCaptcha',
            payload: values.mobile,
          }) as unknown) as Promise<any>)
            .then(resolve)
            .catch(reject);
        }
      });
    });

  renderMessage = (content: string) => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { userAndlogin, submitting } = this.props;
    const { status, type: loginType } = userAndlogin;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={(form: any) => {
            this.loginForm = form;
          }}
        >
          {/* <Tab
           key="account"
           tab={formatMessage({ id: 'userandlogin.login.tab-login-credentials' })}
          > */}
          {status === 'error' &&
            loginType === 'account' &&
            !submitting &&
            this.renderMessage('账户或密码错误（admin/ant.design）')}
          <UserName
            name="userName"
            placeholder={`${'用户名'}`}
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder={`${'密码'}`}
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
            onPressEnter={(e) => {
              e.preventDefault();

              if (this.loginForm) {
                this.loginForm.validateFields(this.handleSubmit);
              }
            }}
          />
          {/* </Tab> */}
          {/* 手机号注册 */}
          {/* <Tab key="mobile" tab={formatMessage({ id: 'userandlogin.login.tab-login-mobile' })}>
           {status === 'error' &&
             loginType === 'mobile' &&
             !submitting &&
             this.renderMessage(
               formatMessage({ id: 'userandlogin.login.message-invalid-verification-code' }),
             )}
           <Mobile
             name="mobile"
             placeholder={formatMessage({ id: 'userandlogin.phone-number.placeholder' })}
             rules={[
               {
                 required: true,
                 message: formatMessage({ id: 'userandlogin.phone-number.required' }),
               },
               {
                 pattern: /^1\d{10}$/,
                 message: formatMessage({ id: 'userandlogin.phone-number.wrong-format' }),
               },
             ]}
           />
           <Captcha
             name="captcha"
             placeholder={formatMessage({ id: 'userandlogin.verification-code.placeholder' })}
             countDown={120}
             onGetCaptcha={this.onGetCaptcha}
             getCaptchaButtonText={formatMessage({ id: 'userandlogin.form.get-captcha' })}
             getCaptchaSecondText={formatMessage({ id: 'userandlogin.captcha.second' })}
             rules={[
               {
                 required: true,
                 message: formatMessage({ id: 'userandlogin.verification-code.required' }),
               },
             ]}
           />
          </Tab> */}
          {/* <div>
           <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
             <FormattedMessage id="userandlogin.login.remember-me" />
           </Checkbox>
           <a style={{ float: 'right' }} href="">
             <FormattedMessage id="userandlogin.login.forgot-password" />
           </a>
          </div> */}
          {/* <Button type='dashed' size="large" style={{ width: '100%'}}>游客访问</Button> */}
          <Submit loading={submitting}>用户登录</Submit>
          <Button
            type="primary"
            size="large"
            style={{
              width: '100%',
            }}
          >
            游客访问
          </Button>
          <Button
            type="danger"
            size="large"
            style={{
              width: '100%',
              marginTop: 25,
            }}
          >
            新用户注册
          </Button>
          {/* <Link className={styles.register} to="/user/register">
             <FormattedMessage id="userandlogin.login.signup" />
           </Link> */}
          {/* <div className={styles.other}>
           <FormattedMessage id="userandlogin.login.sign-in-with" />
           <AlipayCircleOutlined className={styles.icon} />
           <TaobaoCircleOutlined className={styles.icon} />
           <WeiboCircleOutlined className={styles.icon} />
           <Link className={styles.register} to="/user/register">
             <FormattedMessage id="userandlogin.login.signup" />
           </Link>
          </div> */}
        </LoginComponents>
      </div>
    );
  }
}

export default connect(
  ({
    userAndlogin,
    loading,
  }: {
    userAndlogin: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userAndlogin,
    submitting: loading.effects['userAndlogin/login'],
  }),
)(Login);
