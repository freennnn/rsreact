import { afterEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from './queryClient';

describe('createQueryClient', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the default cache TTL when the env variable is unset', () => {
    const client = createQueryClient();
    const defaults = client.getDefaultOptions().queries;

    expect(defaults?.staleTime).toBe(300_000);
    expect(defaults?.gcTime).toBe(300_000);
    expect(defaults?.retry).toBe(false);
  });

  it('uses a custom cache TTL from the environment variable', () => {
    vi.stubEnv('NEXT_PUBLIC_QUERY_CACHE_TTL_MS', '120000');

    const client = createQueryClient();
    const defaults = client.getDefaultOptions().queries;

    expect(defaults?.staleTime).toBe(120_000);
    expect(defaults?.gcTime).toBe(120_000);
  });

  it('falls back to the default TTL when the env value is invalid', () => {
    vi.stubEnv('NEXT_PUBLIC_QUERY_CACHE_TTL_MS', 'not-a-number');

    const client = createQueryClient();
    const defaults = client.getDefaultOptions().queries;

    expect(defaults?.staleTime).toBe(300_000);
    expect(defaults?.gcTime).toBe(300_000);
  });

  it('falls back to the default TTL when the env value is negative', () => {
    vi.stubEnv('NEXT_PUBLIC_QUERY_CACHE_TTL_MS', '-1');

    const client = createQueryClient();
    const defaults = client.getDefaultOptions().queries;

    expect(defaults?.staleTime).toBe(300_000);
  });
});
