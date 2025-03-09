import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Select, Input, Button, Space } from 'antd'
import './AddressSelection.scss'
import { FormOutlined } from '@ant-design/icons'
import { locationService } from 'services/client/locationService'

export const AddressSelection = ({ initialAddress, onAddressChange, isEditing, onEdit }) => {
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [selectedWard, setSelectedWard] = useState(null)
  const [specificAddress, setSpecificAddress] = useState('')
  const [dataVN, setDataVN] = useState([])

  const fetchProvince = useCallback(async () => {
    const cachedData = localStorage.getItem('provinceData')

    if (cachedData) {
      setDataVN(JSON.parse(cachedData))
      return
    }
    try {
      const data = await locationService.getProvince()
      if (data.data.status === 200) {
        setDataVN(data.data.data)
        localStorage.setItem('provinceData', JSON.stringify(data.data.data))
      }
    } catch (error) {
      if (error.response?.data?.status === 404) {
        throw error
      }
    }
  }, [])

  useEffect(() => {
    fetchProvince()
  }, [fetchProvince])

  const provinces = dataVN.map(province => ({
    code: province.Code,
    name: province.FullName
  }))

  const districts = useMemo(
    () =>
      selectedProvince
        ? dataVN
            .find(p => p.Code === selectedProvince)
            ?.District.map(district => ({
              code: district.Code,
              name: district.FullName
            })) || []
        : [],
    [dataVN, selectedProvince]
  )

  const wards = useMemo(
    () =>
      selectedDistrict
        ? dataVN
            .find(p => p.Code === selectedProvince)
            ?.District.find(d => d.Code === selectedDistrict)
            ?.Ward.map(ward => ({
              code: ward.Code,
              name: ward.FullName
            })) || []
        : [],
    [dataVN, selectedProvince, selectedDistrict]
  )

  const filterProvinces = (input, option) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const filterDistricts = (input, option) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const filterWards = (input, option) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      const provinceName = provinces.find(p => p.code === selectedProvince)?.name
      const districtName = districts.find(d => d.code === selectedDistrict)?.name
      const wardName = wards.find(w => w.code === selectedWard)?.name

      const fullAddress = [specificAddress, wardName, districtName, provinceName].filter(Boolean).join(', ')

      onAddressChange(fullAddress)
    }
  }, [selectedProvince, selectedDistrict, selectedWard, specificAddress, districts, onAddressChange, provinces, wards])

  useEffect(() => {
    if (initialAddress && !isEditing) {
      onAddressChange(initialAddress)
    }
  }, [initialAddress, isEditing, onAddressChange])

  if (!isEditing && initialAddress) {
    return (
      <div className="address-display">
        <Space className="address-display-content">
          <span>{initialAddress}</span>
          <Button type="link" onClick={onEdit} icon={<FormOutlined />} />
        </Space>
      </div>
    )
  }

  return (
    <Space direction="vertical" className="address-form" size="middle">
      <Select
        showSearch
        className="address-select"
        placeholder="Chọn Tỉnh/Thành phố"
        value={selectedProvince}
        filterOption={filterProvinces}
        optionFilterProp="children"
        onChange={value => {
          setSelectedProvince(value)
          setSelectedDistrict(null)
          setSelectedWard(null)
        }}
      >
        {provinces.map(province => (
          <Select.Option key={province.code} value={province.code}>
            {province.name}
          </Select.Option>
        ))}
      </Select>

      <Select
        showSearch
        className="address-select"
        placeholder="Chọn Quận/Huyện"
        value={selectedDistrict}
        disabled={!selectedProvince}
        filterOption={filterDistricts}
        optionFilterProp="children"
        onChange={value => {
          setSelectedDistrict(value)
          setSelectedWard(null)
        }}
      >
        {districts.map(district => (
          <Select.Option key={district.code} value={district.code}>
            {district.name}
          </Select.Option>
        ))}
      </Select>

      <Select
        showSearch
        optionFilterProp="children"
        filterOption={filterWards}
        className="address-select"
        placeholder="Chọn Phường/Xã"
        value={selectedWard}
        disabled={!selectedDistrict}
        onChange={value => setSelectedWard(value)}
      >
        {wards.map(ward => (
          <Select.Option key={ward.code} value={ward.code}>
            {ward.name}
          </Select.Option>
        ))}
      </Select>

      <Input
        placeholder="Nhập địa chỉ cụ thể (VD: Số 252, Minh Khai)"
        value={specificAddress}
        onChange={e => setSpecificAddress(e.target.value)}
      />
    </Space>
  )
}

export default AddressSelection
