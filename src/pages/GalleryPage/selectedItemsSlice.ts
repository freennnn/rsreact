import { createSlice } from '@reduxjs/toolkit'

import type { Repository } from '../../services/types'
import type { RootState } from '../../state/store'

export const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState: {
    selectedRepositores: new Array<Repository>(),
    // used to be Set (elegant and algorithmically suits here well), but Redux and Immer complain
    // about non-serializable values, so Array is used instead
    selectedIds: new Array<number>(),
  },
  reducers: {
    addRepository: (state, action) => {
      state.selectedRepositores.push(action.payload)
      state.selectedIds.push(action.payload.id)
    },
    removeRepository: (state, action) => {
      state.selectedRepositores = state.selectedRepositores.filter(
        (item) => item.id !== action.payload.id,
      )
      state.selectedIds = state.selectedIds.filter((item) => item !== action.payload.id)
    },
    removeAllRepositories: (state) => {
      state.selectedRepositores = []
      state.selectedIds = []
    },
  },
})

export const { addRepository, removeRepository, removeAllRepositories } = selectedItemsSlice.actions

export const selectSelectedIds = (state: RootState) => state.selectedItems.selectedIds
export const selectSelectedRepositores = (state: RootState) =>
  state.selectedItems.selectedRepositores

export default selectedItemsSlice.reducer
