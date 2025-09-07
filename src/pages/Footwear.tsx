import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductsContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { Product } from '../contexts/ProductsContext';
import './CategoryPage.css';

const Footwear: React.FC = () => {
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter products for Footwear category
  const footwearProducts = products.filter(product => product.category === 'Footwear');

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
        <div className="category-header">
          <div className="container">
            <h1>Footwear Collection</h1>
            <p>Step into style with our premium footwear collection - from casual sneakers to elegant dress shoes</p>
          </div>
        </div>

        <div className="category-content">
          <div className="container">
            <div className="products-grid">
              {footwearProducts.length > 0 ? (
                footwearProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onProductClick={handleProductClick}
                  />
                ))
              ) : (
                <div className="no-products">
                  <h3>Coming Soon</h3>
                  <p>Our footwear collection is being curated. Check back soon for amazing shoes!</p>
                </div>
              )}
            </div>
          </div>
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

export default Footwear; 