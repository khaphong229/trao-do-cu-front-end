import React from 'react'
import { Carousel } from 'antd'
import styles from '../scss/Topsales.module.scss'
import banner1 from '../../../../assets/images/banner/1.png'
import banner2 from '../../../../assets/images/banner/2.png'
import banner3 from '../../../../assets/images/banner/3.png'
import banner4 from '../../../../assets/images/banner/4.png'

const Banner = () => {
  return (
    <div className={styles.carouselWrap}>
      <Carousel autoplay>
        <div>
          <img src={banner1} alt="Banner 1" className={styles.bannerCarousel} />
        </div>
        <div>
          <img src={banner2} alt="Banner 1" className={styles.bannerCarousel} />
        </div>
        <div>
          <img src={banner3} alt="Banner 2" className={styles.bannerCarousel} />
        </div>
        <div>
          <img src={banner4} alt="Banner 2" className={styles.bannerCarousel} />
        </div>
      </Carousel>
    </div>
  )
}

export default Banner
