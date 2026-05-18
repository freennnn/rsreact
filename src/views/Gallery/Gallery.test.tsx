import { vi } from 'vitest'

import { getRepositores, type GitHubSearchResponse } from '../../services/api'
import { act, renderWithUser, screen, waitFor } from '../../test-utils/render'
import { createDeferred } from '../../test-utils/deferred'
import { Gallery } from './Gallery'

vi.mock('../../services/api', () => ({
  getRepositores: vi.fn(),
}))

const mockedGetRepositores = vi.mocked(getRepositores)

function buildResponse(
  items: GitHubSearchResponse['items']
): GitHubSearchResponse {
  return { items, total_count: items.length }
}

describe('Gallery', () => {
  beforeEach(() => {
    mockedGetRepositores.mockReset()
  })

  it('loads saved search term from localStorage on mount and renders results', async () => {
    localStorage.setItem('SavedSearchTerm', '  tanstack  ')
    mockedGetRepositores.mockResolvedValue(
      buildResponse([
        {
          id: 1,
          name: 'tanstack/query',
          description: 'Powerful async state management',
          language: 'TypeScript',
        },
      ])
    )

    renderWithUser(<Gallery />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(mockedGetRepositores).toHaveBeenCalledWith('tanstack', 1)
    expect(await screen.findByDisplayValue('tanstack')).toBeInTheDocument()
    expect(await screen.findByText('tanstack/query')).toBeInTheDocument()
    expect(
      screen.getByText('Powerful async state management')
    ).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('SavedSearchTerm') ?? '""')).toBe(
      'tanstack'
    )
  })

  it('keeps the loader visible while the initial request is pending', async () => {
    const deferred = createDeferred<GitHubSearchResponse>()
    mockedGetRepositores.mockReturnValue(deferred.promise)

    renderWithUser(<Gallery />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Search repositories' })).toBeInTheDocument()

    await act(async () => {
      deferred.resolve(
        buildResponse([
          {
            id: 2,
            name: 'tanstack/router',
            description: 'Router',
            language: 'TypeScript',
          },
        ])
      )
    })

    expect(await screen.findByText('tanstack/router')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  it('renders the empty state when the API returns no items', async () => {
    mockedGetRepositores.mockResolvedValue(buildResponse([]))

    renderWithUser(<Gallery />)

    expect(
      await screen.findByText('No repositories loaded.')
    ).toBeInTheDocument()
  })

  it('renders an error message when the API request fails', async () => {
    mockedGetRepositores.mockRejectedValue(new Error('GitHub rate limit exceeded'))

    renderWithUser(<Gallery />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'GitHub rate limit exceeded'
    )
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('trims submitted input, saves it, and fetches new results', async () => {
    mockedGetRepositores
      .mockResolvedValueOnce(
        buildResponse([
          {
            id: 3,
            name: 'initial/repo',
            description: 'Initial result',
            language: 'JavaScript',
          },
        ])
      )
      .mockResolvedValueOnce(
        buildResponse([
          {
            id: 4,
            name: 'react/query',
            description: 'Trimmed search result',
            language: 'TypeScript',
          },
        ])
      )

    const { user } = renderWithUser(<Gallery />)

    expect(await screen.findByText('initial/repo')).toBeInTheDocument()

    const input = screen.getByPlaceholderText('Search..')
    await user.clear(input)
    await user.type(input, '  react query  ')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    await waitFor(() => {
      expect(mockedGetRepositores).toHaveBeenLastCalledWith('react query', 1)
    })
    await waitFor(() => {
      expect(screen.getByDisplayValue('react query')).toBeInTheDocument()
    })
    expect(
      JSON.parse(localStorage.getItem('SavedSearchTerm') ?? '""')
    ).toBe('react query')
    expect(await screen.findByText('react/query')).toBeInTheDocument()
  })

  it('does not fetch again when the same successful search is submitted', async () => {
    localStorage.setItem('SavedSearchTerm', 'tanstack')
    mockedGetRepositores.mockResolvedValue(
      buildResponse([
        {
          id: 5,
          name: 'tanstack/table',
          description: 'Table utilities',
          language: 'TypeScript',
        },
      ])
    )

    const { user } = renderWithUser(<Gallery />)

    expect(await screen.findByText('tanstack/table')).toBeInTheDocument()
    expect(mockedGetRepositores).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Search' }))

    await waitFor(() => {
      expect(mockedGetRepositores).toHaveBeenCalledTimes(1)
    })
  })

  it('retries the same search term after a failed request', async () => {
    localStorage.setItem('SavedSearchTerm', 'tanstack')
    mockedGetRepositores
      .mockRejectedValueOnce(new Error('Temporary failure'))
      .mockResolvedValueOnce(
        buildResponse([
          {
            id: 6,
            name: 'tanstack/form',
            description: 'Forms',
            language: 'TypeScript',
          },
        ])
      )

    const { user } = renderWithUser(<Gallery />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Temporary failure'
    )
    expect(mockedGetRepositores).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Search' }))

    await waitFor(() => {
      expect(mockedGetRepositores).toHaveBeenCalledTimes(2)
    })
    expect(await screen.findByText('tanstack/form')).toBeInTheDocument()
  })
})
