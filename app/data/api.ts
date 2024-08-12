const DEFAULT_SEARCH_QUERY = 'allitems'
const PATH_BASE = 'https://api.github.com'
const PATH_SEARCH = '/search/repositories'
const PARAM_SEARCH = 'q='
const PARAMS_ADDITIONAL = '&sort=starts&per_page=5&page='
const PATH_REPOS = '/repos'

// github.api doesn't allow to fetch unspecified 'all'
// repositories - so we fetch 'allitems' repos instead
export async function getRepositores(searchTerm: string | undefined, pageNumber: number) {
  return fetch(
    `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm ? searchTerm : DEFAULT_SEARCH_QUERY}${PARAMS_ADDITIONAL}${pageNumber}`,
    { cache: 'no-store' },
  ).then((response) => response.json())
}

export async function getRepository(owner: string, name: string) {
  return fetch(`${PATH_BASE}${PATH_REPOS}/${owner}/${name}`, { cache: 'no-store' }).then(
    (response) => response.json(),
  )
}
