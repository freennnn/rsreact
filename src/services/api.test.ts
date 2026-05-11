import { vi } from 'vitest'

import { getRepositores } from './api'

function createMockResponse({
  ok,
  status,
  json,
}: {
  ok: boolean
  status: number
  json: () => Promise<unknown>
}): Response {
  return {
    ok,
    status,
    json,
  } as Response
}

describe('getRepositores', () => {
  it('uses the default query when the search term is empty', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      createMockResponse({
        ok: true,
        status: 200,
        json: async () => ({ items: [] }),
      })
    )

    await getRepositores('')

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.github.com/search/repositories?q=allitems&page=1&per_page=3'
    )
  })

  it('encodes the search term in the request URL', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      createMockResponse({
        ok: true,
        status: 200,
        json: async () => ({ items: [] }),
      })
    )

    await getRepositores('react query')

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.github.com/search/repositories?q=react%20query&page=1&per_page=3'
    )
  })

  it('returns parsed data on a successful response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      createMockResponse({
        ok: true,
        status: 200,
        json: async () => ({
          items: [
            {
              id: 1,
              name: 'tanstack/query',
              description: 'Powerful async state management',
              language: 'TypeScript',
            },
          ],
        }),
      })
    )

    await expect(getRepositores('tanstack')).resolves.toEqual({
      items: [
        {
          id: 1,
          name: 'tanstack/query',
          description: 'Powerful async state management',
          language: 'TypeScript',
        },
      ],
    })
  })

  it('throws the API message for non-ok responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      createMockResponse({
        ok: false,
        status: 403,
        json: async () => ({ message: 'API rate limit exceeded' }),
      })
    )

    await expect(getRepositores('tanstack')).rejects.toThrow(
      'API rate limit exceeded'
    )
  })

  it('falls back to the status code when the error body cannot be parsed', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      createMockResponse({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })
    )

    await expect(getRepositores('tanstack')).rejects.toThrow(
      'Request failed (500)'
    )
  })
})
