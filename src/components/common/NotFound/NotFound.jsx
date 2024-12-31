import React from 'react'
import { Button, Result } from 'antd'

const NotFound = () => (
  <Result
    status="500"
    title="500"
    subTitle="Xin lỗi, có gì đó hoạt động không đúng!"
    extra={<Button type="primary">Quay trở lại Trang chủ</Button>}
  />
)

export default NotFound
