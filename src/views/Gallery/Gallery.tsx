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
  isLoading: boolean;
  error: string | null;
  lastRequestedTrimmed: string | undefined;
  lastFetchSucceeded: boolean;
}

function readSavedSearchTerm(): string {
  const raw = localStorage.getItem('SavedSearchTerm');
  return raw === null ? '' : raw.trim();
}

export function Gallery() {
  const [state, setState] = useState<GalleryState>({
    results: null,
    searchTerm: readSavedSearchTerm(),
    isLoading: true,
    error: null,
    lastRequestedTrimmed: undefined,
    lastFetchSucceeded: false,
  });
  const lastRequestedTrimmedRef = useRef<string | undefined>(
    state.lastRequestedTrimmed
  );
  const lastFetchSucceededRef = useRef(state.lastFetchSucceeded);

  const fetchRepositories = useCallback((trimmed: string) => {
    if (
      lastRequestedTrimmedRef.current === trimmed &&
      lastFetchSucceededRef.current
    ) {
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

    getRepositores(trimmed)
      .then((data) => {
        const items = (data.items ?? []).map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description ?? '',
          language: item.language ?? '',
        }));
        lastRequestedTrimmedRef.current = trimmed;
        lastFetchSucceededRef.current = true;
        setState((prevState) => ({
          ...prevState,
          results: items,
          isLoading: false,
          error: null,
          lastRequestedTrimmed: trimmed,
          lastFetchSucceeded: true,
        }));
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Something went wrong.';
        lastRequestedTrimmedRef.current = trimmed;
        lastFetchSucceededRef.current = false;
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          error: message,
          results: null,
          lastRequestedTrimmed: trimmed,
          lastFetchSucceeded: false,
        }));
      });
  }, []);

  const onSearchButtonClick = useCallback(
    (trimmedFromSearch: string) => {
      fetchRepositories(trimmedFromSearch);
    },
    [fetchRepositories]
  );

  useEffect(() => {
    fetchRepositories(state.searchTerm);
  }, [fetchRepositories, state.searchTerm]);

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
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="gallery-empty">No repositories loaded.</p>
            )
          ) : null}
        </section>
      </div>
    </ErrorBoundary>
  );
}
