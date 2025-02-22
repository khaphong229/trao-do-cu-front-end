import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { searchPost, resetSearch } from '../../../../../../features/client/post/postSlice'
import styles from './scss/SearchBar.module.scss'
import { Card, Input, Select } from 'antd'

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const dispatch = useDispatch()
  const { posts } = useSelector(state => state.post)

  const searchRef = useRef(null)

  useEffect(() => {
    return () => {
      dispatch(resetSearch())
    }
  }, [dispatch])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        dispatch(searchPost(searchTerm.trim()))
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm, dispatch])

  const getSuggestions = () => {
    if (!searchTerm) return []

    let filteredPosts = posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()))

    return filteredPosts.slice(0, 5)
  }

  const handleInputChange = e => {
    const value = e.target.value
    setSearchTerm(value)
    setShowSuggestions(true)
    if (value.trim() === '') {
      dispatch(resetSearch())
    }
  }

  // Xử lý click ra ngoài input để đóng gợi ý
  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className={styles['search-bar']} ref={searchRef}>
      <div className={styles['input-container']}>
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
      </div>
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
