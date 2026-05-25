/* eslint-disable react-refresh/only-export-components */
import {
  Link,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { Loader } from './components/Loader/Loader';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { SelectedItemsFlyout } from './components/SelectedItemsFlyout/SelectedItemsFlyout';
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher';
import { selectionSelectors, useSelectionStore } from './store/selectionStore';
import { downloadSelectedItemsCsv } from './utils/downloadSelectedItemsCsv';
import {
  getRepositoryById,
  type GitHubRepositoryDetails,
} from './services/api';
import { Gallery } from './views/Gallery/Gallery';

function RootLayout() {
  return (
    <ErrorBoundary>
      <div className="app-shell">
        <header className="app-header">
          <nav className="app-nav" aria-label="Main navigation">
            <Link
              to="/"
              search={{ page: 1, details: undefined }}
              className="app-nav-link"
            >
              Home
            </Link>
            <Link to="/about" className="app-nav-link">
              About
            </Link>
            <ThemeSwitcher />
          </nav>
        </header>
        <main className="app-main">
          <Outlet />
          <SelectedItemsFlyout
            onDownloadSelected={() =>
              downloadSelectedItemsCsv(
                selectionSelectors.selectedRepositories(
                  useSelectionStore.getState()
                )
              )
            }
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}

function ListLayout() {
  const navigate = useNavigate({ from: listRoute.fullPath });
  const { page, details } = listRoute.useSearch();
  const selectedRepositoryId = details ?? null;

  useEffect(() => {
    const rawPage = new URLSearchParams(window.location.search).get('page');
    const parsedPage = rawPage === null ? Number.NaN : Number(rawPage);
    const hasValidPageParam = Number.isInteger(parsedPage) && parsedPage > 0;

    if (!hasValidPageParam) {
      navigate({
        search: (prev) => ({ ...prev, page }),
        replace: true,
      });
    }
  }, [navigate, page]);

  const onPageChange = (nextPage: number) => {
    const safePage = nextPage < 1 ? 1 : nextPage;
    navigate({
      search: (prev) => ({ ...prev, page: safePage }),
      replace: safePage === page,
    });
  };

  const onSearchInputChange = () => {
    if (page === 1 && selectedRepositoryId === null) {
      return;
    }

    navigate({
      search: (prev) => ({ ...prev, page: 1, details: undefined }),
      replace: true,
    });
  };

  const onRepositoryOpen = (repositoryId: number) => {
    navigate({
      search: (prev) => ({ ...prev, details: repositoryId }),
    });
  };

  const closeDetails = () => {
    if (selectedRepositoryId === null) {
      return;
    }

    navigate({
      search: (prev) => ({ ...prev, details: undefined }),
    });
  };

  return (
    <div className="list-layout">
      <section
        className="list-layout-master"
        aria-label="Repository list panel"
        onClick={closeDetails}
      >
        <Gallery
          currentPage={page}
          onPageChange={onPageChange}
          onSearchInputChange={onSearchInputChange}
          onRepositoryOpen={onRepositoryOpen}
        />
      </section>
      <section
        className="list-layout-detail"
        aria-label="Repository detail panel"
      >
        {selectedRepositoryId !== null ? (
          <DetailsPanel
            detailsId={selectedRepositoryId}
            onClose={() =>
              navigate({
                search: (prev) => ({ ...prev, details: undefined }),
              })
            }
          />
        ) : null}
      </section>
    </div>
  );
}

function AboutPage() {
  return (
    <section className="app-page about-page-panel" aria-label="About page">
      <h1>About</h1>
      <p>Author: Alex Frinster</p>
      <p>
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          RS School React course
        </a>
      </p>
    </section>
  );
}

interface DetailsPanelProps {
  detailsId: number;
  onClose(): void;
}

function DetailsPanel({ detailsId, onClose }: DetailsPanelProps) {
  const [details, setDetails] = useState<GitHubRepositoryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    setIsLoading(true);
    setError(null);
    setDetails(null);

    getRepositoryById(detailsId)
      .then((payload) => {
        if (!isCancelled) {
          setDetails(payload);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load repository.'
          );
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [detailsId]);

  return (
    <aside
      className="app-page details-panel"
      aria-label="Selected repository details"
    >
      <button type="button" className="details-panel-close" onClick={onClose}>
        Close
      </button>
      <h2>Repository details</h2>
      {isLoading ? (
        <div role="status" aria-live="polite" className="details-panel-loader">
          <Loader />
        </div>
      ) : null}
      {!isLoading && error ? (
        <p role="alert" className="details-panel-error">
          {error}
        </p>
      ) : null}
      {!isLoading && !error && details ? (
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

function NotFoundPage() {
  return (
    <section className="app-page" aria-label="Not found page">
      <h1>404 - Page not found</h1>
      <Link to="/" search={{ page: 1, details: undefined }}>
        Return to main app
      </Link>
    </section>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

const listRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search: Record<string, unknown>) => {
    const rawPage = Number(search.page);
    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const rawDetails = Number(search.details);
    const details =
      Number.isInteger(rawDetails) && rawDetails > 0 ? rawDetails : undefined;

    return { page, details };
  },
  component: ListLayout,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const routeTree = rootRoute.addChildren([listRoute, aboutRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
