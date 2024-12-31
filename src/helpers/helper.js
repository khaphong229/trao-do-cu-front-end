import imageNotFound from 'assets/images/others/imagenotfound.jpg'
import { URL_SERVER_IMAGE } from '../config/url_server'

export const getValidImageUrl = imageUrls => {
  if (!imageUrls || imageUrls.length === 0) {
    return imageNotFound
  }

  try {
    const imageUrl = `${URL_SERVER_IMAGE}${imageUrls[0]}`
    return imageUrl
  } catch (error) {
    return imageNotFound
  }
}
