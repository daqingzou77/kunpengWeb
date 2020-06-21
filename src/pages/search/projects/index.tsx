import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Col, List, Row, Select, Typography, DatePicker, Input, Pagination } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { connect } from 'dva';
import moment from 'moment';
import AvatarList from './components/AvatarList';
import { StateType } from './model';
import { ListItemDataType } from './data';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import styles from './style.less';


interface ProjectsProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  listAndsearchAndprojects: StateType;
  loading: boolean;
}

const getKey = (id: string, index: number) => `${id}-${index}`;

class Projects extends Component<ProjectsProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndsearchAndprojects/fetch',
      payload: {
        count: 8,
      },
    });
  }

  render() {
    const {
      // listAndsearchAndprojects: { list = [] },
      listAndsearchAndprojects: { list = [] },

      loading,
    } = this.props;

    const cardList = list && (
      <List<ListItemDataType>
        rowKey="id"
        loading={loading}
        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Card
              className={styles.card}
              hoverable
              cover={<img alt={item.title} src={item.cover} height={124} width={207} />}
            >
              <Card.Meta
                title='存证哈希'
                description={
                  <Typography.Text copyable ellipsis>{item.subDescription}</Typography.Text>
                }
              />
              <div className={styles.cardItemContent}>
                <span>图片时刻：{moment(item.updatedAt).format('YYYY/MM/DD hh:mm:ss')}</span>
              </div>
            </Card>
          </List.Item>
        )}
      />
    );

    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <DatePicker 
          defaultValue={moment(new Date(), 'YYYY/MM/DD')}
          format='YYYY/MM/DD' 
          size="large"
          style={{ maxWidth: 322, width: '100%', marginRight: 10 }}
        />
        <Input.Search
          placeholder="请输入园林采集点"
          enterButton="搜索"
          size="large"
          onSearch={()=>{
          }}
          style={{ maxWidth: 322, width: '100%' }}
        />
      </div>
    );

    return (
      // <PageHeaderWrapper
      //   content={mainSearch}
      // >
        <div className={styles.coverCardList}>
          <Card 
            bordered={false}
            extra={<a href='#'>Reload</a>}
            title='图片数据详情'
          >
            <div className={styles.cardList}>{cardList}</div>
            <div style={{ textAlign: 'center' }}><Pagination defaultCurrent={1} total={50} /></div>
          </Card>
        </div>
      // </PageHeaderWrapper>
    );
  }
}

const WarpForm = Form.create<ProjectsProps>({
  onValuesChange({ dispatch }: ProjectsProps) {
    // 表单项变化时请求数据
    // 模拟查询表单生效
    dispatch({
      type: 'listAndsearchAndprojects/fetch',
      payload: {
        count: 8,
      },
    });
  },
})(Projects);

export default connect(
  ({
    listAndsearchAndprojects,
    loading,
  }: {
    listAndsearchAndprojects: StateType;
    loading: { models: { [key: string]: boolean } };
  }) => ({
    listAndsearchAndprojects,
    loading: loading.models.listAndsearchAndprojects,
  }),
)(WarpForm);
