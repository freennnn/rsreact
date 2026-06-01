import { useQueryClient } from '@tanstack/react-query';
import { vi } from 'vitest';

import { getRepositores, type GitHubSearchResponse } from '../services/api';
import {
  act,
  createTestQueryClient,
  renderQueryHook,
  waitFor,
} from '../test-utils/render';
import { repositoryKeys } from './queryKeys';
import { useRepositoriesQuery } from '../hooks/useRepositoriesQuery';

vi.mock('../services/api', () => ({
  getRepositores: vi.fn(),
}));

const mockedGetRepositores = vi.mocked(getRepositores);

function buildResponse(
  items: GitHubSearchResponse['items']
): GitHubSearchResponse {
  return { items, total_count: items.length };
}

describe('query cache invalidation', () => {
  beforeEach(() => {
    mockedGetRepositores.mockReset();
  });

  it('refetches list data after invalidateQueries is called', async () => {
    mockedGetRepositores
      .mockResolvedValueOnce(
        buildResponse([
          {
            id: 1,
            name: 'before/invalidate',
            description: 'Before',
            language: 'TypeScript',
          },
        ])
      )
      .mockResolvedValueOnce(
        buildResponse([
          {
            id: 1,
            name: 'after/invalidate',
            description: 'After',
            language: 'TypeScript',
          },
        ])
      );

    const queryClient = createTestQueryClient();

    const { result: queryResult } = renderQueryHook(
      () => useRepositoriesQuery('react', 1),
      { queryClient }
    );

    await waitFor(() => {
      expect(queryResult.current.isSuccess).toBe(true);
    });
    expect(queryResult.current.repositories?.[0]?.name).toBe(
      'before/invalidate'
    );
    expect(mockedGetRepositores).toHaveBeenCalledTimes(1);

    const { result: clientResult } = renderQueryHook(() => useQueryClient(), {
      queryClient,
    });

    await act(async () => {
      await clientResult.current.invalidateQueries({
        queryKey: repositoryKeys.list('react', 1),
      });
    });

    await waitFor(() => {
      expect(queryResult.current.repositories?.[0]?.name).toBe(
        'after/invalidate'
      );
    });
    expect(mockedGetRepositores).toHaveBeenCalledTimes(2);
  });
});
