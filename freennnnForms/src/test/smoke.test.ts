import { describe, expect, it } from 'vitest'

describe('test setup', () => {
  it('runs vitest with jsdom and jest-dom matchers', () => {
    const element = document.createElement('div')
    element.textContent = 'hello'
    document.body.appendChild(element)
    expect(element).toBeInTheDocument()
  })
})
