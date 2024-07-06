const DEFAULT_SEARCH_QUERY = 'react'
const PATH_BASE = 'https://api.github.com'
const PATH_SEARCH = '/search/repositories'
const PARAM_SEARCH = 'q='
const PARAMS_ADDITIONAL = '&sort=starts&page=1&per_page=3'

// We set default value to searchTerm, cause github.api doesn't allow to fetch "all"
// repositories, we fetch "all" react repos instead
export async function getRepositores(searchTerm = DEFAULT_SEARCH_QUERY) {
  return fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}${PARAMS_ADDITIONAL}`)
    .then(response => response.json())
}