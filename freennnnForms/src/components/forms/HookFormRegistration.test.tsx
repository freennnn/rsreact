import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { setupStore } from '../../data/store'
import { selectUsers } from '../../data/usersSlice'
import { testCountries, validRegistrationInput } from '../../test/formFixtures'
import { createValidAvatarFile, renderWithProviders } from '../../test/test-utils'
import { HookFormRegistration } from './HookFormRegistration'

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

async function fillValidHookForm(user: ReturnType<typeof userEvent.setup>) {
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
  await user.upload(screen.getByLabelText(/^Avatar:/) as HTMLInputElement, createValidAvatarFile())
  await user.type(screen.getByRole('combobox'), validRegistrationInput.country)
}

describe('HookFormRegistration', () => {
  it('renders registration fields', () => {
    renderWithProviders(<HookFormRegistration onSuccess={vi.fn()} />, {
      store: createTestStore(),
    })

    expect(screen.getByLabelText(/^Name:/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
  })

  it('shows validation errors for invalid input', async () => {
    const user = userEvent.setup()

    renderWithProviders(<HookFormRegistration onSuccess={vi.fn()} />, {
      store: createTestStore(),
    })

    await user.type(screen.getByLabelText(/^Name:/), 'alex')

    await waitFor(() => {
      expect(screen.getByText('Name should be upper cased')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
  })

  it('enables submit and dispatches user on valid submission', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()

    const { store } = renderWithProviders(<HookFormRegistration onSuccess={onSuccess} />, {
      store: createTestStore(),
    })

    await fillValidHookForm(user)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled()
    })

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
      expect(selectUsers(store.getState())).toHaveLength(1)
      expect(selectUsers(store.getState())[0].country).toBe(validRegistrationInput.country)
    })
  })
})
