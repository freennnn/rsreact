import { useEffect, useState } from 'react';

import { ErrorButton } from '../ErrorButton/ErrorButton';
import './Search.css';

interface SearchProps {
  searchTerm?: string;
  onSearchButtonClick(trimmedTerm: string): void;
}

export function Search({ searchTerm, onSearchButtonClick }: SearchProps) {
  const [inputValue, setInputValue] = useState(searchTerm ? searchTerm : '');

  useEffect(() => {
    const saved = localStorage.getItem('SavedSearchTerm');
    if (saved !== null) {
      setInputValue(saved.trim());
    }
  }, []);

  useEffect(() => {
    setInputValue(searchTerm === undefined ? '' : searchTerm);
  }, [searchTerm]);

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    setInputValue(trimmed);
    onSearchButtonClick(trimmed);
  };

  return (
    <form onSubmit={onSubmit} className="search-form">
      <input
        type="text"
        placeholder="Search.."
        className="searchbar"
        onChange={onSearchInputChange}
        value={inputValue}
      />
      <button type="submit" className="search-button">
        Search
      </button>
      <ErrorButton>Generate Error</ErrorButton>
    </form>
  );
}
