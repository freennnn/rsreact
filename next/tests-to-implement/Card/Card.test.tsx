import { render, screen } from '@testing-library/react'

import { Card } from '../../components/Card/Card'
import { Repository } from '../../data/types'

const repository: Repository = {
  id: 1,
  name: 'test repo',
  description: 'test description',
  language: 'ru',
  stargazers_count: 1000,
  forks_count: 999,
  updated_at: '14-07-2024',
  contributors_url: 'https://github.com/freennnn',
  owner: {
    login: 'freennnn',
    avatar_url: 'some avatar url',
    type: 'definitely cool type',
  },
}

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
    expect(await screen.findByText(/test description/)).toBeInTheDocument()
    expect(await screen.findByText(/test repo/)).toBeInTheDocument()
  })
})
