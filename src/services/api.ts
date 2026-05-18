const DEFAULT_SEARCH_QUERY = 'allitems';
const PATH_BASE = 'https://api.github.com';
const PATH_SEARCH = '/search/repositories';
const PARAM_SEARCH = 'q=';
const PER_PAGE = 3;

export interface GitHubSearchResponse {
  total_count?: number;
  items: Array<{
    id: number;
    name: string;
    description: string | null;
    language: string | null;
  }>;
}

// GitHub search API does not allow an empty query; use a default token instead.
export async function getRepositores(
  searchTerm: string,
  page = 1
): Promise<GitHubSearchResponse> {
  const query = searchTerm ? searchTerm : DEFAULT_SEARCH_QUERY;
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const response = await fetch(
    `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${encodeURIComponent(query)}&page=${safePage}&per_page=${PER_PAGE}`
  );

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const payload = body as { message?: string } | null;
    const message =
      typeof payload?.message === 'string'
        ? payload.message
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return body as GitHubSearchResponse;
}
