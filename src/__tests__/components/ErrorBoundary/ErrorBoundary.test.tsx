import { render, screen } from '@testing-library/react'

import { ErrorBoundaryWithCSSThemeClassHook } from '../../../components/ErrorBoundary/ErrorBoundaryWithCSSThemeClassHook'

describe('MyErrorBoundary', () => {
  // A very buggy component
  const ThrowError = () => {
    throw new Error('Test')
  }

  it('renders children when everything is fine', async () => {
    render(
      <ErrorBoundaryWithCSSThemeClassHook>
        <p>Everything is fine</p>
      </ErrorBoundaryWithCSSThemeClassHook>,
    )
    expect(screen.getByText(/Everything is fine/)).toBeInTheDocument()
  })

  it('shows an apologetic error message when an unhandled exception is thrown', () => {
    render(
      <ErrorBoundaryWithCSSThemeClassHook>
        <ThrowError />
        <p>Everything is fine</p>
      </ErrorBoundaryWithCSSThemeClassHook>,
    )

    expect(screen.queryByText(/Everything is fine/)).not.toBeInTheDocument()
    expect(screen.getByText(/Something went wrong!/)).toBeInTheDocument()
  })
})
