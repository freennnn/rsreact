import { useDispatch, useSelector } from 'react-redux'

import { combineReducers, configureStore } from '@reduxjs/toolkit'

import usersReducer from './usersSlice'

export const store = configureStore({
  reducer: {
    usersReducer: usersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

const rootReducer = combineReducers({
  usersReducer: usersReducer,
})

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  })
}

// Infer the type of `store`
export type AppStore = ReturnType<typeof setupStore>

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch
// Same for the `RootState` type
export type RootState = ReturnType<typeof rootReducer>
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
