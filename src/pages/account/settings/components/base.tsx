import { UploadOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Select, Upload, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { connect } from 'dva';
import { CurrentUser } from '../data.d';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import { updateAvartar } from '../service';
import styles from './BaseView.less';

const FormItem = Form.Item;
const { Option } = Select; // 头像组件 方便以后独立，增加裁剪之类的功能


interface SelectItem {
  label: string;
  key: string;
}

const validatorGeographic = (
  _: any,
  value: {
    province: SelectItem;
    city: SelectItem;
  },
  callback: (message?: string) => void,
) => {
  const { province, city } = value;

  if (!province.key) {
    callback('Please input your province!');
  }

  if (!city.key) {
    callback('Please input your city!');
  }

  callback();
};

const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
  const values = value.split('-');

  if (!values[0]) {
    callback('Please input your area code!');
  }

  if (!values[1]) {
    callback('Please input your phone number!');
  }

  callback();
};

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
    imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
   }

  componentDidMount() {
    this.setBaseInfo();
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
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: string) =>
        this.setState({
          imageUrl,
        }),
      );
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { imageUrl } = this.state;
    // 更换头像组件
    const AvatarView = ({ avatar }: { avatar: string }) => (
      <Fragment>
        <div className={styles.avatar_title}>头像</div>
        <div className={styles.avatar}>
          <img src={avatar} alt="avatar" />
        </div>
        <Upload
          action='/api/v1/user/setHeader'
          showUploadList={false}
          // beforeUpload={file => this.handleBefore(file)}
          // onChange={this.handleChange}
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
          <Form layout="vertical" hideRequiredMark>
            <FormItem label="邮箱">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的邮箱!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="昵称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的昵称!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="个人简介">
              {getFieldDecorator('profile', {
                rules: [
                  {
                    required: true,
                    message: '请输入个人简介!',
                  },
                ],
              })(<Input.TextArea placeholder="个人简介" rows={4} />)}
            </FormItem>
            <FormItem label="国家/地区">
              {getFieldDecorator('country', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的国家或地区!',
                  },
                ],
              })(
                <Select
                  style={{
                    maxWidth: 220,
                  }}
                >
                  <Option value="China">中国</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="所在省市">
              {getFieldDecorator('geographic', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的所在省市!',
                  },
                  {
                    validator: validatorGeographic,
                  },
                ],
              })(<GeographicView />)}
            </FormItem>
            <FormItem label="街道地址">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的街道地址!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="联系电话">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的联系电话!',
                  },
                  {
                    validator: validatorPhone,
                  },
                ],
              })(<PhoneView />)}
            </FormItem>
            {/* <Button type="primary" onClick={this.handlerSubmit}>
              更新基本信息
            </Button> */}
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
