import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../../state/store'

export const pageNumberSlice = createSlice({
  name: 'pageNumber',
  initialState: {
    value: 1,
  },
  reducers: {
    setPage: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { setPage } = pageNumberSlice.actions
export const selectPageNumber = (state: RootState) => state.pageNumber.value

export default pageNumberSlice.reducer
