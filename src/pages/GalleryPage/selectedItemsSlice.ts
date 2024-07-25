import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../../state/store'

export const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState: {
    // used to be Set (elegant and algorithmically suits here well), but Redux and Immer complain
    // about non-serializable values, so Array is used instead
    selectedIds: new Array<number>(),
  },
  reducers: {
    addId: (state, action) => {
      state.selectedIds.push(action.payload)
    },
    removeId: (state, action) => {
      state.selectedIds = state.selectedIds.filter((item) => item !== action.payload)
    },
  },
})

export const { addId, removeId } = selectedItemsSlice.actions
export const selectSelectedIds = (state: RootState) => state.selectedItems.selectedIds

export default selectedItemsSlice.reducer
