import React, { useEffect, useState } from 'react'
import { message, Button, List, Radio, Space, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setEdittingAddress, updatePostData } from 'features/client/post/postSlice'
import AddressSelection from 'components/common/AddressSelection'
import { PlusOutlined, DeleteOutlined, EditOutlined, LeftOutlined } from '@ant-design/icons'
import styles from '../../scss/LocationModal.module.scss'
import { updateUserProfile } from '../../../../../../features/auth/authThunks'

const { Text } = Typography

// Helper function để kiểm tra và xử lý dữ liệu
const safeString = value => {
  if (typeof value === 'string') return value
  if (value === null || value === undefined) return ''
  return String(value)
}

// Helper function để lấy địa chỉ đầy đủ từ các định dạng khác nhau
const getFullAddress = addressObj => {
  if (typeof addressObj === 'string') return addressObj
  if (!addressObj || typeof addressObj !== 'object') return ''

  // Trường hợp định dạng mới: { label, full_address }
  if (addressObj.full_address) return addressObj.full_address

  // Trường hợp định dạng cũ hoặc khác
  if (addressObj.address) return addressObj.address

  return JSON.stringify(addressObj) // Chuyển đổi object thành chuỗi nếu không phải là chuỗi
}

// Helper function để lấy label từ đối tượng địa chỉ
const getLabel = addressObj => {
  if (!addressObj || typeof addressObj !== 'object') return 'Địa chỉ'
  return addressObj.label || 'Địa chỉ'
}

