import { describe, expect, it } from 'vitest';

import { createQueryClient } from './queryClient';

describe('createQueryClient', () => {
  it('uses the default cache TTL when the env variable is unset', () => {
    const client = createQueryClient();
    const defaults = client.getDefaultOptions().queries;

    expect(defaults?.staleTime).toBe(300_000);
    expect(defaults?.gcTime).toBe(300_000);
    expect(defaults?.retry).toBe(false);
  });
});
