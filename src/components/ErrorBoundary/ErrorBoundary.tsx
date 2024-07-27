import React from 'react'

// import { LogError } from '../../utils/utils'

export class ErrorBoundary extends React.Component<{
  children: React.ReactNode
  myCSSHookFunction: (className: string) => string
}> {
  state = { hasError: false }

  resetErrorBoundary = () => {
    this.setState({ hasError: false })
  }

  componentDidCatch(/*error: Error, errorInfo: React.ErrorInfo*/): void {
    // same error as in getDerivedStateFromError, yet method is called at completely
    // different lifecycle stage
    //LogError(error.message)
    //LogError(errorInfo.componentStack)
    //this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong!</h1>
          <button onClick={this.resetErrorBoundary} className={this.props.myCSSHookFunction('')}>
            Reset
          </button>
        </div>
      )
    }

    return this.props.children
  }

  static getDerivedStateFromError(/*error: Error*/) {
    //LogError(error.message)
    return { hasError: true }
  }
}
