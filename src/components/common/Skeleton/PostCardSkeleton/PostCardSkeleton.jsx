import { Card, Skeleton } from 'antd'
import styles from 'pages/Client/Home/scss/PostNews.module.scss'

export const PostCardSkeleton = ({ isPtit = false }) => (
  <Card
    hoverable
    style={isPtit ? { height: 280 } : {}}
    className={styles.itemCard}
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
    <div className={styles.cardContent}>
      <Skeleton.Input
        active
        size="small"
        style={{ width: '100%', marginTop: '8px', marginBottom: '8px' }}
        className={styles.itemTitle}
      />
      <Skeleton.Input active size="small" style={{ width: '100%', marginBottom: '8px' }} className={styles.itemDesc} />
      <div className={styles.statusRow}>
        <Skeleton.Button active size="small" style={{ width: '30%' }} />
        <Skeleton.Button active size="small" style={{ width: '30%' }} />
      </div>
      <div className={styles.locationRow}>
        <div className={styles.userGroup}>
          <Skeleton.Avatar active size="small" className={styles.avtUser} />
        </div>
        <Skeleton.Input active size="small" style={{ width: '80px' }} />
      </div>
    </div>
  </Card>
)
