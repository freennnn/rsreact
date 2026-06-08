import { describe, expect, it } from 'vitest'

import { setupStore } from './store'
import { addUser, selectLastAddedUserId, selectUsers } from './usersSlice'

describe('usersSlice', () => {
  it('addUser appends a user and updates lastAddedUserId', () => {
    const store = setupStore({
      usersReducer: { users: [], lastAddedUserId: null },
    })

    const newUser = {
      id: 'user-1',
      name: 'Alex',
      email: 'alex@example.com',
      age: '30',
      password: 'Abcdef1!',
      gender: 'male',
      termsAndContions: true,
      avatarImage: 'data:image/png;base64,abc',
      country: 'Poland',
    }

    store.dispatch(addUser(newUser))

    const state = store.getState()
    expect(selectUsers(state)).toHaveLength(1)
    expect(selectUsers(state)[0]).toEqual(newUser)
    expect(selectLastAddedUserId(state)).toBe('user-1')
  })
})
