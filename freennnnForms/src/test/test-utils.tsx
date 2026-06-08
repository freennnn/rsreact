import { PropsWithChildren, ReactElement } from 'react'
import { Provider } from 'react-redux'

import { type RenderOptions, fireEvent, render } from '@testing-library/react'

import { type AppStore, setupStore } from '../data/store'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: AppStore
}

export function renderWithProviders(
  ui: ReactElement,
  { store = setupStore(), ...renderOptions }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export function createValidAvatarFile(): File {
  return new File(['avatar'], 'avatar.png', { type: 'image/png' })
}

export function uploadAvatarFile(input: HTMLInputElement) {
  const file = createValidAvatarFile()

  Object.defineProperty(input, 'files', {
    configurable: true,
    value: [file],
  })

  fireEvent.change(input, { target: { files: [file] } })
}
