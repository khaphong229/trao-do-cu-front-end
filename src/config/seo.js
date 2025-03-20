import { Helmet } from 'react-helmet-async'
import thumbnail from 'assets/images/banner/thumbnail.jpg'
const SEO = ({
  title = 'Trao Đồ Cũ - Nền tảng kết nối cộng đồng trao đổi đồ dễ dàng, nhanh chóng và hiệu quả.',
  description = 'Trang chủ với nhiều sản phẩm trao tặng, trao đổi cực kỳ hấp dẫn',
  keywords = ['trao đồ cũ, trao đổi, trao tặng, xin đồ, chợ đồ cũ'],
  image = thumbnail,
  url = 'https://traodocu.vn'
}) => {
  const keyword = keywords.toString().replace(',', ', ')

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keyword} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  )
}

export default SEO
