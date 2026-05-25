import { vi } from 'vitest';

import { renderWithUser, screen } from '../../test-utils/render';
import { GalleryItem } from './GalleryItem';

describe('GalleryItem', () => {
  it('renders repository name, description, language, and checkbox', () => {
    renderWithUser(
      <GalleryItem
        id={1}
        name="tanstack/query"
        description="Powerful async state management"
        language="TypeScript"
      />
    );

    expect(screen.getByText('tanstack/query')).toBeInTheDocument();
    expect(
      screen.getByText('Powerful async state management')
    ).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Select repository 1' })
    ).toBeInTheDocument();
  });

  it('checkbox toggles selection without opening details', async () => {
    const onOpenDetails = vi.fn();
    const onToggleSelection = vi.fn();
    const { user } = renderWithUser(
      <GalleryItem
        id={1}
        name="tanstack/query"
        description="Powerful async state management"
        language="TypeScript"
        onOpenDetails={onOpenDetails}
        onToggleSelection={onToggleSelection}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: 'Select repository 1' }));

    expect(onToggleSelection).toHaveBeenCalledTimes(1);
    expect(onOpenDetails).not.toHaveBeenCalled();
  });

  it('clicking item content opens details without toggling selection', async () => {
    const onOpenDetails = vi.fn();
    const onToggleSelection = vi.fn();
    const { user } = renderWithUser(
      <GalleryItem
        id={1}
        name="tanstack/query"
        description="Powerful async state management"
        language="TypeScript"
        onOpenDetails={onOpenDetails}
        onToggleSelection={onToggleSelection}
      />
    );

    await user.click(screen.getByRole('button', { name: /tanstack\/query/i }));

    expect(onOpenDetails).toHaveBeenCalledTimes(1);
    expect(onToggleSelection).not.toHaveBeenCalled();
  });
});
