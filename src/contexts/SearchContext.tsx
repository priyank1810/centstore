import React, { createContext, useContext, useState } from 'react';
import { SupabaseProductService, Product } from '../services/supabaseProductService';

interface SearchContextType {
  searchTerm: string;
  searchResults: Product[];
  isSearching: boolean;
  hasSearched: boolean;
  setSearchTerm: (term: string) => void;
  performSearch: (term: string) => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (term: string) => {
    if (!term.trim()) {
      clearSearch();
      return;
    }

    setIsSearching(true);
    setSearchTerm(term);

    try {
      const results = await SupabaseProductService.searchProducts(term.trim());
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
    setIsSearching(false);
  };

  const value: SearchContextType = {
    searchTerm,
    searchResults,
    isSearching,
    hasSearched,
    setSearchTerm,
    performSearch,
    clearSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}; 