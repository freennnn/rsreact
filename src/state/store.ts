import { combineReducers, configureStore } from '@reduxjs/toolkit'

import pageNumberReducer from '../pages/GalleryPage/pageNumberSlice'
import selectedItemsReducer from '../pages/GalleryPage/selectedItemsSlice'
import { githubApi } from '../services/githubApi'

export const store = configureStore({
  reducer: {
    [githubApi.reducerPath]: githubApi.reducer,
    pageNumber: pageNumberReducer,
    selectedItems: selectedItemsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(githubApi.middleware),
})

// Tets:
const rootReducer = combineReducers({
  [githubApi.reducerPath]: githubApi.reducer,
  pageNumber: pageNumberReducer,
  selectedItems: selectedItemsReducer,
})

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(githubApi.middleware),
  })
}

// Infer the type of `store`
//export type AppStore1 = typeof store
export type AppStore = ReturnType<typeof setupStore>

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch
// Same for the `RootState` type
//export type RootState = ReturnType<typeof store.getState>
export type RootState = ReturnType<typeof rootReducer>
