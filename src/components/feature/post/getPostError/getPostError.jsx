import { Button, Empty, Typography } from 'antd'
import BoxWrap from 'components/common/BoxWrap'
import React from 'react'
import error from 'assets/images/common/404.webp'
import { ReloadOutlined } from '@ant-design/icons'

export const getPostError = () => {
  return (
    <BoxWrap>
      <Empty
        style={{ textAlign: 'center' }}
        image={error}
        imageStyle={{ height: 200 }}
        description={<Typography.Text>Lỗi xảy ra khi tải bài đăng.</Typography.Text>}
      />
      <Button type="primary" icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
        Tải lại trang
      </Button>
    </BoxWrap>
  )
}
