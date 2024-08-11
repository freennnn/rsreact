import { render, screen } from '@testing-library/react'

import GalleryPage from '../../../../pages/index.tsx'
import Layout from '../../../components/layout'
import { repoDetails } from '../../mock-data/repoDetails.ts'
import { repoSearchData } from '../../mock-data/repoSearch.ts'

test('should render layout', async () => {
  render(
    <Layout>
      <GalleryPage repoSearch={repoSearchData} repoDetails={repoDetails}></GalleryPage>
    </Layout>,
  )
  screen.debug()
})
