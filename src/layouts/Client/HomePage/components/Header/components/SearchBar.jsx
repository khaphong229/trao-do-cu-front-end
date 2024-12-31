import React, { useState, useEffect } from 'react'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import styles from './scss/SearchBar.module.scss'
import { useDispatch } from 'react-redux'
import { searchPost, resetSearch } from '../../../../../../features/client/post/postSlice'

const SearchBar = () => {
  const [tempQuery, setTempQuery] = useState('')
  const [query, setQuery] = useState('')
  const dispatch = useDispatch()
  useEffect(() => {
    return () => {
      dispatch(resetSearch())
    }
  }, [dispatch])

  const handleSearch = () => {
    const trimmedQuery = tempQuery.trim()
    setQuery(trimmedQuery)
    if (trimmedQuery) {
      dispatch(searchPost(trimmedQuery))
    }
  }

  return (
    <Input
      placeholder="Tìm kiếm bài đăng..."
      prefix={<SearchOutlined />}
      size="middle"
      className={styles.SearchBar}
      value={tempQuery}
      onChange={e => setTempQuery(e.target.value)}
      onPressEnter={handleSearch}
    />
  )
}

export default SearchBar
