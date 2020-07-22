import React from 'react';
import { Button, Icon } from 'antd';

export default class Pagination extends React.Component {
  state = {
    firstBook: ''
  }

  componentDidMount() {
  }


  handleUp = (e: any) => {
    e.preventDefault();
    const { type, preBookArray, nextBook, firstBook, handleSensorPage, handlePicPage, handleFarmPage } = this.props;
    if (preBookArray.length > 1) {
      if (!nextBook) {
        if (type === 'sensor') {
          handleSensorPage(firstBook, 'up');
        } else if (type === 'pic') {
          handlePicPage(firstBook, 'up');
        } else if (type === 'farm') {
          handleFarmPage(firstBook, 'up');
        }
      } else {
        if (type === 'sensor') {
          handleSensorPage(preBookArray[preBookArray.length - 2], 'up');
        } else if (type === 'pic') {
          handlePicPage(preBookArray[preBookArray.length - 2], 'up');
        } else if (type === 'farm') {
          handleFarmPage(preBookArray[preBookArray.length - 2], 'up');
        }
      }
    }
  }


  handleDown = (e: any) => {
    e.preventDefault();
    const { type, nextBook, handleSensorPage, handlePicPage, handleFarmPage } = this.props;
    if(nextBook){
        if (type === 'sensor') {
          handleSensorPage(nextBook, 'down');
        } else if (type === 'pic'){
          handlePicPage(nextBook, 'down');
        } else if (type === 'farm') {
          handleFarmPage(nextBook, 'down')
        } 
    }
  }

  render() {
    const { nextBook, preBookArray } = this.props;
    return (
      <>
        <Button disabled={preBookArray.length > 1 ? false : true} style={{ marginRight: 10 }} onClick={e => this.handleUp(e)}><Icon type="left" /> 
           {!nextBook && preBookArray.length > 1 ? '返回首页': '上一页' }
        </Button>
        <Button disabled={nextBook ? false : true} onClick={e => this.handleDown(e)}><Icon type="right" /> 下一页</Button>
      </>
    )
  }
}