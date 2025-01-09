import React from 'react'
import styles from './styles.module.scss'

function BoxWrap({ children }) {
  return <div className={styles.boxWrap}>{children}</div>
}

export default BoxWrap
