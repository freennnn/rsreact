import { fireEvent, screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import mockRouter from 'next-router-mock'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider'

//import GalleryPage from '../../../pages/index.tsx'
import AppThemeProvider from '../../components/AppThemeProvider.tsx'
import GalleryView from '../../components/GalleryView/GalleryView.tsx'
import { RepositoriesSearchResult } from '../../data/types.ts'
import server from '../mock-api-server.ts'
//import { repoDetails } from '../mock-data/repoDetails.ts'
import { repoSearchData } from '../mock-data/repoSearch.ts'

vi.mock('next/router', () => vi.importActual('next-router-mock'))

beforeEach(() => {
  server.use(
    http.get(
      'https://api.github.com/search/repositories?q=react&sort=starts&per_page=5&page=1',
      //'https://api.github.com/search/',
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
  mockRouter.push('/?search=react&page=1&owner=mockedOwner&name=mockedName')

  render(
    <AppThemeProvider>
      <MemoryRouterProvider url={'/?search=react&page=1&owner=mockedOwner&name=mockedName'}>
        <GalleryView
          repoSearch={repoSearchData as unknown as RepositoriesSearchResult}
          repoDetails={undefined}
        />
      </MemoryRouterProvider>
    </AppThemeProvider>,
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

//TODO: somewhy whole Page only renders empty body/div, not even layout, figure out if it's possible in future
//<body>
//  <div />
//</body>
/*
test('renders GalleryPage with all components', async () => {
  mockRouter.push('/?search=react&page=1&owner=mockedOwner&name=mockedName')
  console.log(mockRouter.asPath)
  render(
    <MemoryRouterProvider url={'/?search=react&page=1&owner=mockedOwner&name=mockedName'}>
      <GalleryPage
        repoSearch={repoSearchData as unknown as RepositoriesSearchResult}
        repoDetails={repoDetails as Repository}
      />
    </MemoryRouterProvider>,
  )
  screen.debug()

  fireEvent.click(screen.getByRole('button', { name: /Search/i }))
  expect(
    await screen.findByText(/The library for web and native user interfaces/),
  ).toBeInTheDocument()

  expect(await screen.findByText(/1 items is selected/)).toBeInTheDocument()
  //fireEvent.click(screen.getByRole('button', { name: /Download all/i }))
  fireEvent.click(screen.getByRole('button', { name: /Unselect all/i }))
  expect(await screen.queryByText(/1 items is selected/i)).not.toBeInTheDocument()
  fireEvent.click(screen.getByText(/The library for web and native user interfaces/))
  //expect(await screen.queryByText(/Owner:fabebook/i)).toBeInTheDocument()
})
*/
