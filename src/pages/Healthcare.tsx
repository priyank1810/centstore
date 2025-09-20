import React, { useState } from 'react';
import { useProducts, Product } from '../contexts/ProductsContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import './CategoryPage.css';

const Healthcare: React.FC = () => {
  const { getProductsByCategory } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = getProductsByCategory('Healthcare');

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="category-page">
        <div className="container">
          <div className="page-header">
            <h1>Healthcare</h1>
            <p>Essential healthcare and wellness products for everyday life</p>
          </div>

          <div className="products-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="empty-category">
              <p>No products available in this category yet.</p>
            </div>
          )}
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Healthcare; 