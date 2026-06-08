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
    age: '36',
    password: 'strongPassword',
    gender: 'male',
    termsAndContions: true,
    avatarImage:
      'https://img.ifunny.co/images/657f48cc8acb3723795d27f954be1d9e59d5a6dd74ea5208c777ec1c11c394b5_1.jpg',
    country: 'Poland',
  },
  {
    id: uuidv4(),
    name: 'Kristina',
    email: 'kristina@marketing.pl',
    age: '28',
    password: 'mediumPassword',
    gender: 'female',
    termsAndContions: true,
    avatarImage:
      'https://preview.redd.it/purrrr-fancy-v0-aeb8uyk6gtxa1.jpg?width=640&crop=smart&auto=webp&s=fcbd638da5143a8c5b25848b48d01271bc789eaf',
    country: 'Belarus',
  },
]

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
