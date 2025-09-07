import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const navigate = useNavigate();
  const { performSearch } = useSearch();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchInput('');
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      await performSearch(searchInput.trim());
      navigate('/search');
      setIsSearchOpen(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  return (
    <header className="header">
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            <button className="menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="logo">
              <h1>CentStore</h1>
            </Link>

            <nav className={`main-nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <Link to="/women" className="nav-link">Women</Link>
              <Link to="/men" className="nav-link">Men</Link>
              <Link to="/kids" className="nav-link">Kids</Link>
              <Link to="/bags" className="nav-link">Bags</Link>
              <Link to="/accessories" className="nav-link">Accessories</Link>
            </nav>

            <div className="header-actions">
              <button className="action-btn" onClick={toggleSearch}>
                <Search size={24} />
              </button>
            </div>
          </div>

          {isSearchOpen && (
            <div className="search-bar">
              <form onSubmit={handleSearchSubmit}>
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchInputKeyPress}
                    placeholder="Search for products..."
                    className="search-input"
                    autoFocus
                  />
                  <button type="submit" className="search-submit">
                    <Search size={24} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 