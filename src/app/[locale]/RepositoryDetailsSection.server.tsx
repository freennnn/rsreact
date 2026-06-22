import { unstable_cache } from 'next/cache';
import { getTranslations } from 'next-intl/server';

import { buildQuery } from './search-params';
import { Link } from '../../i18n/navigation';
import { getRepositoryById } from '../../services/api';

const getCachedRepositoryDetails = unstable_cache(
  async (detailsId: number) => getRepositoryById(detailsId),
  ['repository-details'],
  { revalidate: 60, tags: ['repository-details'] }
);

interface RepositoryDetailsSectionProps {
  locale: string;
  searchTerm: string;
  currentPage: number;
  selectedDetailsId: number | null;
}

export async function RepositoryDetailsSection({
  locale,
  searchTerm,
  currentPage,
  selectedDetailsId,
}: RepositoryDetailsSectionProps) {
  const t = await getTranslations({ locale, namespace: 'SearchPage' });

  if (!selectedDetailsId) {
    return (
      <aside className="app-page details-panel">
        <h2>{t('detailsTitle')}</h2>
        <p>{t('detailsEmpty')}</p>
      </aside>
    );
  }

  let detailsError: string | null = null;
  let details: Awaited<ReturnType<typeof getRepositoryById>> | null = null;

  try {
    details = await getCachedRepositoryDetails(selectedDetailsId);
  } catch (error) {
    detailsError = error instanceof Error ? error.message : t('detailsRequestFailed');
  }

  return (
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
            <strong>{t('languageLabel')}:</strong> {details.language ?? t('unknownLanguage')}
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
  );
}
