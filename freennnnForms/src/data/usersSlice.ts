import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from './store'
import type { User } from './types'

interface InitialStateType {
  users: User[]
  lastAddedUserId: string | null
}

const initialState: InitialStateType = {
  users: [],
  lastAddedUserId: null,
}

export const usersSlice = createSlice({
  name: 'usersSlice',
  initialState: initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload)
      state.lastAddedUserId = action.payload.id
    },
  },
})

export const { addUser } = usersSlice.actions
export const selectUsers = (state: RootState) => state.usersReducer.users
export const selectLastAddedUserId = (state: RootState) => state.usersReducer.lastAddedUserId
export default usersSlice.reducer
