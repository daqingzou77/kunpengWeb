import { UploadOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Select, Upload, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { connect } from 'dva';
import { updateLoginUser } from '../service';
import { CurrentUser } from '../data';
import styles from './BaseView.less';

const FormItem = Form.Item;

interface SelectItem {
  label: string;
  key: string;
}

interface dataProps {
  avatar: string,
  username: string,
  signature: string,
  email: string,
  phone: string,
  address: string
}

interface BaseViewProps extends FormComponentProps {
  currentUser?: CurrentUser;
  data?: dataProps,
}

function getBase64(img: any, callback: any) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


class BaseView extends Component<BaseViewProps> {
  view: HTMLDivElement | undefined = undefined;

  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form, getUser } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        const { address, email, phone } = values;
        const resp = await updateLoginUser({ address, email, phone });
        if (resp.msg === 'ok') {
          message.success('更新基本信息成功');
        }
        getUser()
      }
    });
  };

  // 头像上传前处理
  handleBefore = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('Image must smaller than 1MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  handleChange = (info: any) => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl: string) => {
        this.props.setAvatar(imageUrl)
      }
      );
      message.success('头像更换成功')
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      data: { username, phone, email, address, records, avatar }
    } = this.props;
    const token = localStorage.getItem('token');
    return (
      <div className={styles.baseView} >
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark autoComplete="off">
            <FormItem label="用户名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的昵称!',
                  },
                ],
                initialValue: username
              })(<Input disabled />)}
            </FormItem>
            <FormItem label="邮箱">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的邮箱!',
                  },
                ],
                initialValue: email
              })(<Input />)}
            </FormItem>

            <FormItem label="已上传农事记录数据条数">
              {getFieldDecorator('records', {
                rules: [
                ],
                initialValue: records
              })(<Input disabled />)}
            </FormItem>
            <FormItem label="联系电话">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的联系电话!',
                  }, // { validator: validatorPhone },
                ],
                initialValue: phone
              })(<Input />)}
            </FormItem>
            <FormItem label="地址">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入个人地址!',
                  },
                ],
                initialValue: address
              })(<Input.TextArea placeholder="请输入住址" rows={4} />)}
            </FormItem>
            <Button
              type="primary"
              onClick={this.handlerSubmit}
              style={{
                marginRight: 20,
                width: 100,
              }}
            >
              更新信息
            </Button>
            <Button
              type="danger"
              style={{
                width: 100,
              }}
            >
              重置信息
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <Fragment>
            <div className={styles.avatar_title}>头像</div>
            <div className={styles.avatar}>
              <img src={avatar} alt="avatar" width={144} height={144} style={{ borderRadius: '50%' }} />
            </div>
            <Upload
              action='/api/v1/user/setHeader'
              showUploadList={false}
              beforeUpload={file => this.handleBefore(file)}
              onChange={this.handleChange}
              headers={{ Authorization: token }}
            >
              <div className={styles.button_view}>
                <Button>
                  <UploadOutlined />
              更换头像
            </Button>
              </div>
            </Upload>
          </Fragment>
        </div>
      </div>
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
)(Form.create<BaseViewProps>()(BaseView));
