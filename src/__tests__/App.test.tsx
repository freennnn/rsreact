import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { render, screen } from '@testing-library/react'

import { App } from '../App'
import { store } from '../state/store'

describe('App', () => {
  it('renders headline', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        ,
      </Provider>,
    )

    screen.debug()

    // check if App components renders headline
  })
})
