import { describe, expect, it } from 'vitest'

describe('test code', () => {
  it('3 + 5 should be 8', () => {
    expect(3 + 5).toBe(8)
  })
})

describe('something truthy and falsy', () => {
  it('true to be true', () => {
    expect(true).toBe(true)
  })

  it('false to be false', () => {
    expect(false).toBe(false)
  })
})
