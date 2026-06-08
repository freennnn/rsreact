import { useState } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CountryAutocomplete } from './CountryAutocomplete'

function ControlledCountryAutocomplete({
  countries,
  onChange = vi.fn(),
}: {
  countries: string[]
  onChange?: (value: string) => void
}) {
  const [value, setValue] = useState('')

  return (
    <CountryAutocomplete
      id='country'
      countries={countries}
      value={value}
      onChange={(nextValue) => {
        setValue(nextValue)
        onChange(nextValue)
      }}
    />
  )
}

const countries = ['Poland', 'Germany', 'France', 'Peru', 'United States']

describe('CountryAutocomplete', () => {
  it('shows country options when the input is focused', async () => {
    const user = userEvent.setup()

    render(<CountryAutocomplete id='country' countries={countries} />)

    await user.click(screen.getByRole('combobox'))

    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Poland' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Germany' })).toBeInTheDocument()
  })

  it('filters options on the first typed letter', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<ControlledCountryAutocomplete countries={countries} onChange={onChange} />)

    await user.type(screen.getByRole('combobox'), 'P')

    expect(onChange).toHaveBeenLastCalledWith('P')
    expect(screen.getByRole('combobox')).toHaveValue('P')
    expect(screen.getByRole('option', { name: 'Poland' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Peru' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Germany' })).not.toBeInTheDocument()
  })

  it('filters options while typing', async () => {
    const user = userEvent.setup()

    render(<ControlledCountryAutocomplete countries={countries} />)

    await user.type(screen.getByRole('combobox'), 'pol')

    expect(screen.getByRole('option', { name: 'Poland' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Germany' })).not.toBeInTheDocument()
  })

  it('selects a country from the dropdown', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<ControlledCountryAutocomplete countries={countries} onChange={onChange} />)

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'France' }))

    expect(onChange).toHaveBeenLastCalledWith('France')
  })

  it('disables browser autocomplete attributes', () => {
    render(<CountryAutocomplete id='country' countries={countries} />)

    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('autocomplete', 'off')
    expect(input).toHaveAttribute('autocorrect', 'off')
    expect(input).toHaveAttribute('spellcheck', 'false')
  })
})
