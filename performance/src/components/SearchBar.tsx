import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search countries..."
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
      />
    </div>
  );
} 