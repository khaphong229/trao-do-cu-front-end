import React, { useState } from 'react'
import { Button, Tooltip } from 'antd'
import {
  PictureOutlined,
  SmileOutlined,
  EnvironmentOutlined,
  WhatsAppOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
// import { CiFacebook } from 'react-icons/ci'
import styles from '../scss/PostToolbar.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  setCategoryModalVisibility,
  setLocationModalVisibility,
  setShowEmoji,
  setSocialLinkModalVisibility
  // updatePostData
} from '../../../../../features/client/post/postSlice'
import UploadCustom from '../../../../../components/common/UploadCustom' // Adjust the import path as needed

const PostToolbar = ({ ref3, ref4, ref5, ref6 }) => {
  const { isShowEmoji, dataCreatePost } = useSelector(state => state.post)
  const dispatch = useDispatch()
  const [fileList, setFileList] = useState([])

  // const handleUploadSuccess = filepaths => {
  //   const newImageUrls = [...dataCreatePost.image_url, ...filepaths]
  //   dispatch(
  //     updatePostData({
  //       image_url: newImageUrls
  //     })
  //   )
  // }

  const uploadButton = (
    <Button
      ref={ref3}
      type="text"
      icon={<PictureOutlined className={styles.iconPicture} />}
      disabled={dataCreatePost.image_url?.length >= 5}
    />
  )

  return (
    <div className={styles.postTools}>
      <div className={styles.toolsText}>Thêm vào bài đăng của bạn</div>
      <div className={styles.toolsButtons}>
        <UploadCustom
          // onUploadSuccess={handleUploadSuccess}
          fileList={fileList}
          setFileList={({ fileList }) => setFileList(fileList)}
          uploadButton={uploadButton}
          maxCount={5 - (dataCreatePost.image_url?.length || 0)}
          disabled={dataCreatePost.image_url?.length >= 5}
        />
        <Button ref={ref4} type="text" onClick={() => dispatch(setSocialLinkModalVisibility(true))}>
          <Tooltip title="Liên kết mạng xã hội" placement="top">
            <WhatsAppOutlined className={styles.customIcon} />
          </Tooltip>
        </Button>
        <Button type="text" onClick={() => dispatch(setShowEmoji(!isShowEmoji))}>
          <Tooltip title="Emoji" placement="top">
            <SmileOutlined className={styles.iconSmile} />
          </Tooltip>
        </Button>
        <Button ref={ref5} type="text" onClick={() => dispatch(setLocationModalVisibility(true))}>
          <Tooltip title="Thêm vị trí" placement="top">
            <EnvironmentOutlined className={styles.iconEnvironment} />
          </Tooltip>
        </Button>
        <Button ref={ref6} type="text" onClick={() => dispatch(setCategoryModalVisibility(true))}>
          <Tooltip title="Chọn danh mục" placement="top">
            <AppstoreOutlined className={styles.iconCategory} />
          </Tooltip>
        </Button>

        {/* <Button type="text" icon={<EllipsisOutlined className={styles.iconEllipsis} />} /> */}
      </div>
    </div>
  )
}

export default PostToolbar
