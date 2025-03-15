import React, { useEffect, useState } from 'react'
import { message, Button, List, Radio, Space, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setEdittingAddress, updatePostData } from 'features/client/post/postSlice'
import AddressSelection from 'components/common/AddressSelection'
import { PlusOutlined, DeleteOutlined, EditOutlined, LeftOutlined } from '@ant-design/icons'
import styles from '../../scss/LocationModal.module.scss'
import { updateUserProfile } from '../../../../../../features/auth/authThunks'

const { Text } = Typography

const Location = ({ location, setLocation }) => {
  const dispatch = useDispatch()
  const [fullAddress, setFullAddress] = useState('')
  const [editingIndex, setEditingIndex] = useState(-1) // -1 means not editing any existing address
  const [initialAddress, setInitialAddress] = useState('')
  const [addresses, setAddresses] = useState([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const { user } = useSelector(state => state.auth)

  // Tạo khóa localStorage duy nhất cho mỗi người dùng
  const getStorageKeyForUser = key => {
    if (!user || !user.id) return null
    return `${key}_${user.id}`
  }

  // Hàm lưu danh sách địa chỉ vào localStorage
  const saveAddressesToStorage = addressesList => {
    if (user && user.id) {
      const userAddressesKey = getStorageKeyForUser('savedAddresses')
      if (userAddressesKey) {
        localStorage.setItem(userAddressesKey, JSON.stringify(addressesList))
        console.log('Đã lưu địa chỉ vào localStorage:', addressesList)
      }
    }
  }

  // Hàm tải danh sách địa chỉ từ localStorage
  const loadAddressesFromStorage = () => {
    if (user && user.id) {
      const userAddressesKey = getStorageKeyForUser('savedAddresses')
      const savedAddresses = localStorage.getItem(userAddressesKey)
      if (savedAddresses) {
        try {
          const parsedAddresses = JSON.parse(savedAddresses)
          if (Array.isArray(parsedAddresses)) {
            return parsedAddresses
          }
        } catch (e) {
          console.error('Error parsing saved addresses:', e)
        }
      }
    }
    return []
  }

  // Tải địa chỉ từ localStorage khi component được mount hoặc user thay đổi
  useEffect(() => {
    const loadedAddresses = loadAddressesFromStorage()
    setAddresses(loadedAddresses)
  }, [user])

  // Xử lý khi location prop thay đổi
  useEffect(() => {
    if (location && user && user.id) {
      setFullAddress(location)
      setInitialAddress(location)

      const locationIndex = addresses.findIndex(addr => addr.address === location)

      if (locationIndex !== -1) {
        // Nếu địa chỉ đã tồn tại, đặt nó làm mặc định
        handleSetDefaultAddress(locationIndex)
      } else {
        // Nếu địa chỉ chưa tồn tại, thêm vào danh sách
        const newAddress = {
          address: location,
          isDefault: addresses.length === 0 // Nếu không có địa chỉ nào, đặt làm mặc định
        }
        const newAddresses = [...addresses, newAddress]
        setAddresses(newAddresses)
        saveAddressesToStorage(newAddresses)
      }
    }
  }, [location, user])

  // Hiển thị form địa chỉ nếu không có location
  useEffect(() => {
    setShowAddressForm(!location)
  }, [location])

  const handleAddressChange = address => {
    setFullAddress(address)
  }

  const handleAddAddress = () => {
    if (!fullAddress) {
      message.error('Vui lòng chọn đầy đủ thông tin địa điểm')
      return
    }

    const newAddress = {
      address: fullAddress,
      isDefault: addresses.length === 0 // Nếu không có địa chỉ nào, đặt làm mặc định
    }

    const newAddresses = [...addresses, newAddress]
    setAddresses(newAddresses)
    saveAddressesToStorage(newAddresses)

    setShowAddressForm(false)
    setFullAddress('')
    message.success('Đã lưu địa chỉ thành công!')
  }

  const handleEditAddress = index => {
    setEditingIndex(index)
    setFullAddress(addresses[index].address)
    setShowAddressForm(true)
  }

  const handleCancelEdit = () => {
    setEditingIndex(-1)
    setFullAddress('')
    setShowAddressForm(false)
  }

  const handleAddNewAddress = () => {
    setShowAddressForm(true)
    setFullAddress('')
    setEditingIndex(-1)
  }

  const handleDeleteAddress = index => {
    if (addresses.length === 1) {
      message.warning('Bạn không thể xóa địa chỉ duy nhất')
      return
    }

    const newAddresses = addresses.filter((_, i) => i !== index)
    setAddresses(newAddresses)
    saveAddressesToStorage(newAddresses)

    if (addresses[index].isDefault && newAddresses.length > 0) {
      newAddresses[0].isDefault = true // Đặt địa chỉ đầu tiên làm mặc định
      saveAddressesToStorage(newAddresses)
    }

    message.success('Đã xóa địa chỉ thành công')
  }

  const handleSetDefaultAddress = index => {
    const newAddresses = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }))
    setAddresses(newAddresses)
    saveAddressesToStorage(newAddresses)
  }

  const handleLocationSave = async () => {
    const selectedAddress = addresses.find(addr => addr.isDefault)
    if (!selectedAddress) {
      message.error('Vui lòng chọn hoặc thêm ít nhất một địa chỉ')
      return
    }

    const addressParts = selectedAddress.address.split(', ')
    const city = addressParts[addressParts.length - 1]

    await dispatch(
      updatePostData({
        city,
        specificLocation: selectedAddress.address
      })
    )

    if (setLocation) {
      setLocation(selectedAddress.address)
    }

    if (selectedAddress.address !== initialAddress) {
      try {
        const response = await dispatch(
          updateUserProfile({
            name: user.name,
            email: user.email,
            address: selectedAddress.address,
            phone: user.phone
          })
        ).unwrap()

        if (response.status === 201) {
          message.success('Cập nhật địa chỉ thành công!')
          setInitialAddress(selectedAddress.address)
        }
      } catch (error) {
        if (error.status === 400) {
          Object.values(error.detail).forEach(val => {
            message.error(String(val)) // Ensure this is a string
          })
        }
      }
    }

    // Quay về phần tạo bài đăng sau khi lưu địa chỉ
    dispatch(setEdittingAddress(false))
  }

  return (
    <div className={styles.locationWrapper}>
      <Button icon={<LeftOutlined />} onClick={() => dispatch(setEdittingAddress(false))}>
        Quay lại
      </Button>
      <Typography.Title level={4} style={{ margin: '10px 0' }}>
        Danh sách địa chỉ
      </Typography.Title>

      {addresses.length > 0 && (
        <List
          className={styles.addressList}
          itemLayout="horizontal"
          dataSource={addresses}
          renderItem={(address, index) => (
            <List.Item
              actions={[
                <EditOutlined key="edit" onClick={() => handleEditAddress(index)} style={{ color: '#1890ff' }} />,
                <DeleteOutlined key="delete" onClick={() => handleDeleteAddress(index)} style={{ color: '#ff4d4f' }} />
              ]}
            >
              <List.Item.Meta
                avatar={<Radio checked={address.isDefault} onChange={() => handleSetDefaultAddress(index)} />}
                title={
                  address.isDefault ? (
                    <Text style={{ color: 'green' }}>Địa chỉ mặc định</Text>
                  ) : (
                    <Text strong>Chọn làm địa chỉ mặc định</Text>
                  )
                }
                description={address.address}
              />
            </List.Item>
          )}
        />
      )}

      {showAddressForm ? (
        <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
          <Typography.Title level={5}>{editingIndex >= 0 ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</Typography.Title>
          <AddressSelection
            initialAddress={editingIndex >= 0 ? addresses[editingIndex].address : ''}
            onAddressChange={handleAddressChange}
            isEditing={true}
          />
          <Space>
            <Button type="primary" onClick={handleAddAddress}>
              {editingIndex >= 0 ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
            </Button>
            <Button onClick={handleCancelEdit}>Hủy</Button>
          </Space>
        </Space>
      ) : (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAddNewAddress}
          style={{ marginTop: 16, width: '100%' }}
        >
          Thêm địa chỉ mới
        </Button>
      )}

      {addresses.length > 0 && (
        <Button type="primary" onClick={handleLocationSave} style={{ marginTop: 16, width: '100%' }}>
          Lưu và sử dụng địa chỉ này
        </Button>
      )}
    </div>
  )
}

export default Location
