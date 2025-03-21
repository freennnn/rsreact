import { useState, useEffect } from 'react';
import { Country } from './types/country';
import { CountryList } from './components/CountryList';
import { SearchBar } from './components/SearchBar';
import './App.css';

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        
        // Transform the data to match our simplified Country interface
        const transformedCountries: Country[] = data.map((country: any) => ({
          name: country.name.common,
          population: country.population,
          region: country.region,
          flag: country.flags.png
        }));
        
        // Sort countries by name
        const sortedCountries = transformedCountries.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        
        setCountries(sortedCountries);
        setFilteredCountries(sortedCountries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSearch = (query: string) => {
    const searchTerm = query.toLowerCase().trim();
    const filtered = countries.filter(country => 
      country.name.toLowerCase().includes(searchTerm)
    );
    setFilteredCountries(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading countries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Countries of the World</h1>
          <p className="text-gray-600 mt-2">Total countries: {filteredCountries.length}</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4">
        <SearchBar onSearch={handleSearch} />
        <CountryList countries={filteredCountries} />
      </main>
    </div>
  );
}

export default App;
