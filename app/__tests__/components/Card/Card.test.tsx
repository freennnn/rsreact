import { render, screen } from '@testing-library/react'

import { Card } from '../../../components/Card/Card'
import { Repository } from '../../../data/types'
import { repoDetails } from '../../mock-data/repoDetails.ts'

const repository = repoDetails as Repository

const onClick = () => {
  console.log('you wanted onclick? I gave you onclick!')
}

describe('Card Component', () => {
  it('Should render Card component', async () => {
    render(
      <Card
        repository={repository}
        onClick={onClick}
        selected={false}
        onSelectToggle={() => {
          console.log('do nothing')
        }}
      />,
    )

    // const paragraphElement = screen.getByRole('paragraph')
    // const expectedText = 'test repo'
    // expect(paragraphElement).toHaveTextContent(expectedText)
    expect(await screen.findByText(/react/)).toBeInTheDocument()
    expect(await screen.findByText(/webpack/)).toBeInTheDocument()
  })
})
