import { render, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import mockRouter from 'next-router-mock'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider'

import CardDetails from '../../../components/CardDetails/CardDetails'
import { Repository } from '../../../data/types'
import server from '../../mock-api-server'
import { repoDetails } from '../../mock-data/repoDetails'

beforeEach(() => {
  server.use(
    http.get('https://api.github.com/repos/mockedOwner/mockedName', () => {
      return HttpResponse.json(repoDetails as Repository)
    }),
  )
})

it('renders CardDetails with mocked JSON', async () => {
  mockRouter.push('/?search=react&page=1&owner=mockedOwner&name=mockedName')
  console.log(mockRouter.asPath)
  render(
    <MemoryRouterProvider url={'/?search=react&page=1&owner=mockedOwner&name=mockedName'}>
      <CardDetails repo={repoDetails} />
    </MemoryRouterProvider>,
  )

  expect(await screen.findByText(/duxianwei520/)).toBeInTheDocument()
})
