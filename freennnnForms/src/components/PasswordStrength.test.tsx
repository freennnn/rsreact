import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PasswordStrength } from './PasswordStrength'

describe('PasswordStrength', () => {
  it('renders all password criteria', () => {
    render(<PasswordStrength password='' />)

    expect(screen.getByText(/At least 8 characters/)).toBeInTheDocument()
    expect(screen.getByText(/1 number/)).toBeInTheDocument()
    expect(screen.getByText(/1 uppercase letter/)).toBeInTheDocument()
    expect(screen.getByText(/1 lowercase letter/)).toBeInTheDocument()
    expect(screen.getByText(/1 special character/)).toBeInTheDocument()
  })

  it('marks satisfied criteria for a strong password', () => {
    render(<PasswordStrength password='Abcdef1!' />)

    expect(screen.getAllByText(/^✓/).length).toBe(5)
  })
})
