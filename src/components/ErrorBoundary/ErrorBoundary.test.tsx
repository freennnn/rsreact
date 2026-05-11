import { vi } from 'vitest'

import { renderWithUser, screen, waitFor } from '../../test-utils/render'
import { ErrorButton } from '../ErrorButton/ErrorButton'
import { ErrorBoundary } from './ErrorBoundary'

describe('ErrorBoundary', () => {
  it('shows fallback UI and logs the error when ErrorButton throws', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    const { user } = renderWithUser(
      <ErrorBoundary>
        <ErrorButton>Generate Error</ErrorButton>
      </ErrorBoundary>
    )

    await user.click(screen.getByRole('button', { name: 'Generate Error' }))

    expect(
      await screen.findByRole('heading', { name: 'Something went wrong!' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('restores the children after reset', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { user } = renderWithUser(
      <ErrorBoundary>
        <ErrorButton>Generate Error</ErrorButton>
      </ErrorBoundary>
    )

    await user.click(screen.getByRole('button', { name: 'Generate Error' }))
    expect(
      await screen.findByRole('heading', { name: 'Something went wrong!' })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset' }))

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Generate Error' })
      ).toBeInTheDocument()
    })
    expect(
      screen.queryByRole('heading', { name: 'Something went wrong!' })
    ).not.toBeInTheDocument()
  })
})
