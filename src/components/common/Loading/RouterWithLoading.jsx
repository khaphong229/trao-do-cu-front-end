import React from 'react'
import { Outlet } from 'react-router-dom'

const RouterWithLoading = () => {
  // const location = useLocation()
  // const [isNavigating, setIsNavigating] = useState(false)
  // useEffect(() => {
  //   setIsNavigating(true)
  //   const timer = setTimeout(() => setIsNavigating(false), 100)
  //   return () => clearTimeout(timer)
  // }, [location.pathname])

  return (
    <>
      {/* <FullScreenLoading isVisible={isNavigating} /> */}
      <Outlet />
    </>
  )
}

export default RouterWithLoading
