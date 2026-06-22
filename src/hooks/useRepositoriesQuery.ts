import { useQuery } from '@tanstack/react-query';

import { repositoryKeys } from '../query/queryKeys';
import { getRepositores } from '../services/api';

export interface Repository {
  id: number;
  name: string;
  description: string;
  language: string;
  htmlUrl: string;
  detailsUrl: string;
}

function mapSearchItemToRepository(
  item: Awaited<ReturnType<typeof getRepositores>>['items'][number]
): Repository {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? '',
    language: item.language ?? '',
    htmlUrl: item.html_url ?? '',
    detailsUrl: item.html_url ?? '',
  };
}

export function useRepositoriesQuery(searchTerm: string, page: number) {
  const query = useQuery({
    queryKey: repositoryKeys.list(searchTerm, page),
    queryFn: () => getRepositores(searchTerm, page),
  });

  const repositories = query.data
    ? query.data.items.map(mapSearchItemToRepository)
    : null;

  return {
    ...query,
    repositories,
    totalCount: query.data?.total_count ?? 0,
  };
}
