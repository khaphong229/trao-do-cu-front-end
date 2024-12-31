import React, { useState, useEffect } from 'react'
import './styles.scss'

const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const checkScrollHeight = () => {
      if (!showButton && window.pageYOffset > 400) {
        setShowButton(true)
      } else if (showButton && window.pageYOffset <= 400) {
        setShowButton(false)
      }
    }

    window.addEventListener('scroll', checkScrollHeight)
    return () => {
      window.removeEventListener('scroll', checkScrollHeight)
    }
  }, [showButton])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <span className={`back-to-top-button ${showButton ? 'visible' : ''}`} onClick={scrollToTop}>
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </span>
  )
}

export default BackToTopButton
