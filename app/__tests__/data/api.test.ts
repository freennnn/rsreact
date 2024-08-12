import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { getRepositores, getRepository } from '../../data/api.ts'
import { RepositoriesSearchResult, Repository } from '../../data/types.ts'
import server from '../mock-api-server.ts'
import { repoDetails } from '../mock-data/repoDetails.ts'
import { repoSearchData } from '../mock-data/repoSearch.ts'

beforeEach(() => {
  server.use(
    http.get(
      'https://api.github.com/search/repositories?q=react&sort=starts&per_page=5&page=1',
      () => {
        return HttpResponse.json(repoSearchData)
      },
    ),
    http.get(
      'https://api.github.com/search/repositories?q=react&sort=starts&per_page=5&page=1&owner=duxianwei520&name=react',
      () => {
        return HttpResponse.json(repoDetails)
      },
    ),
  )
})

describe('getRepositores', () => {
  it('msw should intercept that', async () => {
    const repositoriesResponse: RepositoriesSearchResult = await getRepositores('react', 1)
    expect(repositoriesResponse.items.length).toBe(5)
  })
})

describe('getRepositoryDetails', () => {
  it('msw should intercept that', async () => {
    const repositoryResponse: Repository = await getRepository('duxianwei520', 'react')
    expect(repositoryResponse.owner.login).toBe('duxianwei520')
  })
})
