const DEFAULT_SEARCH_QUERY = 'allitems'
const PATH_BASE = 'https://api.github.com'
const PATH_SEARCH = '/search/repositories'
const PARAM_SEARCH = 'q='
const PARAMS_ADDITIONAL = '&sort=starts&page=1&per_page=3'

// github.api doesn't allow to fetch unspecified 'all'
// repositories - so we fetch 'allitems' repos instead
export async function getRepositores(searchTerm: string) {
  return fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm? searchTerm: DEFAULT_SEARCH_QUERY}${PARAMS_ADDITIONAL}`)
    .then(response => response.json())
}