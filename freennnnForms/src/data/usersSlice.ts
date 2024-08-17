import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

import type { RootState } from './store'
import type { User } from './types'

interface InitialStateType {
  users: User[]
  lastAddedUserId: string | null
}

const tempUsers: User[] = [
  {
    id: uuidv4(),
    name: 'Alex',
    email: 'alex@hiremenow.com',
    age: 36,
    password: 'strongPassword',
    gender: 'male',
    termsAccepted: true,
    image: 'kindaImage',
    country: 'Poland',
  },
  {
    id: uuidv4(),
    name: 'Kristina',
    email: 'kristina@marketing.pl',
    age: 28,
    password: 'mediumPassword',
    gender: 'female',
    termsAccepted: true,
    image: 'kindaImage',
    country: 'Belarus',
  },
]

// const initialState: InitialStateType = {
//   users: new Array<User>(),
//   lastAddedUserId: null,
// }
const initialState: InitialStateType = {
  users: tempUsers,
  lastAddedUserId: tempUsers[1].id,
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