const Location = ({ location, setLocation }) => {
  const dispatch = useDispatch()
  const [fullAddress, setFullAddress] = useState('')
  const [addressLabel, setAddressLabel] = useState('Địa chỉ')
  const [editingIndex, setEditingIndex] = useState(-1) // -1 means not editing any existing address
  const [initialAddress, setInitialAddress] = useState('')
  const [addresses, setAddresses] = useState([])
  const [defaultAddressIndex, setDefaultAddressIndex] = useState(0)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const { user } = useSelector(state => state.auth)

  // Khởi tạo danh sách địa chỉ từ user.address khi component được mount
  useEffect(() => {
    if (user && user.address) {
      try {
        // Đảm bảo địa chỉ là một mảng
        let addressArray = []

        if (Array.isArray(user.address)) {
          addressArray = user.address
        } else if (typeof user.address === 'object' && user.address !== null) {
          // Nếu là object, thử chuyển đổi thành mảng
          addressArray = Object.values(user.address).filter(item => typeof item === 'object' && item !== null)
        }

        // Xử lý và chuẩn hóa dữ liệu
        const normalizedAddresses = addressArray
          .map(addr => {
            // Xử lý định dạng mới: { label, full_address }
            if (addr && typeof addr === 'object' && addr.full_address) {
              return {
                label: addr.label || 'Địa chỉ',
                full_address: safeString(addr.full_address),
                isDefault: Boolean(addr.isDefault)
              }
            }

            // Xử lý định dạng cũ: { address, isDefault }
            return {
              label: 'Địa chỉ',
              full_address: getFullAddress(addr),
              isDefault: Boolean(addr.isDefault)
            }
          })
          .filter(addr => addr.full_address) // Lọc bỏ địa chỉ rỗng

        setAddresses(normalizedAddresses)

        // Tìm địa chỉ mặc định
        const defaultIndex = normalizedAddresses.findIndex(addr => addr.isDefault)
        const newDefaultIndex = defaultIndex !== -1 ? defaultIndex : 0
        setDefaultAddressIndex(newDefaultIndex)

        if (normalizedAddresses.length > 0) {
          setInitialAddress(normalizedAddresses[newDefaultIndex].full_address)
        }
      } catch (error) {
        console.error('Lỗi khi xử lý địa chỉ:', error)
        setAddresses([])
      }
    }
  }, [user])

  // Xử lý khi location prop thay đổi
  useEffect(() => {
    if (location && user) {
      setFullAddress(location)
      setInitialAddress(location)

      try {
        if (Array.isArray(addresses) && addresses.length > 0) {
          const locationIndex = addresses.findIndex(addr => addr.full_address === location)
          if (locationIndex !== -1) {
            setDefaultAddressIndex(locationIndex)
          } else {
            const newAddress = { label: 'Địa chỉ', full_address: location, isDefault: false }
            const newAddresses = [...addresses, newAddress]
            updateUserAddress(newAddresses)
            setDefaultAddressIndex(newAddresses.length - 1)
          }
        } else {
          const newAddress = { label: 'Địa chỉ', full_address: location, isDefault: true }
          updateUserAddress([newAddress])
          setDefaultAddressIndex(0)
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật địa chỉ:', error)
      }
    }
  }, [location, user, addresses])

  // Cập nhật địa chỉ của user thông qua API
  const updateUserAddress = async newAddresses => {
    try {
      // Đảm bảo mỗi địa chỉ đều có đúng format theo cấu trúc mới
      const validAddresses = newAddresses.map(addr => ({
        label: addr.label || 'Địa chỉ',
        full_address: safeString(addr.full_address),
        isDefault: Boolean(addr.isDefault)
      }))

      const response = await dispatch(
        updateUserProfile({
          name: user.name,
          email: user.email,
          address: validAddresses,
          phone: user.phone
        })
      ).unwrap()

      if (response.status === 201) {
        message.success('Cập nhật địa chỉ thành công!')
        setAddresses(validAddresses)
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật địa chỉ:', error)
      if (error.status === 400 && error.detail) {
        Object.values(error.detail).forEach(val => {
          message.error(typeof val === 'string' ? val : JSON.stringify(val))
        })
      } else {
        message.error('Có lỗi xảy ra khi cập nhật địa chỉ')
      }
    }
  }

  // Xử lý thay đổi địa chỉ trong form
  const handleAddressChange = address => {
    setFullAddress(safeString(address))
  }

  // Xử lý thay đổi label địa chỉ
  const handleLabelChange = e => {
    setAddressLabel(e.target.value)
  }

  // Xử lý thêm địa chỉ mới
  const handleAddAddress = async () => {
    if (!fullAddress) {
      message.error('Vui lòng chọn đầy đủ thông tin địa điểm')
      return
    }

    try {
      if (editingIndex >= 0) {
        // Cập nhật địa chỉ hiện có
        const newAddresses = [...addresses]
        newAddresses[editingIndex] = {
          label: addressLabel,
          full_address: fullAddress,
          isDefault: newAddresses[editingIndex].isDefault
        }
        await updateUserAddress(newAddresses)
        setEditingIndex(-1)
      } else {
        // Thêm địa chỉ mới nếu nó chưa tồn tại
        if (!addresses.some(addr => addr.full_address === fullAddress)) {
          const newAddress = {
            label: addressLabel,
            full_address: fullAddress,
            isDefault: addresses.length === 0
          }
          const newAddresses = [...addresses, newAddress]
          await updateUserAddress(newAddresses)

          if (addresses.length === 0) {
            setDefaultAddressIndex(0)
          }
        } else {
          message.info('Địa chỉ này đã tồn tại trong danh sách của bạn')
        }
      }

      setShowAddressForm(false)
      setFullAddress('')
      setAddressLabel('Địa chỉ')
    } catch (error) {
      console.error('Lỗi khi thêm địa chỉ:', error)
      message.error('Có lỗi xảy ra khi thêm địa chỉ')
    }
  }

  // Xử lý xóa địa chỉ
  const handleDeleteAddress = async index => {
    if (addresses.length === 1) {
      message.warning('Bạn không thể xóa địa chỉ duy nhất')
      return
    }

    try {
      const newAddresses = [...addresses]
      const isRemovingDefault = newAddresses[index].isDefault

      newAddresses.splice(index, 1)

      if (isRemovingDefault && newAddresses.length > 0) {
        newAddresses[0].isDefault = true
        setDefaultAddressIndex(0)
      } else if (index < defaultAddressIndex) {
        setDefaultAddressIndex(defaultAddressIndex - 1)
      }

      await updateUserAddress(newAddresses)
      message.success('Đã xóa địa chỉ thành công')
    } catch (error) {
      console.error('Lỗi khi xóa địa chỉ:', error)
      message.error('Có lỗi xảy ra khi xóa địa chỉ')
    }
  }

  // Xử lý đặt địa chỉ mặc định
  const handleSetDefaultAddress = async index => {
    if (index === defaultAddressIndex) return

    try {
      const newAddresses = addresses.map((addr, i) => ({
        ...addr,
        isDefault: i === index
      }))

      await updateUserAddress(newAddresses)
      setDefaultAddressIndex(index)
    } catch (error) {
      console.error('Lỗi khi đặt địa chỉ mặc định:', error)
      message.error('Có lỗi xảy ra khi đặt địa chỉ mặc định')
    }
  }

  // Xử lý lưu địa chỉ và quay lại
  const handleLocationSave = async () => {
    if (!Array.isArray(addresses) || addresses.length === 0) {
      message.error('Vui lòng thêm ít nhất một địa chỉ')
      return
    }

    try {
      const selectedAddress = addresses[defaultAddressIndex]?.full_address
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

      if (typeof setLocation === 'function') {
        setLocation(selectedAddress)
      }

      dispatch(setEdittingAddress(false))
    } catch (error) {
      console.error('Lỗi khi lưu địa chỉ:', error)
      message.error('Có lỗi xảy ra khi lưu địa chỉ')
    }
  }

  // Xử lý chỉnh sửa địa chỉ
  const handleEditAddress = index => {
    if (index >= 0 && index < addresses.length) {
      const addressToEdit = addresses[index]
      setEditingIndex(index)
      setFullAddress(addressToEdit.full_address)
      setAddressLabel(addressToEdit.label || 'Địa chỉ')
      setShowAddressForm(true)
    }
  }

  // Xử lý hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingIndex(-1)
    setFullAddress('')
    setAddressLabel('Địa chỉ')
    setShowAddressForm(false)
  }

  // Xử lý thêm địa chỉ mới
  const handleAddNewAddress = () => {
    setShowAddressForm(true)
    setFullAddress('')
    setAddressLabel('Địa chỉ')
    setEditingIndex(-1)
  }

  // Render an address item safely
  const renderAddressItem = (address, index) => {
    if (!address || typeof address !== 'object') {
      return null
    }

    const addressText = getFullAddress(address)
    const labelText = getLabel(address)
    const isDefault = Boolean(address.isDefault)

    return (
      <List.Item
        key={`address-${index}`}
        actions={[
          <EditOutlined key="edit" onClick={() => handleEditAddress(index)} style={{ color: '#1890ff' }} />,
          <DeleteOutlined key="delete" onClick={() => handleDeleteAddress(index)} style={{ color: '#ff4d4f' }} />
        ]}
      >
        <List.Item.Meta
          avatar={<Radio checked={isDefault} onChange={() => handleSetDefaultAddress(index)} />}
          title={
            isDefault ? (
              <Text style={{ color: 'green' }}>Địa chỉ mặc định</Text>
            ) : (
              <Text strong>Chọn làm địa chỉ mặc định</Text>
            )
          }
          description={addressText}
        />
      </List.Item>
    )
  }

  return (
    <div className={styles.locationWrapper}>
      <Button icon={<LeftOutlined />} onClick={() => dispatch(setEdittingAddress(false))}>
        Quay lại
      </Button>
      <Typography.Title level={4} style={{ margin: '10px 0' }}>
        Danh sách địa chỉ
      </Typography.Title>

      {Array.isArray(addresses) && addresses.length > 0 ? (
        <List
          className={styles.addressList}
          itemLayout="horizontal"
          dataSource={addresses}
          renderItem={(address, index) => renderAddressItem(address, index)}
        />
      ) : (
        <div style={{ margin: '10px 0' }}>
          <Text>Chưa có địa chỉ nào. Hãy thêm địa chỉ mới.</Text>
        </div>
      )}

      {showAddressForm ? (
        <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
          <Typography.Title level={5}>{editingIndex >= 0 ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</Typography.Title>
          <AddressSelection
            initialAddress={editingIndex >= 0 && addresses[editingIndex] ? addresses[editingIndex].address : ''}
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

      {Array.isArray(addresses) && addresses.length > 0 && (
        <Button type="primary" onClick={handleLocationSave} style={{ marginTop: 16, width: '100%' }}>
          Lưu và sử dụng địa chỉ này
        </Button>
      )}
    </div>
  )
}

export default Location
