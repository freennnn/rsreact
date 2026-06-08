import { createSlice } from '@reduxjs/toolkit'

import { countryNames } from './countries'
import type { RootState } from './store'

interface CountriesState {
  names: string[]
}

const initialState: CountriesState = {
  names: countryNames,
}

export const countriesSlice = createSlice({
  name: 'countriesSlice',
  initialState,
  reducers: {},
})

export const selectCountryNames = (state: RootState) => state.countriesReducer.names
export default countriesSlice.reducer
