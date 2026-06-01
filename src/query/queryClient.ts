import { QueryClient } from '@tanstack/react-query';

const DEFAULT_CACHE_TTL_MS = 300_000;

function parseCacheTtlMs(): number {
  const raw = import.meta.env.VITE_QUERY_CACHE_TTL_MS;
  if (raw === undefined || raw === '') {
    return DEFAULT_CACHE_TTL_MS;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return DEFAULT_CACHE_TTL_MS;
  }

  return parsed;
}

export function createQueryClient(): QueryClient {
  const staleTime = parseCacheTtlMs();

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime,
        gcTime: staleTime,
        retry: false,
      },
    },
  });
}
