import React, { useEffect, useState } from 'react'
import { message, Button, List, Radio, Space, Typography, Tag } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setEdittingAddress, updatePostData } from 'features/client/post/postSlice'
import AddressSelection from 'components/common/AddressSelection'
import { PlusOutlined, DeleteOutlined, EditOutlined, LeftOutlined } from '@ant-design/icons'
import styles from '../../scss/LocationModal.module.scss'
import { updateDefaultAddress, updateUserProfile } from '../../../../../../features/auth/authThunks'

const Location = ({ location, setLocation, isInProfile = false, isPtiterOnly = false }) => {
  const dispatch = useDispatch()
  const [fullAddress, setFullAddress] = useState('')
  const [editingIndex, setEditingIndex] = useState(-1) // -1 means not editing any existing address
  const [initialAddress, setInitialAddress] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const { user } = useSelector(state => state.auth)

  // Selected address for contact_address (separate from default address)
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1)

  // Initialize addresses from user.address or empty array if not available
  const [addresses, setAddresses] = useState([])
  const [addressesChanged, setAddressesChanged] = useState(false)

  // Sửa lại useEffect xử lý location prop
  useEffect(() => {
    if (location && user) {
      setFullAddress(location)
      setInitialAddress(location)

      if (Array.isArray(user.address)) {
        const locationIndex = user.address.findIndex(addr => addr.address === location)
        if (locationIndex !== -1) {
          setSelectedAddressIndex(locationIndex)
        }
      }
    }
  }, [location, user])

  // Sửa lại useEffect xử lý isPtiterOnly
  useEffect(() => {
    if (isPtiterOnly) {
      const ptitAddress = 'Km10, Đường Nguyễn Trãi, Q. Hà Đông, Hà Nội'
      setSelectedAddressIndex(0)
      if (location !== ptitAddress) {
        setLocation(ptitAddress)
      }
    } else {
      // Khi chuyển từ PTIT sang normal mode, chọn lại địa chỉ mặc định
      const defaultAddress = addresses.find(addr => addr.isDefault)
      if (defaultAddress) {
        setSelectedAddressIndex(addresses.indexOf(defaultAddress))
        setLocation(defaultAddress.address)
      }
    }
  }, [isPtiterOnly])

  // Load addresses from user data when component mounts or user changes
  useEffect(() => {
    if (user && Array.isArray(user.address)) {
      // Create a new array to avoid modifying the original
      const addressesCopy = [...user.address]
      // Sort the copy
      const sortedAddresses = addressesCopy.sort(
        (a, b) => (b.isDefault === true ? 1 : 0) - (a.isDefault === true ? 1 : 0)
      )
      setAddresses(sortedAddresses)

      // Find default address index
      const defaultIndex = sortedAddresses.findIndex(addr => addr.isDefault === true)
      if (defaultIndex !== -1) {
        setSelectedAddressIndex(defaultIndex)
      }
    } else {
      setAddresses([])
    }
    setAddressesChanged(false)
  }, [user])

  // Re-render addresses when the default address changes
  useEffect(() => {
    if (user && Array.isArray(user.address)) {
      // Create a new array
      const addressesCopy = [...user.address]
      // Sort the copy
      const sortedAddresses = addressesCopy.sort(
        (a, b) => (b.isDefault === true ? 1 : 0) - (a.isDefault === true ? 1 : 0)
      )
      setAddresses(sortedAddresses)
    }
  }, [user.address])

  // Show address form if no location
  useEffect(() => {
    setShowAddressForm(!location)
  }, [location])

  const handleAddressChange = address => {
    setFullAddress(address)
  }

  const handleAddAddress = async () => {
    if (isPtiterOnly) {
      message.info('Không thể thêm địa chỉ mới khi đang ở chế độ dành cho sinh viên PTIT')
      return
    }
    if (!fullAddress) {
      message.error('Vui lòng chọn đầy đủ thông tin địa điểm')
      return
    }

    const newAddress = {
      address: fullAddress,
      isDefault: addresses.length === 0 // If no addresses, set as default
    }

    const newAddresses = [...addresses, newAddress]

    // Call API immediately when adding a new address
    try {
      const response = await dispatch(
        updateUserProfile({
          address: newAddresses
        })
      ).unwrap()

      // Update local state after API success
      setAddresses(newAddresses)
      setSelectedAddressIndex(newAddresses.length - 1)
      message.success('Đã lưu địa chỉ thành công!')
    } catch (error) {
      // Display the specific error message from the server response
      if (error.detail && error.detail['']) {
        message.error(error.detail[''])
      } else {
        message.error('Không thể lưu địa chỉ')
      }
    }

    setShowAddressForm(false)
    setFullAddress('')
  }

  const handleEditAddress = index => {
    if (isPtiterOnly) {
      message.info('Không thể chỉnh sửa địa chỉ khi đang ở chế độ dành cho sinh viên PTIT')
      return
    }
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

    // Call API immediately when updating an address
    try {
      const response = await dispatch(
        updateUserProfile({
          address: newAddresses
        })
      ).unwrap()

      // Update local state after API success
      setAddresses(newAddresses)
      message.success('Đã cập nhật địa chỉ thành công!')
    } catch (error) {
      // Display the specific error message from the server response
      if (error.detail && error.detail['']) {
        message.error(error.detail[''])
      } else {
        message.error('Không thể cập nhật địa chỉ')
      }
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
    if (isPtiterOnly) {
      message.info('Không thể xóa địa chỉ khi đang ở chế độ dành cho sinh viên PTIT')
      return
    }
    if (addresses.length === 1) {
      message.warning('Bạn không thể xóa địa chỉ duy nhất')
      return
    }

    const addressToDelete = addresses[index]
    const newAddresses = addresses.filter((_, i) => i !== index)

    // Call API immediately when deleting an address
    try {
      const response = await dispatch(
        updateUserProfile({
          address: newAddresses
        })
      ).unwrap()

      // Update local state after API success
      setAddresses(newAddresses)

      // Adjust selected index if needed
      if (index === selectedAddressIndex) {
        setSelectedAddressIndex(0)
      } else if (index < selectedAddressIndex) {
        setSelectedAddressIndex(selectedAddressIndex - 1)
      }

      message.success('Đã xóa địa chỉ thành công')
    } catch (error) {
      // Display the specific error message from the server response
      if (error.detail && error.detail['']) {
        message.error(error.detail[''])
      } else {
        message.error('Không thể xóa địa chỉ')
      }
    }
  }

  const handleSelectAddress = index => {
    if (isPtiterOnly) {
      return // Không cho phép thay đổi khi đang ở chế độ PTIT
    }
    setSelectedAddressIndex(index)
    const selectedAddress = addresses[index]
    if (selectedAddress) {
      setLocation(selectedAddress.address)
    }
  }

  const handleUpdateDefaultAddress = async id => {
    try {
      const response = await dispatch(updateDefaultAddress(id)).unwrap()
      if (response.status === 200) {
        message.success(response.message)
      }
    } catch (error) {
      message.error('Không thể cập nhật địa chỉ mặc định')
    }
  }

  const handleLocationSave = async () => {
    if (selectedAddressIndex === -1 || !addresses[selectedAddressIndex]) {
      message.error('Vui lòng chọn một địa chỉ')
      return
    }

    const selectedAddress = addresses[selectedAddressIndex]
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

  // Sửa lại displayAddresses
  const displayAddresses = React.useMemo(() => {
    const ptitAddress = {
      address: 'Km10, Đường Nguyễn Trãi, Q. Hà Đông, Hà Nội',
      isDefault: false,
      isPtitAddress: true
    }

    let filteredAddresses = [...addresses]

    // Sắp xếp địa chỉ với địa chỉ mặc định lên đầu
    filteredAddresses.sort((a, b) => {
      if (a.isDefault === b.isDefault) return 0
      return a.isDefault ? -1 : 1
    })

    if (user?.isPtiter) {
      if (isPtiterOnly) {
        // Khi chọn chế độ PTIT, địa chỉ PTIT lên đầu
        return [ptitAddress, ...filteredAddresses]
      } else {
        // Khi không chọn chế độ PTIT, địa chỉ PTIT ở cuối
        return [...filteredAddresses, ptitAddress]
      }
    }

    return filteredAddresses
  }, [isPtiterOnly, addresses, user?.isPtiter])

  return (
    <div className={styles.locationWrapper}>
      {!isInProfile && (
        <div className={styles.titleLocation} onClick={() => dispatch(setEdittingAddress(false))}>
          <Button type="link" icon={<LeftOutlined />} />
          <Typography.Title level={4} style={{ margin: 0, fontSize: 16 }}>
            Danh sách địa chỉ
          </Typography.Title>
        </div>
      )}

      <List
        className={styles.addressList}
        itemLayout="horizontal"
        dataSource={displayAddresses}
        renderItem={(address, index) => (
          <List.Item
            actions={
              !address.isPtitAddress
                ? [
                    <EditOutlined key="edit" onClick={() => handleEditAddress(index)} style={{ color: '#1890ff' }} />,
                    <DeleteOutlined
                      key="delete"
                      onClick={() => handleDeleteAddress(index)}
                      style={{ color: '#ff4d4f' }}
                    />
                  ]
                : []
            }
          >
            <List.Item.Meta
              avatar={<Radio checked={index === selectedAddressIndex} onChange={() => handleSelectAddress(index)} />}
              title={
                address.isPtitAddress ? (
                  <Tag color="blue">Địa chỉ trường PTIT</Tag>
                ) : address.isDefault ? (
                  <Tag color="green" className={styles.locationDefault}>
                    Mặc định
                  </Tag>
                ) : (
                  <Tag style={{ cursor: 'pointer' }} onClick={() => handleUpdateDefaultAddress(address?._id)}>
                    Đặt làm mặc định
                  </Tag>
                )
              }
              description={address.address}
            />
          </List.Item>
        )}
      />

      {!isPtiterOnly && !showAddressForm && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAddNewAddress}
          style={{ marginTop: 10, width: '100%' }}
        >
          Thêm địa chỉ mới
        </Button>
      )}

      {showAddressForm && !isPtiterOnly && (
        <Space direction="vertical" style={{ width: '100%', marginTop: 10 }}>
          <Typography.Title style={{ margin: 0, fontSize: 16 }} level={5}>
            {editingIndex >= 0 ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </Typography.Title>
          <AddressSelection
            initialAddress={editingIndex >= 0 ? addresses[editingIndex].address : ''}
            onAddressChange={handleAddressChange}
            isEditing={true}
          />
          <Space className={styles.spaceButton}>
            <Button onClick={handleCancelEdit}>Hủy</Button>
            <Button type="primary" onClick={editingIndex >= 0 ? handleUpdateAddress : handleAddAddress}>
              {editingIndex >= 0 ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
            </Button>
          </Space>
        </Space>
      )}

      {addresses.length > 0 && !isInProfile && (
        <Button type="primary" onClick={handleLocationSave} style={{ marginTop: 16, width: '100%' }}>
          Lưu và sử dụng địa chỉ này
        </Button>
      )}
    </div>
  )
}

export default Location
