import React from 'react'
import { Navigate } from 'react-router-dom'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, redirect: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Check if error and errorInfo are defined before using them
    if (error) {
      console.error('Error caught by ErrorBoundary:', error, errorInfo || 'No additional error info')
    } else {
      console.error('Error caught by ErrorBoundary, but error object is undefined')
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hasError && !prevState.hasError) {
      setTimeout(() => {
        this.setState({ redirect: true })
      }, 1000)
    }
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to="/not-found" replace />
    }

    if (this.state.hasError) {
      return <div>Something went wrong. Redirecting to error page...</div>
    }

    return this.props.children
  }
}

export default ErrorBoundary
