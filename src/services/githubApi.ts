import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { RepositoriesSearchResult, Repository } from './types'

export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.github.com' }),
  endpoints: (builder) => ({
    getRepository: builder.query<Repository, { name: string; owner: string }>({
      query: ({ name, owner }) => `/repos/${owner}/${name}`,
    }),
    getRepositories: builder.query<
      RepositoriesSearchResult,
      { searchTerm: string; pageNumber: number }
    >({
      query: ({ searchTerm, pageNumber }) =>
        `/search/repositories?q=${searchTerm}&sort=starts&per_page=5&page=${pageNumber}`,
    }),
  }),
})
