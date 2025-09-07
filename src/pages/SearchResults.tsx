import React, { useState } from 'react';
import { useSearch } from '../contexts/SearchContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { Product } from '../contexts/ProductsContext';
import { Search, Package } from 'lucide-react';
import './CategoryPage.css';

const SearchResults: React.FC = () => {
  const { searchTerm, searchResults, isSearching, hasSearched } = useSearch();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (isSearching) {
    return (
      <div className="category-page">
        <div className="container">
          <div className="category-header">
            <h1>Searching...</h1>
            <p>Finding products for "{searchTerm}"</p>
          </div>
          <div className="loading-spinner">
            <Search size={48} className="spinning" />
          </div>
        </div>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="category-page">
        <div className="container">
          <div className="category-header">
            <h1>Search Products</h1>
            <p>Use the search bar above to find your favorite products</p>
          </div>
          <div className="empty-state">
            <Search size={64} />
            <h3>Start Your Search</h3>
            <p>Enter a product name, category, or description to find what you're looking for</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="container">
        <div className="category-header">
          <h1>Search Results</h1>
          <p>
            {searchResults.length > 0 
              ? `Found ${searchResults.length} product${searchResults.length !== 1 ? 's' : ''} for "${searchTerm}"`
              : `No products found for "${searchTerm}"`
            }
          </p>
        </div>

        {searchResults.length > 0 ? (
          <div className="products-grid">
            {searchResults.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Package size={64} />
            <h3>No Products Found</h3>
            <p>
              We couldn't find any products matching "{searchTerm}". 
              Try searching with different keywords or browse our categories.
            </p>
            <div className="search-suggestions">
              <h4>Search Tips:</h4>
              <ul>
                <li>Try using different keywords</li>
                <li>Check your spelling</li>
                <li>Use more general terms</li>
                <li>Browse our categories: Women, Men, Kids, Bags</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SearchResults; 