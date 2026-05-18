import { useCallback, useEffect, useRef, useState } from 'react';

import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { GalleryItem } from '../../components/GalleryItem/GalleryItem';
import { Loader } from '../../components/Loader/Loader';
import { Search } from '../../components/Search/Search';
import { getRepositores } from '../../services/api';
import './Gallery.css';

export interface Repository {
  id: number;
  name: string;
  description: string;
  language: string;
}

interface GalleryState {
  results: Array<Repository> | null;
  searchTerm: string;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  lastRequestedKey: string | undefined;
  lastFetchSucceeded: boolean;
}

interface GalleryProps {
  currentPage?: number;
  onPageChange?(nextPage: number): void;
  onSearchInputChange?(): void;
  selectedRepositoryId?: number | null;
  onRepositorySelect?(repositoryId: number): void;
}

const ITEMS_PER_PAGE = 3;

function readSavedSearchTerm(): string {
  const raw = localStorage.getItem('SavedSearchTerm');
  return raw === null ? '' : raw.trim();
}

export function Gallery({
  currentPage = 1,
  onPageChange,
  onSearchInputChange,
  selectedRepositoryId = null,
  onRepositorySelect,
}: GalleryProps) {
  const [state, setState] = useState<GalleryState>({
    results: null,
    searchTerm: readSavedSearchTerm(),
    totalCount: 0,
    isLoading: true,
    error: null,
    lastRequestedKey: undefined,
    lastFetchSucceeded: false,
  });
  const lastRequestedKeyRef = useRef<string | undefined>(state.lastRequestedKey);
  const lastFetchSucceededRef = useRef(state.lastFetchSucceeded);

  const fetchRepositories = useCallback((trimmed: string, page: number) => {
    const requestKey = `${trimmed}|${page}`;
    if (lastRequestedKeyRef.current === requestKey && lastFetchSucceededRef.current) {
      return;
    }

    localStorage.setItem('SavedSearchTerm', trimmed);
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
      searchTerm: trimmed,
      results: null,
    }));

    getRepositores(trimmed, page)
      .then((data) => {
        const items = (data.items ?? []).map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description ?? '',
          language: item.language ?? '',
        }));
        lastRequestedKeyRef.current = requestKey;
        lastFetchSucceededRef.current = true;
        setState((prevState) => ({
          ...prevState,
          results: items,
          totalCount: data.total_count ?? 0,
          isLoading: false,
          error: null,
          lastRequestedKey: requestKey,
          lastFetchSucceeded: true,
        }));
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Something went wrong.';
        lastRequestedKeyRef.current = requestKey;
        lastFetchSucceededRef.current = false;
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          error: message,
          totalCount: 0,
          results: null,
          lastRequestedKey: requestKey,
          lastFetchSucceeded: false,
        }));
      });
  }, []);

  const onSearchButtonClick = useCallback(
    (trimmedFromSearch: string) => {
      fetchRepositories(trimmedFromSearch, currentPage);
    },
    [currentPage, fetchRepositories]
  );

  useEffect(() => {
    fetchRepositories(state.searchTerm, currentPage);
  }, [currentPage, fetchRepositories, state.searchTerm]);

  const totalPages = Math.max(1, Math.ceil(state.totalCount / ITEMS_PER_PAGE));
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <ErrorBoundary>
      <div className="GalleryView">
        <section
          className="gallery-search-section"
          aria-label="Search repositories"
        >
          <Search
            searchTerm={state.searchTerm}
            onSearchButtonClick={onSearchButtonClick}
            onSearchInputChange={onSearchInputChange}
          />
        </section>
        <section className="gallery-results-section" aria-label="Search results">
          {state.isLoading ? (
            <div
              className="gallery-results-loader"
              role="status"
              aria-live="polite"
            >
              <Loader />
            </div>
          ) : null}
          {!state.isLoading && state.error ? (
            <div className="gallery-error" role="alert">
              {state.error}
            </div>
          ) : null}
          {!state.isLoading && !state.error ? (
            state.results && state.results.length > 0 ? (
              <ul className="gallery-results-list">
                {state.results.map((item) => (
                  <li key={item.id} className="gallery-results-list-item">
                    <GalleryItem
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      language={item.language}
                      isSelected={selectedRepositoryId === item.id}
                      onSelect={() => onRepositorySelect?.(item.id)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="gallery-empty">No repositories loaded.</p>
            )
          ) : null}
          {!state.isLoading && !state.error && state.results ? (
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
    </ErrorBoundary>
  );
}
