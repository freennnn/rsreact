import { render, screen } from '@testing-library/react'

import RootLayout from '../../layout.tsx'

test('should render layout', async () => {
  render(
    <RootLayout>
      <button className='ssr page'></button>
    </RootLayout>,
  )
  screen.debug()
  screen.getAllByRole('button')[0]
  // <div id=root
  //screen.getAllByRole('div')[1]
})
