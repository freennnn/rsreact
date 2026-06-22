import { unstable_cache } from 'next/cache';
import { getTranslations } from 'next-intl/server';

import { RepositoryListItem } from './RepositoryListItem.client';
import { buildQuery } from './search-params';
import { Link } from '../../i18n/navigation';
import { getRepositores } from '../../services/api';
import type { SelectedRepository } from '../../store/selectionStore';

const ITEMS_PER_PAGE = 3;

const getCachedRepositories = unstable_cache(
  async (searchTerm: string, page: number) => getRepositores(searchTerm, page),
  ['repositories-list'],
  { revalidate: 60, tags: ['repositories-list'] }
);

interface SearchResultsSectionProps {
  locale: string;
  searchTerm: string;
  currentPage: number;
}

export async function SearchResultsSection({
  locale,
  searchTerm,
  currentPage,
}: SearchResultsSectionProps) {
  const t = await getTranslations({ locale, namespace: 'SearchPage' });

  let repositories: SelectedRepository[] = [];
  let totalCount = 0;
  let listError: string | null = null;

  try {
    const listResponse = await getCachedRepositories(searchTerm, currentPage);
    repositories = listResponse.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description ?? '',
      language: item.language ?? t('unknownLanguage'),
      htmlUrl: item.html_url ?? '',
      detailsUrl: item.html_url ?? '',
    }));
    totalCount = listResponse.total_count ?? 0;
  } catch (error) {
    listError = error instanceof Error ? error.message : t('listRequestFailed');
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
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
  );
}
