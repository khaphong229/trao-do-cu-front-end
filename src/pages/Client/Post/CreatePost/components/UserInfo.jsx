import React from 'react'
import { Avatar, Button, Radio } from 'antd'
import styles from '../scss/UserInfo.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setEdittingAddress, updatePostData } from 'features/client/post/postSlice'
import avt from 'assets/images/logo/avtDefault.webp'
import { URL_SERVER_IMAGE } from 'config/url_server'
import { EnvironmentOutlined, RightOutlined } from '@ant-design/icons'
const UserInfo = ({ contentType, ref1 }) => {
  const dispatch = useDispatch()
  const { dataCreatePost } = useSelector(state => state.post)

  const { user } = useSelector(state => state.auth)
  return (
    <>
      <div className={styles.addressDefaultWrap} onClick={() => dispatch(setEdittingAddress(true))}>
        <div className={styles.textAddress}>
          {' '}
          <EnvironmentOutlined className={styles.iconLocation} />
          {user.address}
        </div>
        <Button type="text" icon={<RightOutlined />} />
      </div>
      <div className={styles.userInfo}>
        <Avatar size={40} src={user?.avatar ? `${URL_SERVER_IMAGE}${user.avatar}` : avt} />
        <div className={styles.userDetails}>
          <div className={styles.textWrapper}>
            <div className={styles.username}>{user.name}</div>
            {/* <div className={styles.infoMore}>
              {dataCreatePost.city && <span className={styles.cityText}>{dataCreatePost.city}</span>}
              {dataCreatePost.category_id && (
                <span className={styles.categoryText}>{` - ${selectedCategory?.title || ''}`}</span>
              )}
            </div> */}
          </div>
          {contentType === 'post' && (
            <Radio.Group
              ref={ref1}
              className={styles.radioWrap}
              value={dataCreatePost.type}
              onChange={e => dispatch(updatePostData({ type: e.target.value }))}
              style={{ marginLeft: 10 }}
            >
              <Radio value="gift" className={styles.text}>
                Trao Tặng
              </Radio>
              <Radio value="exchange" className={styles.text}>
                Trao Đổi
              </Radio>
            </Radio.Group>
          )}
        </div>
      </div>
    </>
  )
}

export default UserInfo
