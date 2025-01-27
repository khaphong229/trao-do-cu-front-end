import React, { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import FullScreenLoading from '../Loading'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <Navigate to="/not-found" replace />
    }

    return <Suspense fallback={<FullScreenLoading isVisible={true} />}>{this.props.children}</Suspense>
  }
}

export default ErrorBoundary
