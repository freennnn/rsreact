import { useState, useEffect, useMemo, useCallback } from 'react';
import { Country, CountryApiResponse } from './types/country';
import { SortField, SortOrder, SORT_FIELDS, SORT_ORDERS } from './types/sort';
import { CountryList } from './components/CountryList';
import { SearchBar } from './components/SearchBar';
import { Filter } from './components/Filter';
import { Sort } from './components/Sort';
import { ProfilerWrapper } from './components/ProfilerWrapper';
import './App.css';

const VISITED_COUNTRIES_KEY = 'visitedCountries';

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(
    new Set()
  );
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
        // Load visited countries from localStorage first
        const visitedCountriesStr = localStorage.getItem(VISITED_COUNTRIES_KEY);
        if (visitedCountriesStr) {
          setVisitedCountries(new Set(JSON.parse(visitedCountriesStr)));
        }

        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data: CountryApiResponse[] = await response.json();

        // Transform the json data to match Country interface
        const transformedCountries: Country[] = data.map((country) => ({
          name: country.name.common,
          population: country.population,
          region: country.region,
          flag: country.flags.png,
        }));

        // Get unique regions
        const uniqueRegions = Array.from(
          new Set(transformedCountries.map((country) => country.region))
        );
        setRegions(uniqueRegions);

        setCountries(transformedCountries);
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

  const handleToggleVisited = useCallback((countryName: string) => {
    setVisitedCountries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(countryName)) {
        newSet.delete(countryName);
      } else {
        newSet.add(countryName);
      }

      // Update localStorage
      localStorage.setItem(VISITED_COUNTRIES_KEY, JSON.stringify([...newSet]));

      return newSet;
    });
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
            <p className="country-count">
              Total countries: {filteredCountries.length}
            </p>
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
            <CountryList
              countries={filteredCountries}
              visitedCountries={visitedCountries}
              onToggleVisited={handleToggleVisited}
            />
          </ProfilerWrapper>
        </main>
      </div>
    </ProfilerWrapper>
  );
}

export default App;
