import { Empty, Typography } from 'antd'
import BoxWrap from 'components/common/BoxWrap'
import React from 'react'
import nodata from 'assets/images/common/no-data.png'

export const notFoundPost = () => {
  return (
    <BoxWrap>
      <Empty
        style={{ textAlign: 'center' }}
        image={nodata}
        imageStyle={{ height: 200 }}
        description={<Typography.Text>Không tìm thấy bài đăng nào!</Typography.Text>}
      />
    </BoxWrap>
  )
}
