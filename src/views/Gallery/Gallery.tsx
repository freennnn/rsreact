import { useCallback, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { GalleryItem } from '../../components/GalleryItem/GalleryItem';
import { Loader } from '../../components/Loader/Loader';
import { Search } from '../../components/Search/Search';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  useRepositoriesQuery,
  type Repository,
} from '../../hooks/useRepositoriesQuery';
import { repositoryKeys } from '../../query/queryKeys';
import {
  selectionSelectors,
  useSelectionStore,
} from '../../store/selectionStore';
import './Gallery.css';

export type { Repository };

interface GalleryProps {
  currentPage?: number;
  onPageChange?(nextPage: number): void;
  onSearchInputChange?(): void;
  onRepositoryOpen?(repositoryId: number): void;
}

const ITEMS_PER_PAGE = 3;

export function Gallery({
  currentPage = 1,
  onPageChange,
  onSearchInputChange,
  onRepositoryOpen,
}: GalleryProps) {
  const queryClient = useQueryClient();
  const selectedRepositoryIds = useSelectionStore(
    selectionSelectors.selectedRepositoryIds
  );
  const toggleRepositorySelection = useSelectionStore(
    (state) => state.toggleRepositorySelection
  );
  const [savedSearchTerm, setSavedSearchTerm] = useLocalStorage<string>(
    'SavedSearchTerm',
    ''
  );
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(() =>
    savedSearchTerm.trim()
  );

  const {
    repositories,
    totalCount,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useRepositoriesQuery(submittedSearchTerm, currentPage);

  useEffect(() => {
    const trimmed = savedSearchTerm.trim();
    if (trimmed !== savedSearchTerm) {
      setSavedSearchTerm(trimmed);
    }
  }, [savedSearchTerm, setSavedSearchTerm]);

  const onSearchButtonClick = useCallback(
    (trimmedFromSearch: string) => {
      if (trimmedFromSearch !== submittedSearchTerm) {
        setSubmittedSearchTerm(trimmedFromSearch);
        setSavedSearchTerm(trimmedFromSearch);
        return;
      }

      if (isError) {
        void refetch();
      }
    },
    [isError, refetch, setSavedSearchTerm, submittedSearchTerm]
  );

  const onRefresh = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: repositoryKeys.list(submittedSearchTerm, currentPage),
    });
  }, [currentPage, queryClient, submittedSearchTerm]);

  const isLoading = isPending || isFetching;
  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : 'Something went wrong.'
    : null;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="GalleryView">
      <section
        className="gallery-search-section"
        aria-label="Search repositories"
      >
        <Search
          searchTerm={submittedSearchTerm}
          onSearchButtonClick={onSearchButtonClick}
          onSearchInputChange={onSearchInputChange}
        />
      </section>
      <section className="gallery-results-section" aria-label="Search results">
        <div className="gallery-results-toolbar">
          <button type="button" onClick={onRefresh}>
            Refresh
          </button>
        </div>
        {isLoading ? (
          <div
            className="gallery-results-loader"
            role="status"
            aria-live="polite"
          >
            <Loader />
          </div>
        ) : null}
        {!isLoading && errorMessage ? (
          <div className="gallery-error" role="alert">
            {errorMessage}
          </div>
        ) : null}
        {!isLoading && !errorMessage ? (
          repositories && repositories.length > 0 ? (
            <ul className="gallery-results-list">
              {repositories.map((item) => (
                <li key={item.id} className="gallery-results-list-item">
                  <GalleryItem
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    language={item.language}
                    htmlUrl={item.htmlUrl}
                    detailsUrl={item.detailsUrl}
                    isSelected={selectedRepositoryIds.includes(item.id)}
                    onOpenDetails={() => onRepositoryOpen?.(item.id)}
                    onToggleSelection={() => toggleRepositorySelection(item)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="gallery-empty">No repositories loaded.</p>
          )
        ) : null}
        {!isLoading && !errorMessage && repositories ? (
          <nav className="gallery-pagination" aria-label="Results pagination">
            <button
              type="button"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={!canGoPrev}
            >
              Previous
            </button>
            <span className="gallery-pagination-current">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={!canGoNext}
            >
              Next
            </button>
          </nav>
        ) : null}
      </section>
    </div>
  );
}
