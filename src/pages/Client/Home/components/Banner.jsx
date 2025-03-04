import React from 'react'
import { Carousel } from 'antd'
import styles from '../scss/Topsales.module.scss'
import banner1 from 'assets/images/banner/banner1.webp'
import banner3 from 'assets/images/banner/banner3.webp'
import banner5 from 'assets/images/banner/banner5.webp'
import banner6 from 'assets/images/banner/banner6.webp'

const Banner = () => {
  return (
    <div className={styles.carouselWrap}>
      <Carousel autoplay>
        <div>
          <img src={banner1} alt="Banner 1" className={styles.bannerCarousel} />
        </div>

        <div>
          <img src={banner3} alt="Banner 2" className={styles.bannerCarousel} />
        </div>

        <div>
          <img src={banner5} alt="Banner 2" className={styles.bannerCarousel} />
        </div>
        <div>
          <img src={banner6} alt="Banner 2" className={styles.bannerCarousel} />
        </div>
      </Carousel>
    </div>
  )
}

export default Banner
