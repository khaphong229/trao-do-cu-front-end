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
  const [showAddressForm, setShowAddressForm] = useState(false)
  const { user } = useSelector(state => state.auth)

  // Initialize addresses from user.address or empty array if not available
  const [addresses, setAddresses] = useState(user.address || [])
  const [addressesChanged, setAddressesChanged] = useState(false)

  // Load addresses from user data when component mounts or user changes
  useEffect(() => {
    if (user && Array.isArray(user.address)) {
      setAddresses(user.address)
    } else {
      setAddresses([])
    }
    setAddressesChanged(false)
  }, [user])

  // Handle location prop changes
  useEffect(() => {
    if (location && user) {
      setFullAddress(location)
      setInitialAddress(location)

      if (Array.isArray(user.address)) {
        const locationIndex = user.address.findIndex(addr => addr.address === location)

        if (locationIndex !== -1) {
          // If address exists, mark it as default locally (without API call)
          const newAddresses = addresses.map((addr, i) => ({
            ...addr,
            isDefault: i === locationIndex
          }))
          setAddresses(newAddresses)
        } else if (location.trim() !== '') {
          // If address doesn't exist, add it to the list locally
          const newAddress = {
            address: location,
            isDefault: addresses.length === 0 // If no addresses, set as default
          }
          const newAddresses = [...addresses, newAddress]
          setAddresses(newAddresses)
          setAddressesChanged(true) // Mark that we've made changes
        }
      }
    }
  }, [location, user])

  // Show address form if no location
  useEffect(() => {
    setShowAddressForm(!location)
  }, [location])

  // Function to save addresses to user profile via Redux - only called when needed
  const saveAddressesToUserProfile = async () => {
    if (!addressesChanged) return

    try {
      await dispatch(
        updateUserProfile({
          address: addresses
        })
      ).unwrap()
      console.log('Addresses saved to user profile:', addresses)
      setAddressesChanged(false)
    } catch (error) {
      console.error('Error saving addresses to profile:', error)
      message.error('Không thể lưu danh sách địa chỉ')
    }
  }

  const handleAddressChange = address => {
    setFullAddress(address)
  }

  const handleAddAddress = async () => {
    if (!fullAddress) {
      message.error('Vui lòng chọn đầy đủ thông tin địa điểm')
      return
    }

    const newAddress = {
      address: fullAddress,
      isDefault: addresses.length === 0 // If no addresses, set as default
    }

    const newAddresses = [...addresses, newAddress]
    setAddresses(newAddresses)
    setAddressesChanged(true)

    // Call API immediately when adding a new address
    try {
      await dispatch(
        updateUserProfile({
          address: newAddresses
        })
      ).unwrap()
      setAddressesChanged(false)
      message.success('Đã lưu địa chỉ thành công!')
    } catch (error) {
      console.error('Error saving addresses to profile:', error)
      message.error('Không thể lưu địa chỉ')
    }

    setShowAddressForm(false)
    setFullAddress('')
  }

  const handleEditAddress = index => {
    setEditingIndex(index)
    setFullAddress(addresses[index].address)
    setShowAddressForm(true)
  }

  const handleUpdateAddress = async () => {
    if (!fullAddress) {
      message.error('Vui lòng chọn đầy đủ thông tin địa điểm')
      return
    }

    // Update the address
    const newAddresses = [...addresses]
    newAddresses[editingIndex] = {
      ...newAddresses[editingIndex],
      address: fullAddress
    }

    setAddresses(newAddresses)
    setAddressesChanged(true)

    // Call API immediately when updating an address
    try {
      await dispatch(
        updateUserProfile({
          address: newAddresses
        })
      ).unwrap()
      setAddressesChanged(false)
      message.success('Đã cập nhật địa chỉ thành công!')
    } catch (error) {
      console.error('Error updating address:', error)
      message.error('Không thể cập nhật địa chỉ')
    }

    setEditingIndex(-1)
    setShowAddressForm(false)
    setFullAddress('')
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

  const handleDeleteAddress = async index => {
    if (addresses.length === 1) {
      message.warning('Bạn không thể xóa địa chỉ duy nhất')
      return
    }

    const newAddresses = addresses.filter((_, i) => i !== index)

    // If we're deleting the default address, make the first remaining address the default
    if (addresses[index].isDefault && newAddresses.length > 0) {
      newAddresses[0].isDefault = true
    }

    // Call API immediately when deleting an address
    try {
      await dispatch(
        updateUserProfile({
          address: newAddresses
        })
      ).unwrap()

      setAddresses(newAddresses)
      setAddressesChanged(false)
      message.success('Đã xóa địa chỉ thành công')
    } catch (error) {
      console.error('Error deleting address:', error)
      message.error('Không thể xóa địa chỉ')
    }
  }

  const handleSetDefaultAddress = async index => {
    const newAddresses = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }))

    // Just update local state, no API call until save
    setAddresses(newAddresses)
    setAddressesChanged(true)
  }

  const handleLocationSave = async () => {
    const selectedAddress = addresses.find(addr => addr.isDefault)
    if (!selectedAddress) {
      message.error('Vui lòng chọn hoặc thêm ít nhất một địa chỉ')
      return
    }

    // Save addresses if there are pending changes
    if (addressesChanged) {
      try {
        await dispatch(
          updateUserProfile({
            address: addresses
          })
        ).unwrap()
        setAddressesChanged(false)
      } catch (error) {
        if (error.status === 400) {
          Object.values(error.detail).forEach(val => {
            message.error(String(val))
          })
        }
        return
      }
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

    setInitialAddress(selectedAddress.address)
    message.success('Đã lưu và áp dụng địa chỉ thành công!')

    // Return to post creation after saving the address
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
            <Button type="primary" onClick={editingIndex >= 0 ? handleUpdateAddress : handleAddAddress}>
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
