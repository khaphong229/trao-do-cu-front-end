import React, { useState, useEffect } from 'react'

import { Search } from 'lucide-react'

import { useDispatch, useSelector } from 'react-redux'
import { searchPost, resetSearch } from '../../../../../../features/client/post/postSlice'
import styles from './scss/SearchBar.module.scss'
import { Card, Input } from 'antd'
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const dispatch = useDispatch()

  // Giả sử bạn có một selector để lấy danh sách bài đăng
  const posts = useSelector(state => state.post.posts)

  useEffect(() => {
    // Reset search khi component unmount
    return () => {
      dispatch(resetSearch())
    }
  }, [dispatch])

  // Xử lý tìm kiếm real-time khi người dùng gõ
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        dispatch(searchPost(searchTerm.trim()))
      }
    }, 300) // Delay 300ms để tránh gọi API quá nhiều

    return () => clearTimeout(delayDebounce)
  }, [searchTerm, dispatch])

  // Lọc suggestions dựa trên searchTerm
  const getSuggestions = () => {
    if (!searchTerm) return []
    return posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5) // Giới hạn 5 gợi ý
  }
  const handleInputChange = e => {
    const value = e.target.value
    setSearchTerm(value) // Cập nhật nội dung tìm kiếm
    if (value.trim() === '') {
      dispatch(resetSearch()) // Xóa kết quả tìm kiếm nếu không có từ khóa
    }
  }

  return (
    <div className={styles['search-bar']}>
      <div className={styles['input-wrapper']}>
        <Input
          type="text"
          placeholder="Tìm kiếm bài đăng..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className={styles['input']}
        />
        <Search className={styles['search-icon']} />
      </div>

      {/* Phần hiển thị gợi ý */}
      {showSuggestions && searchTerm && (
        <Card className={styles['suggestions']}>
          {getSuggestions().map((post, index) => (
            <div
              key={post.id || index}
              className={styles['suggestion-item']}
              onClick={() => {
                setSearchTerm(post.title)
                setShowSuggestions(false)
                dispatch(searchPost(post.title))
              }}
            >
              <p className={styles['title']}>{post.title}</p>
            </div>
          ))}
          {getSuggestions().length === 0 && <div className={styles['no-results']}>Không tìm thấy kết quả</div>}
        </Card>
      )}
    </div>
  )
}

export default SearchBar
