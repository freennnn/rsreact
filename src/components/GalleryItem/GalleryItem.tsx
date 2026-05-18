import { Repository } from '../../views/Gallery/Gallery';
import './GalleryItem.css';

interface GalleryItemProps extends Repository {
  isSelected?: boolean;
  onSelect?(): void;
}

export function GalleryItem({
  name,
  description,
  language,
  isSelected = false,
  onSelect,
}: GalleryItemProps) {
  return (
    <button
      type="button"
      className={`GalleryItem ${isSelected ? 'GalleryItem--selected' : ''}`}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.();
      }}
    >
      <p>{name}</p>
      <p>{description}</p>
      <p>{language}</p>
    </button>
  );
}
