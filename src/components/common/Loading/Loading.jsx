import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { CSSTransition } from 'react-transition-group'
import './styles.scss'

const FullScreenLoading = ({ isVisible = true }) => {
  return (
    <CSSTransition
      in={isVisible}
      timeout={300}
      classNames="loading-screen"
      unmountOnExit
      mountOnEnter // Add this to ensure proper mounting
    >
      <div className="full-screen-loading">
        <Spin spinning={true} size="large" indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}>
          {/* <div style={{ color: 'white' }} /> */}
        </Spin>
      </div>
    </CSSTransition>
  )
}

export default FullScreenLoading
