import {
  Link,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

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
  const navigate = listRoute.useNavigate();
  const { page } = listRoute.useSearch();

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

  return (
    <div className="list-layout">
      <section className="list-layout-master" aria-label="Repository list panel">
        <Gallery
          currentPage={page}
          onPageChange={onPageChange}
          onSearchInputChange={onSearchInputChange}
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

function DetailsPlaceholder() {
  const { detailsId } = detailsRoute.useParams();

  return (
    <aside className="app-page" aria-label="Selected repository details">
      <h2>Repository details</h2>
      <p>Selected ID: {detailsId}</p>
      <p>Detailed fetch/render is added in the next phase.</p>
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
  component: DetailsPlaceholder,
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
