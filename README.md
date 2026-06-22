# RS React - Next.js App Router Migration

This project has been migrated from Vite SPA routing to Next.js App Router with server-first rendering and locale-aware routing.

## Tech stack

- Next.js App Router (`src/app`)
- TypeScript
- next-intl (`en`, `ru`)
- Zustand (client-side selection state)
- Vitest + Testing Library

## Scripts

- `npm run dev` - start Next.js dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint
- `npm test` - run test suite

## App Router structure

- `src/app/layout.tsx` - root layout and theme bootstrap script
- `src/app/[locale]/layout.tsx` - localized shared app shell
- `src/app/[locale]/page.tsx` - search results route (server-rendered)
- `src/app/[locale]/about/page.tsx` - static About page
- `src/app/[locale]/not-found.tsx` - localized 404 page
- `src/app/[locale]/actions.ts` - server action for search submissions
- `src/app/api/csv/route.ts` - server CSV generation endpoint

## i18n setup

- `src/i18n/routing.ts` - locale list and default locale
- `src/proxy.ts` - locale middleware/proxy matcher
- `src/i18n/request.ts` - request-scoped locale + messages resolution
- `src/i18n/navigation.ts` - locale-aware `Link` and navigation APIs
- `messages/en.json`, `messages/ru.json` - UI dictionaries

## Search and details behavior

- Search form submits through a server action (`submitSearchAction`).
- URL query params (`q`, `page`, `details`) drive route state.
- List and details are rendered in separate server components:
  - `SearchResultsSection.server.tsx`
  - `RepositoryDetailsSection.server.tsx`
- Fetches use explicit Next cache metadata (`revalidate` + tags).

## CSV export behavior

- Selection state is managed on the client with Zustand.
- Download action calls `POST /api/csv` with selected repositories.
- CSV is generated and returned on the server.
- Client receives blob response and triggers file download.

## Migration status checklist

- Next.js App Router migration: complete
- File-based routing (no react-router usage): complete
- next-intl integration + client locale switcher: complete
- Shared localized layout: complete
- 404 page in App Router: complete
- About page as server-rendered static route: complete
- Search results SSR + server component layout shell: complete
- Search submit via server action: complete
- Details fetch server-driven by URL param: complete
- CSV generation served from server route: complete
- Full lint and test suite passing: complete

## Notes

- The app currently keeps some legacy dependencies/files for historical tests and incremental migration safety.
- The active runtime path is Next.js App Router.
