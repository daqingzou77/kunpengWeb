import { UploadOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Select, Upload, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { connect } from 'dva';
import { getAvatar, getLoginUser, updateLoginUser } from '../service';
import { CurrentUser } from '../data';
import styles from './BaseView.less';

const FormItem = Form.Item;
const { Option } = Select; // 头像组件 方便以后独立，增加裁剪之类的功能

interface SelectItem {
  label: string;
  key: string;
}

interface BaseViewProps extends FormComponentProps {
  currentUser?: CurrentUser;
}

function getBase64(img: any, callback: any) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class BaseView extends Component<BaseViewProps> {
  view: HTMLDivElement | undefined = undefined;

  state = {
    imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    username: '',
    address: '',
    phone: '',
    email: '',
  }

  componentDidMount() {
    // this.setBaseInfo();
    // this.getAvatarContent();
    this.getUserList();
  }

  getAvatarContent = () => {

  }

  getUserList = async () => {  
    const resp = await getLoginUser();
    console.log('resp', resp)
    if (resp.msg === 'ok') {
      const { data: { username, email, address, phone } } = resp.data;
      console.log(username)
      this.setState({
        username,
        email,
        address,
        phone
      }) 
    }
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;

    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach((key) => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields((err) => {
      if (!err) {
        message.success('更新基本信息成功');
      }
    });
  };

  // 头像上传前处理
  handleBefore = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  handleChange = (info: any) => {
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl: string) =>
        this.setState({
          imageUrl,
        }),
      );
      message.success('头像更换成功')
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { imageUrl, username, email, phone, address } = this.state;
    const token = localStorage.getItem('token');
    // 更换头像组件
    const AvatarView = ({ avatar }: { avatar: string }) => (
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
          headers={{ Authorization: token}}
        >
          <div className={styles.button_view}>
            <Button>
              <UploadOutlined />
              更换头像
            </Button>
          </div>
        </Upload>
      </Fragment>
    );
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark autoComplete="off">
            <FormItem label="昵称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的昵称!',
                  },
                ],
                initialValue: username
              })(<Input />)}
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
              {getFieldDecorator('uploadedItems', {
                rules: [
                  {
                    required: true,
                    message: '',
                  },
                ],
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
          <AvatarView avatar={imageUrl} />
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
