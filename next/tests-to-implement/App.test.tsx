//TODO: should be doable, yet can't figure out how exactly to render the whole next app
/*
import { render, screen } from '@testing-library/react'
import mockRouter from 'next-router-mock'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider'

import App from '../../pages/_app.tsx'
import GalleryPage from '../../pages/index.tsx'
import { RepositoriesSearchResult, Repository } from '../data/types.ts'
import { repoDetails } from './mock-data/repoDetails.ts'
import { repoSearchData } from './mock-data/repoSearch.ts'

vi.mock('next/router', () => vi.importActual('next-router-mock'))
// check if App components renders headline
describe('App', () => {
  it('renders headline', () => {
    render(
      <MemoryRouterProvider url={'/?search=react&page=1&owner=mockedOwner&name=mockedName'}>
        \{' '}
        <App
          Component={GalleryPage}
          router:mockRouter
          pageProps={(repoSearchData, repoDetails)}
        ></App>
      </MemoryRouterProvider>,
    )

    screen.debug()
  })
})
*/
