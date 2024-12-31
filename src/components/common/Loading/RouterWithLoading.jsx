import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import FullScreenLoading from './Loading'

const RouterWithLoading = () => {
  const location = useLocation()
  const [isNavigating, setIsNavigating] = useState(false)
  useEffect(() => {
    setIsNavigating(true)
    const timer = setTimeout(() => setIsNavigating(false), 200)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <>
      <FullScreenLoading isVisible={isNavigating} />
      <Outlet />
    </>
  )
}

export default RouterWithLoading
