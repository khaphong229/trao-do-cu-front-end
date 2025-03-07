import { Empty, Typography } from 'antd'
import BoxWrap from 'components/common/BoxWrap'
import React from 'react'

export const notFoundPost = () => {
  return (
    <BoxWrap>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ textAlign: 'center' }}
        description={<Typography.Text>Không tìm thấy bài đăng nào!</Typography.Text>}
      />
    </BoxWrap>
  )
}
