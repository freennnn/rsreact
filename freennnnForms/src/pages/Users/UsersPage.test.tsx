import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { setupStore } from '../../data/store'
import { renderWithProviders } from '../../test/test-utils'
import UsersPage from './UsersPage'

describe('UsersPage', () => {
  it('renders user cards from the store', () => {
    renderWithProviders(<UsersPage />, {
      store: setupStore({
        usersReducer: {
          users: [
            {
              id: '1',
              name: 'Alex',
              email: 'alex@example.com',
              age: '30',
              password: 'Abcdef1!',
              gender: 'male',
              termsAndContions: true,
              avatarImage: 'data:image/png;base64,abc',
              country: 'Poland',
            },
          ],
          lastAddedUserId: '1',
        },
      }),
    })

    expect(screen.getByText('User Management')).toBeInTheDocument()
    expect(screen.getByText('Alex')).toBeInTheDocument()
  })

  it('shows an empty state when there are no users', () => {
    renderWithProviders(<UsersPage />, {
      store: setupStore({
        usersReducer: { users: [], lastAddedUserId: null },
      }),
    })

    expect(screen.getByText('No users were created yet')).toBeInTheDocument()
  })

  it('opens hook and uncontrolled registration modals', async () => {
    const user = userEvent.setup()

    renderWithProviders(<UsersPage />)

    await user.click(screen.getByRole('button', { name: 'Add user with React Hook Form' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'React Hook Form Registration' }),
    ).toBeInTheDocument()

    await user.click(screen.getByLabelText('Close modal'))

    await user.click(screen.getByRole('button', { name: 'Add user with uncontrolled Form' }))
    expect(
      screen.getByRole('heading', { name: 'Uncontrolled Form Registration' }),
    ).toBeInTheDocument()
  })
})
