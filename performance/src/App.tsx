import { useState, useEffect, useMemo, useCallback } from 'react';
import { Country } from './types/country';
import { SortField, SortOrder, SORT_FIELDS, SORT_ORDERS } from './types/sort';
import { CountryList } from './components/CountryList';
import { SearchBar } from './components/SearchBar';
import { Filter } from './components/Filter';
import { Sort } from './components/Sort';
import { ProfilerWrapper } from './components/ProfilerWrapper';
import './App.css';

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [regions, setRegions] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>(SORT_FIELDS[0]);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SORT_ORDERS[0]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();

        // Transform the json data to match Country interface
        const transformedCountries: Country[] = data.map((country: any) => ({
          name: country.name.common,
          population: country.population,
          region: country.region,
          flag: country.flags.png,
        }));

        // Sort countries by name - this is the default sort, before user input
        const sortedCountries = transformedCountries.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        
        // Get unique regions
        const uniqueRegions = Array.from(new Set(sortedCountries.map(country => country.region)));
        setRegions(uniqueRegions);
        
        setCountries(sortedCountries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    let filtered = [...countries];

    // Apply search filter
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((country) =>
        country.name.toLowerCase().includes(searchTerm)
      );
    }

    // Apply region filter
    if (selectedRegion) {
      filtered = filtered.filter(
        (country) => country.region === selectedRegion
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === 'asc'
          ? a.population - b.population
          : b.population - a.population;
      }
    });

    return filtered;
  }, [countries, searchQuery, selectedRegion, sortField, sortOrder]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleRegionFilter = useCallback((region: string) => {
    setSelectedRegion(region);
  }, []);

  const handleSort = useCallback((field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading countries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-text">Error: {error}</div>
      </div>
    );
  }

  return (
    <ProfilerWrapper id="App">
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">Countries of the World</h1>
            <p className="country-count">Total countries: {filteredCountries.length}</p>
          </div>
        </header>
        <main className="app-main">
          <div className="filters-container">
            <SearchBar onSearch={handleSearch} />
            <Filter
              regions={regions}
              selectedRegion={selectedRegion}
              onFilterChange={handleRegionFilter}
            />
            <Sort onSort={handleSort} />
          </div>
          <ProfilerWrapper id="CountryList">
            <CountryList countries={filteredCountries} />
          </ProfilerWrapper>
        </main>
      </div>
    </ProfilerWrapper>
  );
}

export default App;
