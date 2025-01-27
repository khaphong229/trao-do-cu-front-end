import React from 'react'
import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

const NotFound = () => (
  <Result
    status="500"
    title="500"
    subTitle="Xin lỗi, có gì đó hoạt động không đúng!"
    extra={
      <Button type="primary">
        <Link to="/">Quay trở lại Trang chủ</Link>
      </Button>
    }
  />
)

export default NotFound
