import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, Tour, message } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

import {
  updatePostData,
  resetPostData,
  setCreateModalVisibility,
  setShowTour
} from '../../../../features/client/post/postSlice'
import { createPost } from '../../../../features/client/post/postThunks'

import UserInfoSection from './components/UserInfo'
import PostContentEditor from './components/PostContent'
import PostToolbar from './components/PostToolbar'
import LocationModal from './components/Modal/Location'
import FacebookLinkModal from './components/Modal/Contact'

import styles from './scss/CreatePost.module.scss'
import { uploadPostImages } from 'features/upload/uploadThunks'
import CategoryModal from './components/Modal/Category'
import _ from 'lodash'

const TOUR_STORAGE_KEY = 'lastTourShownTime'
const TOUR_COOLDOWN_DAYS = 3

const CreatePostModal = () => {
  const dispatch = useDispatch()
  const [errorPost, setErrorPost] = useState(null)
  const { user } = useSelector(state => state.auth)
  const { dataCreatePost, isCreateModalVisible, isLoadingButton, isShowTour } = useSelector(state => state.post)

  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)
  const ref4 = useRef(null)
  const ref5 = useRef(null)
  const ref6 = useRef(null)

  useEffect(() => {
    if (isCreateModalVisible) {
      checkAndShowTour()
    }
  }, [isCreateModalVisible])

  useEffect(() => {
    if (isCreateModalVisible && user?.address) {
      dispatch(
        updatePostData({
          city: user.address.split(', ').pop(),
          specificLocation: user.address
        })
      )
    }
  }, [isCreateModalVisible, user?.address, dispatch])

  const checkAndShowTour = () => {
    const lastShownTime = localStorage.getItem(TOUR_STORAGE_KEY)
    const currentTime = new Date().getTime()

    if (!lastShownTime) {
      dispatch(setShowTour(true))
      localStorage.setItem(TOUR_STORAGE_KEY, currentTime.toString())
    } else {
      const daysSinceLastShown = (currentTime - parseInt(lastShownTime)) / (1000 * 60 * 60 * 24)

      if (daysSinceLastShown >= TOUR_COOLDOWN_DAYS) {
        dispatch(setShowTour(true))
        localStorage.setItem(TOUR_STORAGE_KEY, currentTime.toString())
      } else {
        dispatch(setShowTour(false))
      }
    }
  }

  const handleTourClose = () => {
    dispatch(setShowTour(false))
  }

  const steps = [
    {
      title: 'Trao tặng/ Trao đổi',
      description: 'Chọn chế độ cần thực hiện.',
      target: () => ref1.current
    },
    {
      title: 'Tiêu đề',
      description: 'Nhập tiêu đề bài đăng.',
      target: () => ref2.current
    },
    {
      title: 'Ảnh, Video',
      description: 'Tải lên ảnh, video.',
      target: () => ref3.current
    },
    {
      title: 'Thông tin liên hệ',
      description: 'Nhập thông tin liên hệ.',
      target: () => ref4.current
    },
    {
      title: 'Địa điểm',
      description: 'Nhập địa điểm của bạn.',
      target: () => ref5.current
    },
    {
      title: 'Danh mục',
      description: 'Nhập danh mục theo đồ của bạn.',
      target: () => ref6.current
    }
  ]

  const handleSubmit = async () => {
    try {
      // if (dataCreatePost.category_id === null) {
      //   _.omit(dataCreatePost, ['category_id'])
      // }
      const response = await dispatch(
        createPost(dataCreatePost.category_id === null ? _.omit(dataCreatePost, ['category_id']) : dataCreatePost)
      ).unwrap()
      const { status, message: msg } = response
      if (status === 201) {
        message.success(msg)
        dispatch(setCreateModalVisibility(false))
        dispatch(resetPostData())
      }
    } catch (error) {
      if (error.status === 400) {
        setErrorPost(error?.detail)
        // Object.values(error.detail).forEach(val => {
        //   if (val === 'ID danh mục sai định dạng.') {
        //     message.error('Vui lòng chọn danh mục cho món đồ!')
        //   } else {
        //     message.error(val)
        //   }
        // })
        let ok = 0
        Object.entries(error.detail).forEach(([field, msg]) => {
          if (field === 'category_id') {
            message.error('Vui lòng chọn danh mục cho món đồ!')
          } else if (field === 'specificLocation' || field === 'city') {
            if (ok === 0) {
              message.error('Vui lòng thêm địa chỉ')
              ok = 1
            }
          } else {
            message.error(msg)
          }
        })
      }
    }
  }

  const handleImageUpload = async files => {
    try {
      await dispatch(uploadPostImages(files)).unwrap()
    } catch (error) {
      message.error('Tải ảnh thất bại')
    }
  }

  return (
    <>
      <Modal
        title="Tạo bài đăng"
        open={isCreateModalVisible}
        onCancel={() => dispatch(setCreateModalVisibility(false))}
        footer={null}
        closeIcon={<CloseOutlined />}
        className={styles.createPostModal}
        width={600}
      >
        <UserInfoSection ref1={ref1} />

        <PostContentEditor
          errorPost={errorPost}
          setErrorPost={setErrorPost}
          ref2={ref2}
          uploadedImages={dataCreatePost.image_url}
          setUploadedImages={handleImageUpload}
        />

        <PostToolbar
          ref3={ref3}
          ref4={ref4}
          ref5={ref5}
          ref6={ref6}
          uploadedImages={dataCreatePost.image_url}
          setUploadedImages={handleImageUpload}
        />

        <Button
          type="primary"
          className={styles.postButton}
          onClick={handleSubmit}
          loading={isLoadingButton}
          disabled={!dataCreatePost.title.trim() || dataCreatePost.image_url.length === 0}
        >
          Đăng
        </Button>
      </Modal>

      <LocationModal
        location={dataCreatePost.specificLocation || user?.address}
        setLocation={specificLocation => dispatch(updatePostData({ specificLocation }))}
      />

      <FacebookLinkModal
        facebookLink={dataCreatePost.facebookLink || ''}
        setFacebookLink={facebookLink => dispatch(updatePostData({ facebookLink }))}
      />

      <CategoryModal
        facebookLink={dataCreatePost.facebookLink || ''}
        setFacebookLink={facebookLink => dispatch(updatePostData({ facebookLink }))}
      />

      <Tour open={isShowTour} onClose={handleTourClose} steps={steps} />
    </>
  )
}

export default CreatePostModal
