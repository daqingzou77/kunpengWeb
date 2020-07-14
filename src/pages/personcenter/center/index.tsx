import {
  Button,
  Card,
  DatePicker,
  Input,
  Checkbox,
  message,
} from 'antd';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import { Dispatch } from 'redux';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { uploadRecord } from './service';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker; 

interface BasicFormProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
}

class BasicForm extends Component<BasicFormProps> {

  state ={
    loading: false
  }

  handleSubmit = (e: React.FormEvent) => {
    const { form } = this.props;
    this.setState({
      loading: true
    })
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const { oper_name, oper_type, date, info, } = values;
        const req = {
          oper_name,
          oper_type: oper_type.join(','),
          start_time: date[0],
          end_time: date[1],
          info
        }
        const resp = await uploadRecord(req);
        if (resp.msg === 'ok') {
          message.success('农事数据上传成功');
          this.setState({
            loading: false
          })
        }
        form.resetFields();
      }
    });
  };
  

  render() {
    const { submitting } = this.props;
    const { loading } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const options = [
      {
        label: '施肥',
        value: '施肥',
      },
      {
        label: '喷药',
        value: '喷药',
      },
      {
        label: '其他',
        value: '其他',
      },
    ];
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
        md: {
          span: 10,
        },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 7,
        },
      },
    };
    return (
      <PageHeaderWrapper title="农事管理数据上传">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="操作名称">
              {getFieldDecorator('oper_name', {
                rules: [
                  {
                    required: true,
                    message: '操作名称不能为空',
                  },
                ],
              })(<Input placeholder="请输入操作行为的名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="操作时间">
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: '操作时间不能为空',
                  },
                ],
              })(
                <RangePicker  placeholder={['开始时间', '结束时间']} />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="操作行为">
              {getFieldDecorator('oper_type', {
                initialValue: 'shifei',
                rules: [
                  {
                    required: true,
                    message: '操作行为不能为空',
                  },
                ],
              })(<Checkbox.Group options={options} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="具体信息">
              {getFieldDecorator('info', {
                rules: [
                  {
                    required: true,
                    message: '具体信息不能为空',
                  },
                ],
              })(
                <TextArea
                  style={{
                    minHeight: 32,
                  }}
                  placeholder="请输入施肥用量、喷药用量等相关具体信息"
                  rows={4}
                />,
              )}
            </FormItem>

            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button
                style={{
                  width: 100,
                }}
                type="primary"
                htmlType="submit"
                loading={loading}
                onClick={this.handleSubmit}
              >
                上传
              </Button>
              <Button
                style={{
                  marginLeft: 20,
                  width: 100,
                }}
                type="danger"
              >
                重置
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<BasicFormProps>()(
  connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
    submitting: loading.effects['formAndbasicForm/submitRegularForm'],
  }))(BasicForm),
);
