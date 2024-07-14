import { render, screen } from '@testing-library/react'

import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary'

describe('MyErrorBoundary', () => {
  // A very buggy component
  const ThrowError = () => {
    throw new Error('Test')
  }

  it('renders children when everything is fine', async () => {
    render(
      <ErrorBoundary>
        <p>Everything is fine</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText(/Everything is fine/)).toBeInTheDocument()
  })

  it('shows an apologetic error message when an unhandled exception is thrown', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
        <p>Everything is fine</p>
      </ErrorBoundary>,
    )

    expect(screen.queryByText(/Everything is fine/)).not.toBeInTheDocument()
    expect(screen.getByText(/Something went wrong!/)).toBeInTheDocument()
  })
})
