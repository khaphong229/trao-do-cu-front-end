import React from 'react'
import styles from 'pages/Client/Post/PostCategory/scss/PostList.module.scss'
import { Card, Skeleton } from 'antd'

function PostCardRowSkeleton() {
  return (
    <>
      <Card
        className={styles.Card}
        hoverable
        cover={
          <div className={styles.imageWrapper}>
            <Skeleton.Image
              active
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
          </div>
        }
      >
        <div className={styles.Container}>
          <Skeleton.Input active size="small" style={{ width: '100%', marginTop: '8px', marginBottom: '8px' }} />
          <Skeleton.Input
            active
            size="small"
            style={{ width: '100%', marginBottom: '8px' }}
            className={styles.status}
          />
          <div className={styles.TimeRole}>
            <Skeleton.Input active size="small" style={{ width: '100%', marginBottom: '8px' }} />
          </div>
          <div className={styles.User}>
            <div>
              <Skeleton.Avatar active size="small" className={styles.avtUser} />
            </div>
            <Skeleton.Button active size="small" style={{ width: '30%' }} className={styles.ButtonChat} />
          </div>
        </div>
      </Card>
    </>
  )
}

export default PostCardRowSkeleton
