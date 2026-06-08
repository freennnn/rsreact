import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Card } from './Card'

const user = {
  id: '1',
  name: 'Alex',
  email: 'alex@example.com',
  age: '30',
  password: 'Abcdef1!',
  gender: 'male',
  termsAndContions: true as const,
  avatarImage: 'data:image/png;base64,abc',
  country: 'Poland',
}

describe('Card', () => {
  it('renders user details and avatar', () => {
    render(<Card user={user} wasAddedLast={false} />)

    expect(screen.getByText('Alex')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('alex@example.com')).toBeInTheDocument()
    expect(screen.getByText('male')).toBeInTheDocument()
    expect(screen.getByText('Poland')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Alex' })).toHaveAttribute(
      'src',
      'data:image/png;base64,abc',
    )
  })

  it('applies highlight class for the last added user', () => {
    const { container } = render(<Card user={user} wasAddedLast={true} />)

    expect(container.firstChild).toHaveClass('last')
  })
})
