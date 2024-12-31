import React, { useState } from 'react'
import { Button } from 'antd'
import {
  PictureOutlined,
  SmileOutlined,
  EnvironmentOutlined,
  EllipsisOutlined,
  WhatsAppOutlined
} from '@ant-design/icons'
import styles from '../scss/PostToolbar.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import UploadCustom from 'components/common/UploadCustom'
import {
  setLocationModalVisible,
  setShowEmoji,
  setSocialLinkModalVisible
} from 'features/client/request/exchangeRequest/exchangeRequestSlice'

const PostToolbar = () => {
  const { isShowEmoji, requestData } = useSelector(state => state.exchangeRequest)
  const dispatch = useDispatch()
  const [fileList, setFileList] = useState([])

  const uploadButton = (
    <Button
      type="text"
      icon={<PictureOutlined className={styles.iconPicture} />}
      disabled={requestData.image_url?.length >= 5}
    />
  )

  return (
    <div className={styles.postTools}>
      <div className={styles.toolsText}>Thêm vào biểu mẫu của bạn</div>
      <div className={styles.toolsButtons}>
        <UploadCustom
          type="exchange"
          fileList={fileList}
          setFileList={({ fileList }) => setFileList(fileList)}
          uploadButton={uploadButton}
          maxCount={5 - (requestData.image_url?.length || 0)}
          disabled={requestData.image_url?.length >= 5}
        />
        <Button
          type="text"
          icon={<WhatsAppOutlined className={styles.customIcon} />}
          onClick={() => dispatch(setSocialLinkModalVisible(true))}
        />
        <Button
          type="text"
          icon={<SmileOutlined className={styles.iconSmile} />}
          onClick={() => dispatch(setShowEmoji(!isShowEmoji))}
        />
        <Button
          type="text"
          icon={<EnvironmentOutlined className={styles.iconEnvironment} />}
          onClick={() => dispatch(setLocationModalVisible(true))}
        />
        <Button type="text" icon={<EllipsisOutlined className={styles.iconEllipsis} />} />
      </div>
    </div>
  )
}

export default PostToolbar
