import { vi } from 'vitest';

import {
  getRepositoryById,
  type GitHubRepositoryDetails,
} from '../../services/api';
import {
  act,
  createTestQueryClient,
  renderWithUser,
  screen,
  waitFor,
} from '../../test-utils/render';
import { createDeferred } from '../../test-utils/deferred';
import { DetailsPanel } from './DetailsPanel';

vi.mock('../../services/api', () => ({
  getRepositoryById: vi.fn(),
}));

const mockedGetRepositoryById = vi.mocked(getRepositoryById);

const sampleDetails: GitHubRepositoryDetails = {
  id: 42,
  full_name: 'tanstack/query',
  description: 'Async state management',
  language: 'TypeScript',
  stargazers_count: 100,
  html_url: 'https://github.com/tanstack/query',
  owner: { login: 'tanstack' },
};

describe('DetailsPanel', () => {
  beforeEach(() => {
    mockedGetRepositoryById.mockReset();
  });

  it('shows a loader while repository details are loading', async () => {
    const deferred = createDeferred<GitHubRepositoryDetails>();
    mockedGetRepositoryById.mockReturnValue(deferred.promise);

    renderWithUser(<DetailsPanel detailsId={42} onClose={vi.fn()} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(mockedGetRepositoryById).toHaveBeenCalledWith(42);

    await act(async () => {
      deferred.resolve(sampleDetails);
    });

    expect(await screen.findByText('tanstack/query')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('renders repository details on success', async () => {
    mockedGetRepositoryById.mockResolvedValue(sampleDetails);

    renderWithUser(<DetailsPanel detailsId={42} onClose={vi.fn()} />);

    expect(await screen.findByText('tanstack/query')).toBeInTheDocument();
    expect(screen.getByText('Async state management')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Open on GitHub' })
    ).toHaveAttribute('href', 'https://github.com/tanstack/query');
  });

  it('renders an error message when the request fails', async () => {
    mockedGetRepositoryById.mockRejectedValue(
      new Error('Repository not found')
    );

    renderWithUser(<DetailsPanel detailsId={42} onClose={vi.fn()} />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Repository not found'
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('reuses cached details when the same repository is opened again', async () => {
    mockedGetRepositoryById.mockResolvedValue(sampleDetails);
    const queryClient = createTestQueryClient();
    const onClose = vi.fn();

    const { unmount } = renderWithUser(
      <DetailsPanel detailsId={42} onClose={onClose} />,
      queryClient
    );

    expect(await screen.findByText('tanstack/query')).toBeInTheDocument();
    expect(mockedGetRepositoryById).toHaveBeenCalledTimes(1);

    unmount();
    renderWithUser(
      <DetailsPanel detailsId={42} onClose={onClose} />,
      queryClient
    );

    expect(await screen.findByText('tanstack/query')).toBeInTheDocument();
    expect(mockedGetRepositoryById).toHaveBeenCalledTimes(1);
  });

  it('refetches when refresh is clicked after data was cached', async () => {
    mockedGetRepositoryById
      .mockResolvedValueOnce({
        ...sampleDetails,
        description: 'Before refresh',
      })
      .mockResolvedValueOnce({
        ...sampleDetails,
        description: 'After refresh',
      });

    const { user } = renderWithUser(
      <DetailsPanel detailsId={42} onClose={vi.fn()} />
    );

    expect(await screen.findByText('Before refresh')).toBeInTheDocument();
    expect(mockedGetRepositoryById).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Refresh' }));

    expect(await screen.findByText('After refresh')).toBeInTheDocument();
    await waitFor(() => {
      expect(mockedGetRepositoryById).toHaveBeenCalledTimes(2);
    });
  });

  it('calls onClose when the close button is clicked', async () => {
    mockedGetRepositoryById.mockResolvedValue(sampleDetails);
    const onClose = vi.fn();
    const { user } = renderWithUser(
      <DetailsPanel detailsId={42} onClose={onClose} />
    );

    await screen.findByText('tanstack/query');
    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
