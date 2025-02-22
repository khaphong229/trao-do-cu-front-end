import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { searchPost, resetSearch, setSortOrder, setCityFilter } from '../../../../../../features/client/post/postSlice'
import styles from './scss/SearchBar.module.scss'
import { Card, Input, Select } from 'antd'
import { locationService } from 'services/client/locationService'

const { Option } = Select

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null)
  const [VIETNAMESE_CITIES, SET_VIETNAMESE_CITIES] = useState(null)

  const fetchCity = useCallback(async () => {
    try {
      const data = await locationService.getCity()
      if (data.data.status === 200) {
        SET_VIETNAMESE_CITIES(data.data.data)
      }
    } catch (error) {
      if (error.response.data.status === 404) {
        throw error
      }
    }
  }, [])

  useEffect(() => {
    fetchCity()
  }, [fetchCity])

  const dispatch = useDispatch()
  const { posts, sortOrder } = useSelector(state => state.post)

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

    filteredPosts = filteredPosts.sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    )

    return filteredPosts.slice(0, 5)
  }

  const handleSortChange = value => {
    dispatch(setSortOrder(value)) // ✅ Chỉ cập nhật sortOrder
  }

  const handleCityChange = value => {
    setSelectedCity(value)
    dispatch(setCityFilter(value)) // ✅ Chuyển setCityFilter vào đây
  }

  const handleInputChange = e => {
    const value = e.target.value
    setSearchTerm(value)
    setShowSuggestions(true)
    if (value.trim() === '') {
      dispatch(resetSearch())
    }
  }

  const filterProvinces = (input, option) => {
    return option.label.toLowerCase().includes(input.toLowerCase())
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
        <div className={styles['filters']}>
          <Select value={sortOrder} onChange={handleSortChange} className={styles['select']}>
            <Option value="newest">Bài đăng mới nhất</Option>
            <Option value="oldest">Bài đăng cũ nhất</Option>
          </Select>
          <Select
            showSearch
            style={{ width: 150 }}
            placeholder="Chọn thành phố"
            value={selectedCity}
            optionFilterProp="children"
            filterOption={filterProvinces}
            onChange={handleCityChange}
            options={VIETNAMESE_CITIES} // ✅ Sửa lỗi options
            allowClear
          />
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
