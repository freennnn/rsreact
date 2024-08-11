export interface Repository {
  id: number
  name: string
  description: string
  language: string
  stargazers_count: number
  forks_count: number
  updated_at: string
  contributors_url: string
  owner: {
    login: string
    avatar_url: string
    type: string
  }
}

export interface RepositoriesSearchResult {
  total_count: number
  items: [Repository]
}
