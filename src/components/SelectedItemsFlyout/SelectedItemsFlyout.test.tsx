import { vi } from 'vitest';

import {
  resetSelectionStore,
  useSelectionStore,
} from '../../store/selectionStore';
import { renderWithUser, screen } from '../../test-utils/render';
import { SelectedItemsFlyout } from './SelectedItemsFlyout';

function buildSelectedRepository(id: number) {
  return {
    id,
    name: `repo-${id}`,
    description: `Description ${id}`,
    language: 'TypeScript',
    htmlUrl: `https://github.com/example/repo-${id}`,
    detailsUrl: `https://github.com/example/repo-${id}`,
  };
}

describe('SelectedItemsFlyout', () => {
  beforeEach(() => {
    resetSelectionStore();
  });

  it('does not render when there are no selected items', () => {
    renderWithUser(<SelectedItemsFlyout />);

    expect(
      screen.queryByRole('region', { name: 'Selected items summary' })
    ).not.toBeInTheDocument();
  });

  it('renders selected count when there are selected items', () => {
    useSelectionStore.getState().selectRepository(buildSelectedRepository(1));
    useSelectionStore.getState().selectRepository(buildSelectedRepository(2));

    renderWithUser(<SelectedItemsFlyout />);

    expect(
      screen.getByRole('region', { name: 'Selected items summary' })
    ).toBeInTheDocument();
    expect(screen.getByText('Selected items:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('clears selection when clicking Unselect all', async () => {
    useSelectionStore.getState().selectRepository(buildSelectedRepository(1));
    const { user } = renderWithUser(<SelectedItemsFlyout />);

    await user.click(screen.getByRole('button', { name: 'Unselect all' }));

    expect(useSelectionStore.getState().selectedRepositoryIds).toEqual([]);
    expect(
      screen.queryByRole('region', { name: 'Selected items summary' })
    ).not.toBeInTheDocument();
  });

  it('calls download handler when clicking Download', async () => {
    const onDownloadSelected = vi.fn();
    useSelectionStore.getState().selectRepository(buildSelectedRepository(7));
    const { user } = renderWithUser(
      <SelectedItemsFlyout onDownloadSelected={onDownloadSelected} />
    );

    await user.click(screen.getByRole('button', { name: 'Download' }));

    expect(onDownloadSelected).toHaveBeenCalledTimes(1);
  });
});
