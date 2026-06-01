import { useQuery } from '@tanstack/react-query';

import { repositoryKeys } from '../query/queryKeys';
import { getRepositoryById } from '../services/api';

export function useRepositoryDetailsQuery(detailsId: number, enabled = true) {
  return useQuery({
    queryKey: repositoryKeys.detail(detailsId),
    queryFn: () => getRepositoryById(detailsId),
    enabled: enabled && detailsId > 0,
  });
}
