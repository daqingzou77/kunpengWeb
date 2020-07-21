import { Form } from '@ant-design/compatible';
import React, { Component } from 'react';
import { Modal, Input, Icon, message } from 'antd';
import {
  updateUserPwd
} from '@/services/login';


class UpdateModal extends React.Component {

   compareToFirstPassword = (_, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('new_password')) {
      callback('两次密码不一致');
    } else {
      callback();
    }
  };

  validateToNextPassword = (_, value, callback) => {
    const { form } = this.props;
    if (value) {
      form.validateFields(['new_passwordConfirm'], { force: true });
    }
    callback();
  };

  handleUpdatePwd = () => {
    const { form, cancelVisible } = this.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        const { new_password, old_password } = values;
        const resp = await updateUserPwd({
          new_password,
          old_password
        })
        if (resp.msg === 'ok') {
          message.success('当前用户密码修改成功！')
        } else {
          message.error(resp.msg)
        }
        form.resetFields();
        cancelVisible()
      }
    })
  }

   render() {
     const { form: { getFieldDecorator }, visible, cancelVisible } = this.props;
     return (
       <Modal
         visible={visible}
         title="修改密码"
         okText="确认"
         cancelText="取消"
         onOk={this.handleUpdatePwd}
         onCancel={() => cancelVisible()}
       >
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="旧密码">
              {getFieldDecorator('old_password', {
                rules: [{ required: true, message: '用户名不能为空' }],
              })(
                <Input
                  placeholder="请输入旧密码"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
              )}
            </Form.Item>
            <Form.Item label="新密码">
              {getFieldDecorator('new_password', {
                rules: [
                  { required: true, message: '密码不能为空' },
                  {
                    validator: this.validateToNextPassword,
                  }
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="请输入新密码"
                />
              )}
            </Form.Item>
            <Form.Item label="确认密码">
              {getFieldDecorator('new_passwordConfirm', {
                rules: [
                  { required: true, message: '密码不能为空' },
                  {
                    validator: this.compareToFirstPassword,
                  }
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="请输入确认密码"
                />
              )}
            </Form.Item>
          </Form>
       </Modal>
     )
   }
}

export default Form.create({name: 'update'})(UpdateModal);