import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, MapPin, MessageCircle } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const navigate = useNavigate();
  const { performSearch } = useSearch();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false); // New function to close the menu

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
              <img src="/centstore-logo.png" alt="CentStore Logo" className="header-logo" />
            </Link>

            <nav className={`main-nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <Link to="/women" className="nav-link" onClick={closeMenu}>Women</Link>
              <Link to="/men" className="nav-link" onClick={closeMenu}>Men</Link>
              <Link to="/kids" className="nav-link" onClick={closeMenu}>Kids</Link>
              <Link to="/bags" className="nav-link" onClick={closeMenu}>Bags</Link>
              <Link to="/accessories" className="nav-link" onClick={closeMenu}>Accessories</Link>
              <Link to="/footwear" className="nav-link" onClick={closeMenu}>Footwear</Link>
            </nav>

            <div className="header-actions">
              <button 
                className="action-btn" 
                onClick={toggleSearch}
                aria-label={isSearchOpen ? "Close search" : "Open search"}
                title={isSearchOpen ? "Close search" : "Search products"}
              >
                <Search size={24} />
              </button>
              <button 
                className="action-btn" 
                onClick={() => navigate('/contact')}
                aria-label="Contact us"
                title="Contact us"
              >
                <MessageCircle size={24} />
              </button>
              <button 
                className="action-btn" 
                onClick={() => navigate('/locations')}
                aria-label="View locations"
                title="View locations"
              >
                <MapPin size={28} />
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