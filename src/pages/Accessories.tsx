import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductsContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { Product } from '../contexts/ProductsContext';
import './CategoryPage.css';

const Accessories: React.FC = () => {
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter products for Accessories category
  const accessoriesProducts = products.filter(
    product => product.category.toLowerCase() === 'accessories'
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="category-page">
      <div className="container">
        <div className="category-header">
          <h1>Accessories</h1>
          <p>Complete your look with our stylish accessories collection</p>
        </div>

        {accessoriesProducts.length > 0 ? (
          <div className="products-grid">
            {accessoriesProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No Accessories Available</h3>
            <p>We're working on adding new accessories to our collection. Check back soon!</p>
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

export default Accessories; 