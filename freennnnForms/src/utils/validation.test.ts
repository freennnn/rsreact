import { describe, expect, it } from 'vitest'

import { isValidEmail } from './validation'

describe('isValidEmail', () => {
  it('accepts a basic valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('rejects missing local part', () => {
    expect(isValidEmail('@example.com')).toBe(false)
  })

  it('rejects missing domain', () => {
    expect(isValidEmail('user@')).toBe(false)
  })

  it('rejects multiple @ characters', () => {
    expect(isValidEmail('user@@example.com')).toBe(false)
  })

  it('rejects domain without a dot', () => {
    expect(isValidEmail('user@example')).toBe(false)
  })
})
