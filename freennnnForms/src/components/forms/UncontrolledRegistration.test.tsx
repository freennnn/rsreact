import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { setupStore } from '../../data/store'
import { selectUsers } from '../../data/usersSlice'
import { testCountries, validRegistrationInput } from '../../test/formFixtures'
import { renderWithProviders, uploadAvatarFile } from '../../test/test-utils'
import { UncontrolledRegistration } from './UncontrolledRegistration'

vi.mock('../../data/imageUtils', async () => {
  const actual =
    await vi.importActual<typeof import('../../data/imageUtils')>('../../data/imageUtils')

  return {
    ...actual,
    convertImageToBase64: vi.fn().mockResolvedValue('data:image/png;base64,abc'),
  }
})

function createTestStore() {
  return setupStore({
    usersReducer: { users: [], lastAddedUserId: null },
    countriesReducer: { names: testCountries },
  })
}

async function fillValidUncontrolledForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Name:/), validRegistrationInput.name)
  await user.type(screen.getByLabelText(/^Age:/), validRegistrationInput.age)
  await user.type(screen.getByLabelText(/^Email:/), validRegistrationInput.email)
  await user.type(screen.getByLabelText(/^Password:$/), validRegistrationInput.password)
  await user.type(
    screen.getByLabelText(/^Confirm Password:/),
    validRegistrationInput.confirmPassword,
  )
  await user.click(screen.getByLabelText('Male'))
  await user.click(screen.getByLabelText('Accept terms and conditions'))
  uploadAvatarFile(screen.getByLabelText(/^Avatar:/) as HTMLInputElement)
  await user.type(screen.getByRole('combobox'), validRegistrationInput.country)
}

describe('UncontrolledRegistration', () => {
  it('renders registration fields', () => {
    renderWithProviders(<UncontrolledRegistration onSuccess={vi.fn()} />, {
      store: createTestStore(),
    })

    expect(screen.getByLabelText(/^Name:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Country:/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('shows validation errors on submit with empty fields', async () => {
    const user = userEvent.setup()

    renderWithProviders(<UncontrolledRegistration onSuccess={vi.fn()} />, {
      store: createTestStore(),
    })

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Name should be upper cased')).toBeInTheDocument()
    })
  })

  it('submits valid data and calls onSuccess', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()

    const { store } = renderWithProviders(<UncontrolledRegistration onSuccess={onSuccess} />, {
      store: createTestStore(),
    })

    await fillValidUncontrolledForm(user)
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
      expect(selectUsers(store.getState())).toHaveLength(1)
      expect(selectUsers(store.getState())[0].name).toBe(validRegistrationInput.name)
    })
  })
})
