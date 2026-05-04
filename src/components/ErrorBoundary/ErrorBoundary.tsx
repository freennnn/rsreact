import React from 'react';

export class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}> {
  state = { hasError: false };

  resetErrorBoundary = () => {
    this.setState({ hasError: false });
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(error.message, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback">
          <h1>Something went wrong!</h1>
          <button type="button" onClick={this.resetErrorBoundary}>
            Reset
          </button>
        </div>
      );
    }

    return this.props.children;
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }
}
