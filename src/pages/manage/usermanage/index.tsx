import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusSquareFilled } from '@ant-design/icons';
import { Button, Input, Table, Tag, Modal, Form, Select, Card, Icon, message } from 'antd';
import {
  addUser,
  getUserList,
  revokeUser
} from './service'
import styles from './style.less';
import moment from 'moment';

const { Option } = Select;

class userManage extends React.Component {
  state = {
    btnLoading: false,
    modalVisible: false,
    loading: false,
    dataSource: [],
    selectedRowKeys: []

  }

  columns: any[] = [
    {
      title: '用户名',
      dataIndex: 'user_name',
      align: 'center',
    },
    {
      title: '密码',
      dataIndex: 'password',
      align: 'center',
    }, {
      title: '用户类型',
      dataIndex: 'type',
      align: 'center',
      render: (_, record) => record.role === 1 ? "普通用户" : "管理员"
    },
    {
      title: '电话',
      dataIndex: 'phone',
      align: 'center',
    }, {
      title: '创建时间',
      dataIndex: 'created_on',
      render: (text, record) => {
        return moment(new Date(record.created_on)).format('YYYY-MM-DD hh:mm:ss')
      },
      align: 'center',
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'id',
      align: 'center',
      render: (text, record) => {
        return <Tag color="#f50" onClick={() => this.handleRevoke(record.user_name)}><Icon type="poweroff" /><span style={{ color: 'white', marginLeft: 5 }}>注销用户</span></Tag>
      }
    },
  ];

  componentDidMount() {
    this.queryUser();
  }


  onSelectChange = selectedRowKeys => {
    console.log('select', selectedRowKeys)
    this.setState({ selectedRowKeys });
  };


  handleOnCreate = () => {
    this.setState({
      modalVisible: true
    })
  }

  hanleBatchRevoke = () => {
    const { selectedRowKeys } = this.state;
    Modal.confirm({
      title: '操作提示',
      content: '确认批量删除嘛？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const resp = await revokeUser({ user_name: selectedRowKeys });
        if (resp.msg === 'ok' && resp.data.indexOf('fail') === -1) {
          message.success('用户注销成功');
          this.queryUser();
        }
      },
      onCancel: () => { }
    })
  }

  handleRevoke = (name: string) => {
    Modal.confirm({
      title: '操作提示',
      content: '确认注销该用户？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const resp = await revokeUser({ user_name: [name] });
        if (resp.msg === 'ok' && resp.data.indexOf('fail') === -1) {
          message.success('用户注销成功');
          this.queryUser();
        } else {
          message.warning('用户注销失败');
        }
      },
      onCancel: () => { }
    })
  }

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

  queryUser = async () => {
    const resp = await getUserList();
    if (resp.msg === 'ok') {
      this.setState({
        dataSource: resp.data
      })
    }
  }

  handleAddUser = () => {
    const { form } = this.props;
    this.setState({
      btnLoading: true
    })
    form.validateFields(async (err: any, values: any) => {
      if (!err) {
        const { name, password, type, identity } = values;
        const resp = await addUser({ username: name, password, role: type, identity })
        if (resp.msg === 'ok') {
          message.success('新增用户成功');
          this.queryUser();
        } else {
          message.warning('新增用户失败')
        }
        this.setState({
          btnLoading: false,
          modalVisible: false
        })
        form.resetFields();
      }
    })
  }

  render() {
    const { loading, dataSource, modalVisible, selectedRowKeys, btnLoading } = this.state;
    const { form: { getFieldDecorator } } = this.props;
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
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <PageHeaderWrapper
        title="用户管理中心"
      >
        <div className="page-container">
          <Card>
            <div className={styles.toolbar}>
              <Button
                onClick={this.handleOnCreate}
                type="primary"
                icon="plus-square"
                style={{ marginRight: 10 }}
              >
                创建用户
              </Button>
              <Button
                type="danger"
                icon="minus-square"
                onClick={this.hanleBatchRevoke}
              >
                批量注销
              </Button>
            </div>
            <Tabl
              rowKey={(record) => record.user_name}
              loading={loading}
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={dataSource}
              expandedRowRender={record =>
                <>
                  <p><span style={{ fontWeight: 'bold' }}>邮箱:</span>{record.email}</p>
                  <p><span style={{ fontWeight: 'bold' }}>地址:</span>{record.address}</p>
                </>
              }

            // pagination={{
            //   total: data?.total,
            //   pageSize: params.page_size,
            //   current: params.page,
            //   onChange: (page) => {
            //     changeParams((old: any) => {
            //       return { ...old, page: page };
            //     });
            //   },
            //   onShowSizeChange: (_, size) => {
            //     changeParams((old: any) => {
            //       return { ...old, page_size: size };
            //     });
            //   },
            // }}
            />
          </Card>
          <Modal
            title="新增用户"
            visible={modalVisible}
            onCancel={() => this.setState({ modalVisible: false })}
            width={600}
            footer={[
              <Button key="back" onClick={() => this.setState({ modalVisible: false })}>
                取消
                </Button>,
              <Button key="submit" type="primary" onClick={this.handleAddUser} loading={btnLoading}>
                确认
                </Button>,
            ]}
          >
            <Form
              {...formItemLayout}
            >
              <Form.Item label="用户名">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入用户名',
                    },
                  ],
                })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: '输入密码不能为空' },
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
                    { required: true, message: '确认密码不能为空' },
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
              <Form.Item label="用户类型" hasFeedback>
                {getFieldDecorator('type', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ],
                  initialValue: '0'
                })(
                  <Select>
                    <Option value={'0'}>管理员</Option>
                    <Option value={'1'}>普通用户</Option>
                  </Select>)}
              </Form.Item>
              <Form.Item label="用户标识">
                {
                  getFieldDecorator('identity', {
                    rules: [{
                      required: true,
                      message: '请输入用户标识'
                    }]
                  })(<Input prefix={<Icon type="environment" style={{ color: 'rgba(0,0,0,.25)' }} />} />)
                }
              </Form.Item>
            </Form>
          </Modal>
        </div>

      </PageHeaderWrapper>
    )
  }
}

export default Form.create({ name: 'userManage' })(userManage);