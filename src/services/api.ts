const DEFAULT_SEARCH_QUERY = 'allitems';
const PATH_BASE = 'https://api.github.com';
const PATH_SEARCH = '/search/repositories';
const PARAM_SEARCH = 'q=';
const PARAMS_ADDITIONAL = '&sort=stars&page=1&per_page=3';

export interface GitHubSearchResponse {
  items: Array<{
    id: number;
    name: string;
    description: string | null;
    language: string | null;
  }>;
}

// GitHub search API does not allow an empty query; use a default token instead.
export async function getRepositores(
  searchTerm: string
): Promise<GitHubSearchResponse> {
  const query = searchTerm ? searchTerm : DEFAULT_SEARCH_QUERY;
  const response = await fetch(
    `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${encodeURIComponent(query)}${PARAMS_ADDITIONAL}`
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
