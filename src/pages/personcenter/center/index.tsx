import {
  Button,
  Card,
  DatePicker,
  Input,
  Checkbox,
} from 'antd';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import { Dispatch } from 'redux';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;

interface BasicFormProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
}

class BasicForm extends Component<BasicFormProps> {

  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'formAndbasicForm/submitRegularForm',
          payload: values,
        });
      }
    });
  };
  

  render() {
    const { submitting } = this.props;
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
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'formandbasic-form.title.required',
                  },
                ],
              })(<Input placeholder="请输入操作行为的名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="操作时间">
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: 'formandbasic-form.date.required',
                  },
                ],
              })(
                <DatePicker
                  style={{
                    width: '100%',
                  }}
                  placeholder="请选择操作日期"
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="操作行为">
              {getFieldDecorator('operations', {
                initialValue: 'shifei',
                rules: [
                  {
                    required: true,
                    message: 'formandbasic-form.date.required',
                  },
                ],
              })(<Checkbox.Group options={options} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="具体信息">
              {getFieldDecorator('goal', {
                rules: [
                  {
                    required: true,
                    message: 'formandbasic-form.goal.required',
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
                loading={submitting}
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
