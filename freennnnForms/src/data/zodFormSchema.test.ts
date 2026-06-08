import { describe, expect, it } from 'vitest'

import { testCountries, validRegistrationInput } from '../test/formFixtures'
import { createValidAvatarFile } from '../test/test-utils'
import { createFormSchema } from './zodFormSchema'

describe('createFormSchema', () => {
  const schema = createFormSchema(testCountries)

  it('accepts valid registration data', () => {
    const result = schema.safeParse({
      ...validRegistrationInput,
      termsAndContions: true,
      avatar: createValidAvatarFile(),
    })

    expect(result.success).toBe(true)
  })

  it('rejects a name without an uppercase first letter', () => {
    const result = schema.safeParse({
      ...validRegistrationInput,
      name: 'alex',
      termsAndContions: true,
      avatar: createValidAvatarFile(),
    })

    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const result = schema.safeParse({
      ...validRegistrationInput,
      email: 'invalid-email',
      termsAndContions: true,
      avatar: createValidAvatarFile(),
    })

    expect(result.success).toBe(false)
  })

  it('rejects mismatched passwords', () => {
    const result = schema.safeParse({
      ...validRegistrationInput,
      confirmPassword: 'Different1!',
      termsAndContions: true,
      avatar: createValidAvatarFile(),
    })

    expect(result.success).toBe(false)
  })

  it('rejects a country outside the stored list', () => {
    const result = schema.safeParse({
      ...validRegistrationInput,
      country: 'Atlantis',
      termsAndContions: true,
      avatar: createValidAvatarFile(),
    })

    expect(result.success).toBe(false)
  })
})
