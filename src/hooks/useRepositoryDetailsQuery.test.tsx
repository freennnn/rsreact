import { vi } from 'vitest';

import {
  getRepositoryById,
  type GitHubRepositoryDetails,
} from '../services/api';
import { act, renderQueryHook, waitFor } from '../test-utils/render';
import { createDeferred } from '../test-utils/deferred';
import { useRepositoryDetailsQuery } from './useRepositoryDetailsQuery';

vi.mock('../services/api', () => ({
  getRepositoryById: vi.fn(),
}));

const mockedGetRepositoryById = vi.mocked(getRepositoryById);

const sampleDetails: GitHubRepositoryDetails = {
  id: 42,
  full_name: 'tanstack/query',
  description: 'Async state management',
  language: 'TypeScript',
  stargazers_count: 100,
  html_url: 'https://github.com/tanstack/query',
  owner: { login: 'tanstack' },
};

describe('useRepositoryDetailsQuery', () => {
  beforeEach(() => {
    mockedGetRepositoryById.mockReset();
  });

  it('returns loading state while the request is pending', async () => {
    const deferred = createDeferred<GitHubRepositoryDetails>();
    mockedGetRepositoryById.mockReturnValue(deferred.promise);

    const { result } = renderQueryHook(() => useRepositoryDetailsQuery(42));

    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(mockedGetRepositoryById).toHaveBeenCalledWith(42);

    await act(async () => {
      deferred.resolve(sampleDetails);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
    expect(result.current.data).toEqual(sampleDetails);
  });

  it('returns an error when the request fails', async () => {
    mockedGetRepositoryById.mockRejectedValue(
      new Error('Repository not found')
    );

    const { result } = renderQueryHook(() => useRepositoryDetailsQuery(42));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error?.message).toBe('Repository not found');
  });

  it('does not fetch when disabled', async () => {
    renderQueryHook(() => useRepositoryDetailsQuery(42, false));

    await waitFor(() => {
      expect(mockedGetRepositoryById).not.toHaveBeenCalled();
    });
  });

  it('reuses cached data when the same repository is requested again', async () => {
    mockedGetRepositoryById.mockResolvedValue(sampleDetails);

    const { result, rerender } = renderQueryHook(() =>
      useRepositoryDetailsQuery(42)
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(mockedGetRepositoryById).toHaveBeenCalledTimes(1);

    rerender();

    await waitFor(() => {
      expect(result.current.data?.full_name).toBe('tanstack/query');
    });
    expect(mockedGetRepositoryById).toHaveBeenCalledTimes(1);
  });
});
