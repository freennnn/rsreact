import { vi } from 'vitest';

import { getRepositores, type GitHubSearchResponse } from '../services/api';
import { act, renderQueryHook, waitFor } from '../test-utils/render';
import { createDeferred } from '../test-utils/deferred';
import { useRepositoriesQuery } from './useRepositoriesQuery';

vi.mock('../services/api', () => ({
  getRepositores: vi.fn(),
}));

const mockedGetRepositores = vi.mocked(getRepositores);

function buildResponse(
  items: GitHubSearchResponse['items']
): GitHubSearchResponse {
  return { items, total_count: items.length };
}

describe('useRepositoriesQuery', () => {
  beforeEach(() => {
    mockedGetRepositores.mockReset();
  });

  it('returns loading state while the request is pending', async () => {
    const deferred = createDeferred<GitHubSearchResponse>();
    mockedGetRepositores.mockReturnValue(deferred.promise);

    const { result } = renderQueryHook(() =>
      useRepositoriesQuery('tanstack', 1)
    );

    expect(result.current.isPending).toBe(true);
    expect(result.current.repositories).toBeNull();
    expect(mockedGetRepositores).toHaveBeenCalledWith('tanstack', 1);

    await act(async () => {
      deferred.resolve(
        buildResponse([
          {
            id: 1,
            name: 'tanstack/query',
            description: 'Async state',
            language: 'TypeScript',
          },
        ])
      );
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
    expect(result.current.repositories).toEqual([
      {
        id: 1,
        name: 'tanstack/query',
        description: 'Async state',
        language: 'TypeScript',
        htmlUrl: '',
        detailsUrl: '',
      },
    ]);
    expect(result.current.totalCount).toBe(1);
  });

  it('returns an error when the request fails', async () => {
    mockedGetRepositores.mockRejectedValue(
      new Error('GitHub rate limit exceeded')
    );

    const { result } = renderQueryHook(() =>
      useRepositoriesQuery('tanstack', 1)
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error?.message).toBe('GitHub rate limit exceeded');
    expect(result.current.repositories).toBeNull();
  });

  it('reuses cached data for the same search term and page', async () => {
    mockedGetRepositores.mockResolvedValue(
      buildResponse([
        {
          id: 2,
          name: 'tanstack/router',
          description: 'Router',
          language: 'TypeScript',
        },
      ])
    );

    const { result, rerender } = renderQueryHook(() =>
      useRepositoriesQuery('tanstack', 1)
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(mockedGetRepositores).toHaveBeenCalledTimes(1);

    rerender();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(mockedGetRepositores).toHaveBeenCalledTimes(1);
    expect(result.current.repositories?.[0]?.name).toBe('tanstack/router');
  });

  it('fetches again when the page changes', async () => {
    mockedGetRepositores
      .mockResolvedValueOnce(
        buildResponse([
          {
            id: 3,
            name: 'page-one/repo',
            description: 'Page one',
            language: 'TypeScript',
          },
        ])
      )
      .mockResolvedValueOnce(
        buildResponse([
          {
            id: 4,
            name: 'page-two/repo',
            description: 'Page two',
            language: 'JavaScript',
          },
        ])
      );

    const { result, rerender } = renderQueryHook(
      ({ searchTerm, page }: { searchTerm: string; page: number }) =>
        useRepositoriesQuery(searchTerm, page),
      { initialProps: { searchTerm: 'react', page: 1 } }
    );

    await waitFor(() => {
      expect(result.current.repositories?.[0]?.name).toBe('page-one/repo');
    });
    expect(mockedGetRepositores).toHaveBeenCalledTimes(1);

    rerender({ searchTerm: 'react', page: 2 });

    await waitFor(() => {
      expect(result.current.repositories?.[0]?.name).toBe('page-two/repo');
    });
    expect(mockedGetRepositores).toHaveBeenCalledTimes(2);
  });
});
