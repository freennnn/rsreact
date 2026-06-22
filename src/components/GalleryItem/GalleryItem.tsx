import { Repository } from '../../hooks/useRepositoriesQuery';
import './GalleryItem.css';

interface GalleryItemProps extends Repository {
  isSelected?: boolean;
  onOpenDetails?(): void;
  onToggleSelection?(): void;
}

export function GalleryItem({
  id,
  name,
  description,
  language,
  isSelected = false,
  onOpenDetails,
  onToggleSelection,
}: GalleryItemProps) {
  return (
    <div className={`GalleryItem ${isSelected ? 'GalleryItem--selected' : ''}`}>
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
          onChange={() => onToggleSelection?.()}
          aria-label={`Select repository ${id}`}
        />
      </label>
      <button
        type="button"
        className="GalleryItem-content"
        onClick={(event) => {
          event.stopPropagation();
          onOpenDetails?.();
        }}
      >
        <p>{name}</p>
        <p>{description}</p>
        <p>{language}</p>
      </button>
    </div>
  );
}
