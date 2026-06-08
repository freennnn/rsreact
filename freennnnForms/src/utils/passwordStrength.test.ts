import { describe, expect, it } from 'vitest'

import { getPasswordCriteria } from './passwordStrength'

describe('getPasswordCriteria', () => {
  it('marks all criteria unmet for an empty password', () => {
    const criteria = getPasswordCriteria('')
    expect(criteria.every((criterion) => !criterion.met)).toBe(true)
  })

  it('marks all criteria met for a strong password', () => {
    const criteria = getPasswordCriteria('Abcdef1!')
    expect(criteria.every((criterion) => criterion.met)).toBe(true)
  })

  it('detects minimum length independently', () => {
    expect(getPasswordCriteria('Abc1!').find((c) => c.id === 'length')?.met).toBe(false)
    expect(getPasswordCriteria('Abcdef1!').find((c) => c.id === 'length')?.met).toBe(true)
  })

  it('detects each criterion independently', () => {
    expect(getPasswordCriteria('abcdef1!').find((c) => c.id === 'uppercase')?.met).toBe(false)
    expect(getPasswordCriteria('ABCDEF1!').find((c) => c.id === 'lowercase')?.met).toBe(false)
    expect(getPasswordCriteria('Abcdefg!').find((c) => c.id === 'number')?.met).toBe(false)
    expect(getPasswordCriteria('Abcdefg1').find((c) => c.id === 'special')?.met).toBe(false)
  })
})
