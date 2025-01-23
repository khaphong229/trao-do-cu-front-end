import React from 'react'
import { Row, Col, Skeleton, Divider } from 'antd'
import styles from './PostDetailSkeleton.module.scss'

const PostDetailSkeleton = () => {
  return (
    <Row gutter={32}>
      <Col xs={24} md={12}>
        <Skeleton.Image active className={styles.mainImageSkeleton} />

        <Row gutter={16} style={{ marginTop: '20px' }}>
          {[1, 2, 3, 4].map((_, index) => (
            <Col key={index} span={6}>
              <Skeleton.Image active className={styles.thumbnailSkeleton} />
            </Col>
          ))}
        </Row>
      </Col>

      <Col xs={24} md={12}>
        <Skeleton paragraph={false} title={{ width: '70%' }} active className={styles.titleSkeleton} />

        <Skeleton paragraph={false} title={{ width: '40%' }} active className={styles.statusSkeleton} />

        <div>
          <Skeleton paragraph={false} title={{ width: '60%' }} active className={styles.locationSkeleton} />
          <Skeleton paragraph={false} title={{ width: '50%' }} active className={styles.timeSkeleton} />
        </div>

        <Row gutter={15} className={styles.buttonsSkeleton}>
          <Col span={12}>
            <Skeleton.Button active block />
          </Col>
          <Col span={12}>
            <Skeleton.Button active block />
          </Col>
        </Row>

        <Divider />

        <div className={styles.sellerInfoSkeleton}>
          <div className={styles.userInfoSkeleton}>
            <Skeleton avatar paragraph={{ rows: 2 }} active className={styles.userDetailsSkeleton} />

            <div className={styles.userRatingSkeleton}>
              <Skeleton paragraph={false} title={{ width: '80%' }} active />
            </div>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default PostDetailSkeleton
