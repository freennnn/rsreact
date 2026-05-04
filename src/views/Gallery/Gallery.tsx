import React from 'react';

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

export class Gallery extends React.Component {
  state: GalleryState = {
    results: null,
    searchTerm: readSavedSearchTerm(),
    isLoading: true,
    error: null,
    lastRequestedTrimmed: undefined,
    lastFetchSucceeded: false,
  };

  fetchRepositories = (trimmed: string) => {
    if (
      this.state.lastRequestedTrimmed === trimmed &&
      this.state.lastFetchSucceeded
    ) {
      return;
    }

    localStorage.setItem('SavedSearchTerm', trimmed);
    this.setState({
      isLoading: true,
      error: null,
      searchTerm: trimmed,
      results: null,
    });

    getRepositores(trimmed)
      .then((data) => {
        const items = (data.items ?? []).map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description ?? '',
          language: item.language ?? '',
        }));
        this.setState({
          results: items,
          isLoading: false,
          error: null,
          lastRequestedTrimmed: trimmed,
          lastFetchSucceeded: true,
        });
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Something went wrong.';
        this.setState({
          isLoading: false,
          error: message,
          results: null,
          lastRequestedTrimmed: trimmed,
          lastFetchSucceeded: false,
        });
      });
  };

  onSearchButtonClick = (trimmedFromSearch: string) => {
    this.fetchRepositories(trimmedFromSearch);
  };

  componentDidMount(): void {
    this.fetchRepositories(this.state.searchTerm);
  }

  render() {
    return (
      <ErrorBoundary>
        <div className="GalleryView">
          <section
            className="gallery-search-section"
            aria-label="Search repositories"
          >
            <Search
              searchTerm={this.state.searchTerm}
              onSearchButtonClick={this.onSearchButtonClick}
            />
          </section>
          <section
            className="gallery-results-section"
            aria-label="Search results"
          >
            {this.state.isLoading ? (
              <div
                className="gallery-results-loader"
                role="status"
                aria-live="polite"
              >
                <Loader />
              </div>
            ) : null}
            {!this.state.isLoading && this.state.error ? (
              <div className="gallery-error" role="alert">
                {this.state.error}
              </div>
            ) : null}
            {!this.state.isLoading && !this.state.error ? (
              this.state.results && this.state.results.length > 0 ? (
                <ul className="gallery-results-list">
                  {this.state.results.map((item) => (
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
}
