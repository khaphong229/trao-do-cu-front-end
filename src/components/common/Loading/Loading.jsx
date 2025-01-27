import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { CSSTransition } from 'react-transition-group'
import './styles.scss'

const FullScreenLoading = ({ isVisible = true }) => {
  return (
    <CSSTransition in={isVisible} timeout={150} classNames="loading-screen" unmountOnExit mountOnEnter>
      <div className="full-screen-loading">
        <Spin spinning={true} size="large" indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}></Spin>
      </div>
    </CSSTransition>
  )
}

export default FullScreenLoading
