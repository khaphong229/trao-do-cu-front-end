import { useSelector } from 'react-redux'
import { URL_SERVER_IMAGE } from 'config/url_server'
import avtDefault from 'assets/images/logo/avtDefault.webp'

export const useAvatar = () => {
  const { user } = useSelector(state => state.auth)

  const getAvatar = () => {
    if (user?.avatar) {
      if (user?.isGoogle) {
        return user.avatar.includes('lh3.googleusercontent.com') ? user.avatar : `${URL_SERVER_IMAGE}${user.avatar}`
      } else {
        return `${URL_SERVER_IMAGE}${user.avatar}`
      }
    } else {
      return avtDefault
    }
  }

  return { avatar: getAvatar() }
}
