import React from 'react'
import { Carousel } from 'antd'
import styles from '../scss/Topsales.module.scss'
import banner1 from '../../../../assets/images/banner/banner1.png'
import banner2 from '../../../../assets/images/banner/banner2.png'
import banner3 from '../../../../assets/images/banner/banner3.png'
import banner4 from '../../../../assets/images/banner/banner4.png'
import banner5 from '../../../../assets/images/banner/banner5.png'
import banner6 from '../../../../assets/images/banner/banner6.png'

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
