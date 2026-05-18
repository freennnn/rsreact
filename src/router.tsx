import {
  Link,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  useMatchRoute,
  useNavigate,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { Loader } from './components/Loader/Loader';
import { getRepositoryById, type GitHubRepositoryDetails } from './services/api';
import { Gallery } from './views/Gallery/Gallery';

function RootLayout() {
  return (
    <div>
      <header className="app-header">
        <nav className="app-nav" aria-label="Main navigation">
          <Link to="/" search={{ page: 1 }} className="app-nav-link">
            Home
          </Link>
          <Link to="/about" className="app-nav-link">
            About
          </Link>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

function ListLayout() {
  const navigate = useNavigate({ from: listRoute.fullPath });
  const matchRoute = useMatchRoute();
  const { page } = listRoute.useSearch();
  const detailsMatch = matchRoute({ to: detailsRoute.fullPath });
  const selectedRepositoryId = detailsMatch
    ? Number(detailsMatch.detailsId)
    : null;

  const onPageChange = (nextPage: number) => {
    const safePage = nextPage < 1 ? 1 : nextPage;
    navigate({
      search: (prev) => ({ ...prev, page: safePage }),
      replace: safePage === page,
    });
  };

  const onSearchInputChange = () => {
    if (page === 1) {
      return;
    }

    navigate({
      search: (prev) => ({ ...prev, page: 1 }),
      replace: true,
    });
  };

  const onRepositorySelect = (repositoryId: number) => {
    navigate({
      to: detailsRoute.to,
      params: { detailsId: String(repositoryId) },
      search: (prev) => ({ ...prev, page }),
    });
  };

  const closeDetails = () => {
    if (selectedRepositoryId === null) {
      return;
    }

    navigate({
      to: listRoute.to,
      search: (prev) => ({ ...prev, page }),
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
          selectedRepositoryId={selectedRepositoryId}
          onRepositorySelect={onRepositorySelect}
        />
      </section>
      <section className="list-layout-detail" aria-label="Repository detail panel">
        <Outlet />
      </section>
    </div>
  );
}

function AboutPage() {
  return (
    <section className="app-page" aria-label="About page">
      <h1>About</h1>
      <p>Author: RS React student</p>
      <p>
        <a href="https://rs.school/courses/reactjs" target="_blank" rel="noreferrer">
          RS School React course
        </a>
      </p>
    </section>
  );
}

function DetailsPanel() {
  const navigate = useNavigate({ from: detailsRoute.fullPath });
  const { page } = listRoute.useSearch();
  const { detailsId } = detailsRoute.useParams();
  const [details, setDetails] = useState<GitHubRepositoryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repositoryId = Number(detailsId);
    let isCancelled = false;

    setIsLoading(true);
    setError(null);
    setDetails(null);

    getRepositoryById(repositoryId)
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

  const onClose = () => {
    navigate({
      to: listRoute.to,
      search: (prev) => ({ ...prev, page }),
    });
  };

  return (
    <aside className="app-page details-panel" aria-label="Selected repository details">
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
      <Link to="/" search={{ page: 1 }}>
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

    return { page };
  },
  component: ListLayout,
});

const detailsRoute = createRoute({
  getParentRoute: () => listRoute,
  path: 'details/$detailsId',
  component: DetailsPanel,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const routeTree = rootRoute.addChildren([
  listRoute.addChildren([detailsRoute]),
  aboutRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
