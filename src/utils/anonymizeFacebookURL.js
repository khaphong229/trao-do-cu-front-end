export function anonymizeFacebookURL(url) {
  try {
    let parsedUrl = new URL(url)
    if (parsedUrl.hostname.includes('facebook.com')) {
      parsedUrl.pathname = '/xxxxx'
    }
    return parsedUrl.toString()
  } catch (error) {
    return 'Liên kết Facebook đang được cập nhật'
  }
}
