import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

//import { configureStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'

// As a basic setup, import your same slice reducers
// import pageNumberReducer from '../../pages/GalleryPage/pageNumberSlice'
// import selectedItemsReducer from '../../pages/GalleryPage/selectedItemsSlice'
// import { githubApi } from '../../services/githubApi'
import type { AppStore, RootState } from '../../state/store'
import { setupStore } from '../../state/store'

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

export function renderWithProviders(
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
) {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions

  const Wrapper = ({ children }: PropsWithChildren) => <Provider store={store}>{children}</Provider>

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}
