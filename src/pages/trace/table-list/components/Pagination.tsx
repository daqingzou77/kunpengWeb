import React from 'react';
import { Button, Icon, message } from 'antd';
import { first } from 'lodash';

export default class Pagination extends React.Component {
  state = {
    firstBook: ''
  }

  componentDidMount() {
  }


  handleUp = () => {
    const { type, handleSensorPage, preBook } = this.props;
    if (preBook) {
      handleSensorPage(preBook)
    }
  }

  handleDown = () => {
    const { type, handleSensorPage, nextBook } = this.props;
    if (nextBook) {
      handleSensorPage(nextBook)
    }
  }

  render() {
    const { nextBook, preBook } = this.props;
    return (
      <div style={{ float: 'right', marginTop: 10 }}>
        <Button disabled={preBook ? false : true} style={{ marginRight: 10 }} onClick={this.handleUp}><Icon type="left" /> 上一页</Button>
        <Button disabled={nextBook ? false : true} onClick={this.handleDown}><Icon type="right" /> 下一页</Button>
      </div>
    )
  }
}