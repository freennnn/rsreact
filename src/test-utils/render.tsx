import type { ReactElement } from 'react';

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export { act, fireEvent, render, screen, waitFor, within };

export function renderWithUser(ui: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(ui),
  };
}
