import { getTranslations, setRequestLocale } from 'next-intl/server';

import { RepositoryListItem } from './RepositoryListItem.client';
import { submitSearchAction } from './actions';
import { Link } from '../../i18n/navigation';
import { getRepositores, getRepositoryById } from '../../services/api';
import type { SelectedRepository } from '../../store/selectionStore';
import '../../views/Gallery/Gallery.css';
import '../../components/Search/Search.css';
import '../../components/GalleryItem/GalleryItem.css';

const ITEMS_PER_PAGE = 3;

interface HomePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string | string[];
    page?: string | string[];
    details?: string | string[];
  }>;
}

function readSingleValue(value?: string | string[]): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function parsePositiveInt(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function buildQuery(searchTerm: string, page: number, details?: number) {
  return {
    ...(searchTerm ? { q: searchTerm } : {}),
    page: page.toString(),
    ...(details ? { details: details.toString() } : {}),
  };
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const boundSearchAction = submitSearchAction.bind(null, locale);
  const requestedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: 'SearchPage' });

  const searchTerm = readSingleValue(requestedSearchParams.q).trim();
  const currentPage = parsePositiveInt(readSingleValue(requestedSearchParams.page)) ?? 1;
  const selectedDetailsId = parsePositiveInt(
    readSingleValue(requestedSearchParams.details)
  );

  const [listResult, detailsResult] = await Promise.allSettled([
    getRepositores(searchTerm, currentPage),
    selectedDetailsId !== null
      ? getRepositoryById(selectedDetailsId)
      : Promise.resolve(null),
  ]);

  const listError =
    listResult.status === 'rejected'
      ? listResult.reason instanceof Error
        ? listResult.reason.message
        : t('listRequestFailed')
      : null;

  const repositories: SelectedRepository[] =
    listResult.status === 'fulfilled'
      ? listResult.value.items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description ?? '',
          language: item.language ?? t('unknownLanguage'),
          htmlUrl: item.html_url ?? '',
          detailsUrl: item.html_url ?? '',
        }))
      : [];

  const totalCount =
    listResult.status === 'fulfilled' ? (listResult.value.total_count ?? 0) : 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const detailsError =
    detailsResult.status === 'rejected'
      ? detailsResult.reason instanceof Error
        ? detailsResult.reason.message
        : t('detailsRequestFailed')
      : null;

  const details =
    detailsResult.status === 'fulfilled' ? detailsResult.value : null;

  return (
    <div className="list-layout">
      <section className="list-layout-master" aria-label={t('listPanelAria')}>
        <div className="GalleryView">
          <section className="gallery-search-section" aria-label={t('searchFormAria')}>
            <form action={boundSearchAction} className="search-form">
              <input
                type="text"
                name="q"
                defaultValue={searchTerm}
                placeholder={t('searchPlaceholder')}
                className="searchbar"
              />
              <button type="submit" className="search-button">
                {t('searchButton')}
              </button>
            </form>
          </section>

          <section className="gallery-results-section" aria-label={t('searchResultsAria')}>
            {listError ? <p className="gallery-error">{listError}</p> : null}

            {!listError && repositories.length === 0 ? (
              <p className="gallery-empty">{t('emptyList')}</p>
            ) : null}

            {!listError && repositories.length > 0 ? (
              <ul className="gallery-results-list">
                {repositories.map((repository) => (
                  <li key={repository.id} className="gallery-results-list-item">
                    <RepositoryListItem
                      repository={repository}
                      fallbackDescription={t('missingDescription')}
                      href={{
                        pathname: '/',
                        query: buildQuery(searchTerm, currentPage, repository.id),
                      }}
                    />
                  </li>
                ))}
              </ul>
            ) : null}

            {!listError ? (
              <nav className="gallery-pagination" aria-label={t('paginationAria')}>
                {canGoPrev ? (
                  <Link
                    href={{
                      pathname: '/',
                      query: buildQuery(searchTerm, currentPage - 1),
                    }}
                  >
                    {t('prevPage')}
                  </Link>
                ) : (
                  <span>{t('prevPage')}</span>
                )}
                <span className="gallery-pagination-current">
                  {t('currentPage', { currentPage, totalPages })}
                </span>
                {canGoNext ? (
                  <Link
                    href={{
                      pathname: '/',
                      query: buildQuery(searchTerm, currentPage + 1),
                    }}
                  >
                    {t('nextPage')}
                  </Link>
                ) : (
                  <span>{t('nextPage')}</span>
                )}
              </nav>
            ) : null}
          </section>
        </div>
      </section>

      <section className="list-layout-detail" aria-label={t('detailsPanelAria')}>
        {!selectedDetailsId ? (
          <aside className="app-page details-panel">
            <h2>{t('detailsTitle')}</h2>
            <p>{t('detailsEmpty')}</p>
          </aside>
        ) : (
          <aside className="app-page details-panel" aria-label={t('detailsPanelAria')}>
            <Link
              href={{ pathname: '/', query: buildQuery(searchTerm, currentPage) }}
              className="details-panel-close"
            >
              {t('closeDetails')}
            </Link>
            <h2>{t('detailsTitle')}</h2>
            {detailsError ? <p className="details-panel-error">{detailsError}</p> : null}
            {!detailsError && details ? (
              <div className="details-panel-content">
                <p>
                  <strong>ID:</strong> {details.id}
                </p>
                <p>
                  <strong>{t('nameLabel')}:</strong> {details.full_name}
                </p>
                <p>
                  <strong>{t('ownerLabel')}:</strong> {details.owner.login}
                </p>
                <p>
                  <strong>{t('languageLabel')}:</strong>{' '}
                  {details.language ?? t('unknownLanguage')}
                </p>
                <p>
                  <strong>{t('starsLabel')}:</strong> {details.stargazers_count}
                </p>
                <p>{details.description ?? t('missingDescription')}</p>
                <p>
                  <a href={details.html_url} target="_blank" rel="noreferrer">
                    {t('openOnGithub')}
                  </a>
                </p>
              </div>
            ) : null}
          </aside>
        )}
      </section>
    </div>
  );
}
