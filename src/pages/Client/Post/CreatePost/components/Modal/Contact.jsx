import React, { useEffect, useState } from 'react'
import { Modal, message, Button, List, Radio, Space, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setLocationModalVisibility, updatePostData } from 'features/client/post/postSlice'
import AddressSelection from 'components/common/AddressSelection'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import styles from '../../scss/LocationModal.module.scss'
import { updateUserProfile } from '../../../../../../features/auth/authThunks'

const { Text } = Typography

const LocationModal = ({ location, setLocation }) => {
  const dispatch = useDispatch()
  const [fullAddress, setFullAddress] = useState('')
  const [editingIndex, setEditingIndex] = useState(-1) // -1 means not editing any existing address
  const [initialAddress, setInitialAddress] = useState('')
  const [addresses, setAddresses] = useState([])
  const [defaultAddressIndex, setDefaultAddressIndex] = useState(0)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const { isLocationModalVisible } = useSelector(state => state.post)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    if (location) {
      setFullAddress(location)
      setInitialAddress(location)

      // Initialize addresses array with the current location if not already present
      if (!addresses.includes(location)) {
        setAddresses(prev => {
          if (prev.length === 0) {
            return [location]
          } else if (!prev.includes(location)) {
            return [...prev, location]
          }
          return prev
        })
      }
    }
  }, [location])

  useEffect(() => {
    if (isLocationModalVisible) {
      setShowAddressForm(!location)
    }
  }, [isLocationModalVisible, location])

  const handleAddressChange = address => {
    setFullAddress(address)
  }

  const handleAddAddress = () => {
    if (!fullAddress) {
      message.error('Vui lòng chọn đầy đủ thông tin địa điểm')
      return
    }

    // Check if we're editing an existing address or adding a new one
    if (editingIndex >= 0) {
      // Update existing address
      const newAddresses = [...addresses]
      newAddresses[editingIndex] = fullAddress
      setAddresses(newAddresses)
      setEditingIndex(-1)
    } else {
      // Add new address if it doesn't exist
      if (!addresses.includes(fullAddress)) {
        setAddresses(prev => [...prev, fullAddress])
      }
    }

    // Reset form after adding
    setShowAddressForm(false)
    setFullAddress('')
    message.success('Đã lưu địa chỉ thành công!')
  }

  const handleLocationSave = async () => {
    // Use the default address for updating post data
    const selectedAddress = addresses[defaultAddressIndex]
    if (!selectedAddress) {
      message.error('Vui lòng chọn hoặc thêm ít nhất một địa chỉ')
      return
    }

    const addressParts = selectedAddress.split(', ')
    const city = addressParts[addressParts.length - 1]

    await dispatch(
      updatePostData({
        city,
        specificLocation: selectedAddress
      })
    )

    if (setLocation) {
      setLocation(selectedAddress)
    }

    if (selectedAddress !== initialAddress) {
      try {
        const response = await dispatch(
          updateUserProfile({
            name: user.name,
            email: user.email,
            address: selectedAddress,
            phone: user.phone
          })
        ).unwrap()

        if (response.status === 201) {
          message.success('Cập nhật địa chỉ thành công!')
          setInitialAddress(selectedAddress)
        }
      } catch (error) {
        if (error.status === 400) {
          Object.values(error.detail).forEach(val => {
            message.error(val)
          })
        }
      }
    }

    dispatch(setLocationModalVisibility(false))
  }

  const handleCancel = () => {
    setFullAddress('')
    setShowAddressForm(false)
    setEditingIndex(-1)
    dispatch(setLocationModalVisibility(false))
  }

  const handleEditAddress = index => {
    setEditingIndex(index)
    setFullAddress(addresses[index])
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

    const newAddresses = [...addresses]
    newAddresses.splice(index, 1)
    setAddresses(newAddresses)

    // If we're deleting the default address, update the default index
    if (index === defaultAddressIndex) {
      setDefaultAddressIndex(0)
    } else if (index < defaultAddressIndex) {
      setDefaultAddressIndex(defaultAddressIndex - 1)
    }

    message.success('Đã xóa địa chỉ thành công')
  }

  return (
    <Modal
      title="Địa chỉ của bạn"
      open={isLocationModalVisible}
      onCancel={handleCancel}
      onOk={handleLocationSave}
      okText="Lưu và sử dụng địa chỉ này"
      cancelText="Hủy"
      width={600}
    >
      <div className={styles.locationWrapper}>
        {addresses.length > 0 && (
          <List
            className={styles.addressList}
            itemLayout="horizontal"
            dataSource={addresses}
            renderItem={(address, index) => (
              <List.Item
                actions={[
                  <EditOutlined key="edit" onClick={() => handleEditAddress(index)} style={{ color: '#1890ff' }} />,
                  <DeleteOutlined
                    key="delete"
                    onClick={() => handleDeleteAddress(index)}
                    style={{ color: '#ff4d4f' }}
                  />
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Radio checked={index === defaultAddressIndex} onChange={() => setDefaultAddressIndex(index)} />
                  }
                  title={
                    index === defaultAddressIndex ? (
                      <Text strong>Địa chỉ mặc định</Text>
                    ) : (
                      <Text>Chọn làm địa chỉ mặc định</Text>
                    )
                  }
                  description={address}
                />
              </List.Item>
            )}
          />
        )}

        {showAddressForm ? (
          <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
            <Typography.Title level={5}>
              {editingIndex >= 0 ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </Typography.Title>
            <AddressSelection initialAddress={fullAddress} onAddressChange={handleAddressChange} isEditing={true} />
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
      </div>
    </Modal>
  )
}

export default LocationModal
