import React from 'react';

import { ErrorButton } from '../ErrorButton/ErrorButton';
import './Search.css';

interface SearchProps {
  searchTerm?: string;
  onSearchButtonClick(trimmedTerm: string): void;
}

export class Search extends React.Component<SearchProps> {
  state = {
    searchTerm: this.props.searchTerm ? this.props.searchTerm : '',
  };

  componentDidMount(): void {
    const saved = localStorage.getItem('SavedSearchTerm');
    if (saved !== null) {
      this.setState({ searchTerm: saved.trim() });
    }
  }

  componentDidUpdate(prevProps: SearchProps): void {
    if (this.props.searchTerm !== prevProps.searchTerm) {
      const next =
        this.props.searchTerm === undefined ? '' : this.props.searchTerm;
      if (next !== this.state.searchTerm) {
        this.setState({ searchTerm: next });
      }
    }
  }

  onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: e.target.value });
  };

  onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = this.state.searchTerm.trim();
    this.setState({ searchTerm: trimmed });
    this.props.onSearchButtonClick(trimmed);
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search.."
          className="searchbar"
          onChange={this.onSearchInputChange}
          value={this.state.searchTerm}
        />
        <button type="submit" className="search-button">
          Search
        </button>
        <ErrorButton>Generate Error</ErrorButton>
      </form>
    );
  }
}
