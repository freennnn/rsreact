import { useEffect, useState } from 'react';

import { ErrorButton } from '../ErrorButton/ErrorButton';
import './Search.css';

interface SearchProps {
  searchTerm?: string;
  onSearchButtonClick(trimmedTerm: string): void;
  onSearchInputChange?(nextTerm: string): void;
}

export function Search({
  searchTerm,
  onSearchButtonClick,
  onSearchInputChange: onSearchTextChanged,
}: SearchProps) {
  const [inputValue, setInputValue] = useState(searchTerm ? searchTerm : '');

  useEffect(() => {
    setInputValue(searchTerm === undefined ? '' : searchTerm);
  }, [searchTerm]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onSearchTextChanged?.(e.target.value);
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
        onChange={handleSearchInputChange}
        value={inputValue}
      />
      <button type="submit" className="search-button">
        Search
      </button>
      <ErrorButton>Generate Error</ErrorButton>
    </form>
  );
}
