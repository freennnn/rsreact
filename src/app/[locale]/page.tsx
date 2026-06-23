import { getTranslations, setRequestLocale } from 'next-intl/server';

import { RepositoryDetailsSection } from './RepositoryDetailsSection.server';
import { SearchResultsSection } from './SearchResultsSection.server';
import { parsePositiveInt, readSingleValue } from './search-params';
import { submitSearchAction } from './actions';
import '../../views/Gallery/Gallery.css';
import '../../components/Search/Search.css';
import '../../components/GalleryItem/GalleryItem.css';

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string | string[];
    page?: string | string[];
    details?: string | string[];
  }>;
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const boundSearchAction = submitSearchAction.bind(null, locale);
  const requestedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: 'SearchPage' });

  const searchTerm = readSingleValue(requestedSearchParams.q).trim();
  const currentPage =
    parsePositiveInt(readSingleValue(requestedSearchParams.page)) ?? 1;
  const selectedDetailsId = parsePositiveInt(
    readSingleValue(requestedSearchParams.details)
  );

  return (
    <div className="list-layout">
      <section className="list-layout-master" aria-label={t('listPanelAria')}>
        <div className="GalleryView">
          <section
            className="gallery-search-section"
            aria-label={t('searchFormAria')}
          >
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
          <SearchResultsSection
            locale={locale}
            searchTerm={searchTerm}
            currentPage={currentPage}
          />
        </div>
      </section>

      <section
        className="list-layout-detail"
        aria-label={t('detailsPanelAria')}
      >
        <RepositoryDetailsSection
          locale={locale}
          searchTerm={searchTerm}
          currentPage={currentPage}
          selectedDetailsId={selectedDetailsId}
        />
      </section>
    </div>
  );
}
