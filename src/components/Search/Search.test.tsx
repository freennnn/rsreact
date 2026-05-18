import { vi } from 'vitest';

import { renderWithUser, screen, waitFor } from '../../test-utils/render';
import { Search } from './Search';

describe('Search', () => {
  it('renders an empty input when no saved term exists', () => {
    const onSearchButtonClick = vi.fn();

    renderWithUser(<Search onSearchButtonClick={onSearchButtonClick} />);

    expect(screen.getByPlaceholderText('Search..')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Generate Error' })
    ).toBeInTheDocument();
  });

  it('renders the provided searchTerm prop value', async () => {
    renderWithUser(
      <Search searchTerm="tanstack" onSearchButtonClick={vi.fn()} />
    );

    expect(await screen.findByDisplayValue('tanstack')).toBeInTheDocument();
  });

  it('updates the input value when the user types', async () => {
    const { user } = renderWithUser(<Search onSearchButtonClick={vi.fn()} />);

    const input = screen.getByPlaceholderText('Search..');

    await user.type(input, 'react query');

    expect(input).toHaveValue('react query');
  });

  it('trims whitespace and calls the search callback on submit', async () => {
    const onSearchButtonClick = vi.fn();
    const { user } = renderWithUser(
      <Search onSearchButtonClick={onSearchButtonClick} />
    );

    const input = screen.getByPlaceholderText('Search..');
    await user.type(input, '  react query  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearchButtonClick).toHaveBeenCalledWith('react query');
    await waitFor(() => {
      expect(input).toHaveValue('react query');
    });
  });

  it('syncs the input when the searchTerm prop changes', async () => {
    const onSearchButtonClick = vi.fn();
    const { rerender } = renderWithUser(
      <Search searchTerm="react" onSearchButtonClick={onSearchButtonClick} />
    );

    expect(screen.getByDisplayValue('react')).toBeInTheDocument();

    rerender(
      <Search searchTerm="tanstack" onSearchButtonClick={onSearchButtonClick} />
    );

    expect(await screen.findByDisplayValue('tanstack')).toBeInTheDocument();
  });
});
