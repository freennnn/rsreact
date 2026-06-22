const DEFAULT_SEARCH_QUERY = 'allitems';
const PATH_BASE = 'https://api.github.com';
const PATH_SEARCH = '/search/repositories';
const PARAM_SEARCH = 'q=';
const PER_PAGE = 3;

interface NextRequestConfig {
  revalidate?: number;
  tags?: string[];
}

interface ApiRequestOptions extends RequestInit {
  next?: NextRequestConfig;
}

export interface GitHubSearchResponse {
  total_count?: number;
  items: Array<{
    id: number;
    name: string;
    description: string | null;
    language: string | null;
    html_url?: string;
  }>;
}

export interface GitHubRepositoryDetails {
  id: number;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  owner: {
    login: string;
    avatar_url?: string;
  };
}

// GitHub search API does not allow an empty query; use a default token instead.
export async function getRepositores(
  searchTerm: string,
  page = 1,
  requestOptions?: ApiRequestOptions
): Promise<GitHubSearchResponse> {
  const query = searchTerm ? searchTerm : DEFAULT_SEARCH_QUERY;
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const requestUrl = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${encodeURIComponent(query)}&page=${safePage}&per_page=${PER_PAGE}`;
  const response = requestOptions
    ? await fetch(requestUrl, requestOptions)
    : await fetch(requestUrl);

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

export async function getRepositoryById(
  detailsId: number,
  requestOptions?: ApiRequestOptions
): Promise<GitHubRepositoryDetails> {
  const requestUrl = `${PATH_BASE}/repositories/${detailsId}`;
  const response = requestOptions
    ? await fetch(requestUrl, requestOptions)
    : await fetch(requestUrl);

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

  return body as GitHubRepositoryDetails;
}
