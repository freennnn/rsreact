export const repositoryKeys = {
  all: ['repositories'] as const,
  lists: () => [...repositoryKeys.all, 'list'] as const,
  list: (searchTerm: string, page: number) =>
    [...repositoryKeys.lists(), searchTerm, page] as const,
  details: () => [...repositoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...repositoryKeys.details(), id] as const,
};
