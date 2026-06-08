import { describe, expect, it } from 'vitest'

import { countryNames } from './countries'
import { selectCountryNames } from './countriesSlice'
import { setupStore } from './store'

describe('countriesSlice', () => {
  it('stores country names in initial state', () => {
    const store = setupStore()
    expect(selectCountryNames(store.getState())).toEqual(countryNames)
  })

  it('exposes a non-empty country list', () => {
    const store = setupStore()
    expect(selectCountryNames(store.getState()).length).toBeGreaterThan(0)
  })
})
