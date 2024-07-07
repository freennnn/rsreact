import React from 'react'

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false }

  resetErrorBoundary = () => {
    this.setState({ hasError: false })
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(error.message)
    console.error(errorInfo.componentStack)
    this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong!</h1>
          <button onClick={this.resetErrorBoundary}>Reset</button>
        </div>
      )
    }

    return this.props.children
  }

  // static getDerivedStateFromError(error: Error) {
  //   return (
  //     <div></div>
  //   )
  // }
}
