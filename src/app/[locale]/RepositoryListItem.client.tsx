'use client';

import { Link } from '../../i18n/navigation';
import {
  selectionSelectors,
  useSelectionStore,
  type SelectedRepository,
} from '../../store/selectionStore';

interface RepositoryListItemProps {
  repository: SelectedRepository;
  href: {
    pathname: '/';
    query: {
      q?: string;
      page: string;
      details?: string;
    };
  };
  fallbackDescription: string;
}

export function RepositoryListItem({
  repository,
  href,
  fallbackDescription,
}: RepositoryListItemProps) {
  const selectedRepositoryIds = useSelectionStore(
    selectionSelectors.selectedRepositoryIds
  );
  const toggleRepositorySelection = useSelectionStore(
    (state) => state.toggleRepositorySelection
  );

  const isSelected = selectedRepositoryIds.includes(repository.id);

  return (
    <article className={`GalleryItem ${isSelected ? 'GalleryItem--selected' : ''}`}>
      <label
        className="GalleryItem-checkbox-label"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <input
          type="checkbox"
          className="GalleryItem-checkbox"
          checked={isSelected}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onChange={() => toggleRepositorySelection(repository)}
          aria-label={`Select repository ${repository.id}`}
        />
      </label>
      <Link href={href} className="GalleryItem-content">
        <p>{repository.name}</p>
        <p>{repository.description || fallbackDescription}</p>
        <p>{repository.language}</p>
      </Link>
    </article>
  );
}
