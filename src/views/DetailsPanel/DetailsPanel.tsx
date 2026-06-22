import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { Loader } from '../../components/Loader/Loader';
import { useRepositoryDetailsQuery } from '../../hooks/useRepositoryDetailsQuery';
import { repositoryKeys } from '../../query/queryKeys';

interface DetailsPanelProps {
  detailsId: number;
  onClose(): void;
}

export function DetailsPanel({ detailsId, onClose }: DetailsPanelProps) {
  const queryClient = useQueryClient();
  const {
    data: details,
    isPending,
    isFetching,
    isError,
    error,
  } = useRepositoryDetailsQuery(detailsId);

  const onRefresh = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: repositoryKeys.detail(detailsId),
    });
  }, [detailsId, queryClient]);

  const isLoading = isPending || isFetching;
  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : 'Failed to load repository.'
    : null;

  return (
    <aside
      className="app-page details-panel"
      aria-label="Selected repository details"
    >
      <button type="button" className="details-panel-close" onClick={onClose}>
        Close
      </button>
      <h2>Repository details</h2>
      <div className="details-panel-toolbar">
        <button type="button" onClick={onRefresh}>
          Refresh
        </button>
      </div>
      {isLoading ? (
        <div role="status" aria-live="polite" className="details-panel-loader">
          <Loader />
        </div>
      ) : null}
      {!isLoading && errorMessage ? (
        <p role="alert" className="details-panel-error">
          {errorMessage}
        </p>
      ) : null}
      {!isLoading && !errorMessage && details ? (
        <div className="details-panel-content">
          <p>
            <strong>ID:</strong> {details.id}
          </p>
          <p>
            <strong>Name:</strong> {details.full_name}
          </p>
          <p>
            <strong>Owner:</strong> {details.owner.login}
          </p>
          <p>
            <strong>Language:</strong> {details.language ?? 'Unknown'}
          </p>
          <p>
            <strong>Stars:</strong> {details.stargazers_count}
          </p>
          <p>{details.description ?? 'No description provided.'}</p>
          <p>
            <a href={details.html_url} target="_blank" rel="noreferrer">
              Open on GitHub
            </a>
          </p>
        </div>
      ) : null}
    </aside>
  );
}
