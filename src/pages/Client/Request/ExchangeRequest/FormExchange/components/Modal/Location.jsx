import React, { useState } from 'react'
import { Modal, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
  setLocationModalVisible,
  updateRequestData
} from 'features/client/request/exchangeRequest/exchangeRequestSlice'
import AddressSelection from 'components/common/AddressSelection'
import styles from '../../scss/LocationModal.module.scss'
import { updateUserProfile } from 'features/auth/authThunks'

const LocationModal = ({ location, setLocation }) => {
  const dispatch = useDispatch()
  const [fullAddress, setFullAddress] = useState(location || '')
  const [isEditing, setIsEditing] = useState(!location)
  const { isLocationModalVisible } = useSelector(state => state.exchangeRequest)
  const { user } = useSelector(state => state.auth)

  const handleAddressChange = address => {
    setFullAddress(address)
  }

  const handleLocationSave = async () => {
    if (!fullAddress) {
      message.error('Vui lòng chọn đầy đủ thông tin địa điểm')
      return
    }

    const addressParts = fullAddress.split(', ')
    const city = addressParts[addressParts.length - 1]

    await dispatch(
      updateRequestData({
        city,
        contact_address: fullAddress
      })
    )

    if (setLocation) {
      setLocation(fullAddress)
    }

    try {
      const response = await dispatch(
        updateUserProfile({
          name: user.name,
          email: user.email,
          address: fullAddress,
          phone: user.phone
        })
      ).unwrap()
      const { status } = response
      if (status === 201) {
        message.success('Cập nhật địa chỉ thành công!')
      }
    } catch (error) {
      if (error.status === 400) {
        Object.values(error.detail).forEach(val => {
          message.error(val)
        })
      }
    }

    setIsEditing(false)
    dispatch(setLocationModalVisible(false))
  }

  const handleCancel = () => {
    setFullAddress(location || '')
    setIsEditing(false)
    dispatch(setLocationModalVisible(false))
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  return (
    <Modal
      title="Địa chỉ của bạn"
      open={isLocationModalVisible}
      onCancel={handleCancel}
      onOk={handleLocationSave}
      okText="Lưu"
      cancelText="Hủy"
    >
      <div className={styles.locationWrapper}>
        <AddressSelection
          initialAddress={location}
          onAddressChange={handleAddressChange}
          isEditing={isEditing}
          onEdit={handleEdit}
        />
      </div>
    </Modal>
  )
}

export default LocationModal
