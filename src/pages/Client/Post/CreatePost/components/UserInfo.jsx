import React from 'react'
import { Avatar, Radio } from 'antd'
import styles from '../scss/UserInfo.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { updatePostData } from 'features/client/post/postSlice'
import avt from 'assets/images/logo/avtDefault.webp'
import { URL_SERVER_IMAGE } from 'config/url_server'
const UserInfo = ({ title, ref1 }) => {
  const dispatch = useDispatch()
  const { dataCreatePost } = useSelector(state => state.post)
  const { selectedCategory } = useSelector(state => state.category)
  const { user } = useSelector(state => state.auth)
  return (
    <div className={styles.userInfo}>
      <Avatar size={40} src={user?.avatar ? `${URL_SERVER_IMAGE}${user.avatar}` : avt} />
      <div className={styles.userDetails}>
        <div className={styles.textWrapper}>
          <div className={styles.username}>{user.name}</div>
          <div className={styles.infoMore}>
            {dataCreatePost.city && <span className={styles.cityText}>{dataCreatePost.city}</span>}
            {dataCreatePost.category_id && (
              <span className={styles.categoryText}>{` - ${selectedCategory.title}`}</span>
            )}
          </div>
        </div>
        {title !== 'Biểu mẫu trao đổi' && (
          <Radio.Group
            ref={ref1}
            value={dataCreatePost.type}
            onChange={e => dispatch(updatePostData({ type: e.target.value }))}
            style={{ marginLeft: 10 }}
          >
            <Radio value="gift">Trao Tặng</Radio>
            <Radio value="exchange">Trao Đổi</Radio>
          </Radio.Group>
        )}
      </div>
    </div>
  )
}

export default UserInfo
