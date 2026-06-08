import { describe, expect, it } from 'vitest'

import { filterCountries } from './countryAutocomplete'

const countries = ['Poland', 'Germany', 'France', 'Peru', 'United States']

describe('filterCountries', () => {
  it('returns all countries for an empty query', () => {
    expect(filterCountries(countries, '')).toEqual(countries)
  })

  it('filters by prefix on the first letter', () => {
    expect(filterCountries(countries, 'P')).toEqual(['Poland', 'Peru'])
  })

  it('falls back to includes when no country starts with the query', () => {
    expect(filterCountries(countries, 'ted')).toEqual(['United States'])
  })
})
