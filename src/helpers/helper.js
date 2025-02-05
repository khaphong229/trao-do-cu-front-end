import imageNotFound from 'assets/images/others/imagenotfound.webp'
import { URL_SERVER_IMAGE } from '../config/url_server'
import { isArray } from 'lodash'

export const getValidImageUrl = imageUrls => {
  if (!imageUrls) {
    return imageNotFound
  }

  try {
    if (isArray(imageUrls)) {
      return `${URL_SERVER_IMAGE}${imageUrls[0]}`
    } else {
      return `${URL_SERVER_IMAGE}${imageUrls}`
    }
  } catch (error) {
    return imageNotFound
  }
}
