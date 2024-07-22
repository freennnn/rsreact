import { render, screen } from '@testing-library/react'

import { ErrorBoundaryWithCSSThemePostfixHook } from '../../../components/ErrorBoundary/ErrorBoundaryWithCSSThemePostfixHook'

describe('MyErrorBoundary', () => {
  // A very buggy component
  const ThrowError = () => {
    throw new Error('Test')
  }

  it('renders children when everything is fine', async () => {
    render(
      <ErrorBoundaryWithCSSThemePostfixHook>
        <p>Everything is fine</p>
      </ErrorBoundaryWithCSSThemePostfixHook>,
    )
    expect(screen.getByText(/Everything is fine/)).toBeInTheDocument()
  })

  it('shows an apologetic error message when an unhandled exception is thrown', () => {
    render(
      <ErrorBoundaryWithCSSThemePostfixHook>
        <ThrowError />
        <p>Everything is fine</p>
      </ErrorBoundaryWithCSSThemePostfixHook>,
    )

    expect(screen.queryByText(/Everything is fine/)).not.toBeInTheDocument()
    expect(screen.getByText(/Something went wrong!/)).toBeInTheDocument()
  })
})
