import { useSelector } from 'react-redux'

export default function useDefaultLocation() {
  const { user } = useSelector(state => state.auth)
  const addressList = user?.address || []

  if (!Array.isArray(addressList) || addressList.length === 0) {
    return {
      addressDefault: ''
    }
  }

  const defaultAddress = addressList.find(address => address.isDefault === true)

  return {
    addressDefault: defaultAddress ? defaultAddress.address : ''
  }
}
