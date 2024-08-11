import { fireEvent, screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import nextRouterMock from 'next-router-mock'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider'

import GalleryPage from '../../GalleryPageClient.tsx'
import { RepositoriesSearchResult, Repository } from '../../data/types.ts'
import server from '../mock-api-server.ts'
import { repoDetails } from '../mock-data/repoDetails.ts'
import { repoSearchData } from '../mock-data/repoSearch.ts'

vi.mock('next/router', () => nextRouterMock)

vi.mock('next/navigation', () => ({
  ...require('next-router-mock'),
  useSearchParams: () =>
    new URLSearchParams({ search: 'react', page: '1', owner: 'mockedOwner', name: 'mockedName' }),
}))

beforeEach(() => {
  server.use(
    http.get(
      'https://api.github.com/search/repositories?q=react&sort=starts&per_page=5&page=1',
      () => {
        return HttpResponse.json(repoSearchData)
      },
    ),
  ),
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
})

test('galleryView render', async () => {
  nextRouterMock.push('/?search=react&page=1&owner=mockedOwner&name=mockedName')

  render(
    <MemoryRouterProvider url={'/?search=react&page=1&owner=mockedOwner&name=mockedName'}>
      <GalleryPage
        repoSearch={repoSearchData as unknown as RepositoriesSearchResult}
        repoDetails={repoDetails as Repository}
      />
    </MemoryRouterProvider>,
  )
  screen.debug()
  //fireEvent.click(screen.getByRole('button', { name: /Search/i }))
  expect(
    await screen.findByText(/The library for web and native user interfaces/),
  ).toBeInTheDocument()
  fireEvent.click(screen.getAllByRole('checkbox')[1])

  expect(await screen.findByText(/1 items is selected/)).toBeInTheDocument()
  fireEvent.click(screen.getAllByRole('checkbox')[1])

  //fireEvent.click(screen.getByRole('button', { name: /Unselect all/i }))
  expect(await screen.queryByText(/1 items is selected/i)).not.toBeInTheDocument()
  fireEvent.click(screen.getByText(/The library for web and native user interfaces/))
  fireEvent.click(screen.getAllByRole('checkbox')[1])
  fireEvent.click(screen.getAllByRole('checkbox')[2])
  //fireEvent.click(screen.getByRole('button', { name: /Download all/i }))
  fireEvent.click(screen.getByRole('button', { name: /Unselect all/i }))
  expect(await screen.queryByText(/2 items is selected/i)).not.toBeInTheDocument()
  // triggering Theme toggle box
  fireEvent.click(screen.getAllByRole('checkbox')[0])
  fireEvent.click(screen.getByRole('button', { name: /Search/i }))
})
