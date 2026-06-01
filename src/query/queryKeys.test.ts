import { describe, expect, it } from 'vitest';

import { repositoryKeys } from './queryKeys';

describe('repositoryKeys', () => {
  it('builds stable list and detail keys', () => {
    expect(repositoryKeys.list('react', 2)).toEqual([
      'repositories',
      'list',
      'react',
      2,
    ]);
    expect(repositoryKeys.detail(42)).toEqual(['repositories', 'detail', 42]);
  });

  it('uses list and detail prefixes for invalidation', () => {
    expect(repositoryKeys.lists()).toEqual(['repositories', 'list']);
    expect(repositoryKeys.details()).toEqual(['repositories', 'detail']);
  });
});
