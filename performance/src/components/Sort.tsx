import './Sort.css';
import { SortField, SortOrder, SORT_OPTIONS } from '../types/sort';

interface SortProps {
  onSort: (field: SortField, order: SortOrder) => void;
}

export function Sort({ onSort }: SortProps) {
  return (
    <div className="sort-container">
      <select
        onChange={(e) => {
          const [field, order] = e.target.value.split('-') as [
            SortField,
            SortOrder,
          ];
          onSort(field, order);
        }}
        className="sort-select"
      >
        <option value="">Sort by...</option>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
