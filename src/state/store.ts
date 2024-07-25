import { configureStore } from '@reduxjs/toolkit'

import pageNumberReducer from '../pages/GalleryPage/pageNumberSlice'
import { githubApi } from '../services/githubApi'

export const store = configureStore({
  reducer: {
    [githubApi.reducerPath]: githubApi.reducer,
    pageNumber: pageNumberReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(githubApi.middleware),
})

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch
// Same for the `RootState` type
export type RootState = ReturnType<typeof store.getState>
