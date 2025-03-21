import React from 'react'
import { Carousel } from 'antd'
import styles from '../scss/Topsales.module.scss'
import banner1 from 'assets/images/banner/_Banner2.png'
import banner2 from 'assets/images/banner/banner3.webp'
import banner4 from 'assets/images/Banner2/4.webp'
import banner5 from 'assets/images/Banner2/5.webp'
import banner7 from 'assets/images/Banner2/7.webp'
import banner8 from 'assets/images/Banner2/8.webp'

const Banner = () => {
  return (
    <div className={styles.carouselWrap}>
      <Carousel autoplay>
        <div>
          <img src={banner1} alt="Banner 1" className={styles.bannerCarousel} />
        </div>
        <div>
          <img src={banner7} alt="Banner 7" className={styles.bannerCarousel} />
        </div>
        <div>
          <img src={banner5} alt="Banner 5" className={styles.bannerCarousel} />
        </div>
        <div>
          <img src={banner8} alt="Banner 8" className={styles.bannerCarousel} />
        </div>
        <div>
          <img src={banner2} alt="Banner 2" className={styles.bannerCarousel} />
        </div>
        <div>
          <img src={banner4} alt="Banner 4" className={styles.bannerCarousel} />
        </div>
        <div>
          <img src={banner5} alt="Banner 5" className={styles.bannerCarousel} />
        </div>
        <div>
          <img src={banner8} alt="Banner 8" className={styles.bannerCarousel} />
        </div>
      </Carousel>
    </div>
  )
}

export default Banner
