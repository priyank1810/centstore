import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../contexts/ProductsContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadError, setImageLoadError] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
    setImageLoadError(false);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
    setImageLoadError(false);
  };

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
    setImageLoadError(false);
  };

  const handleCardClick = () => {
    onProductClick(product);
  };

  const handleImageError = () => {
    setImageLoadError(true);
  };

  const handleImageLoad = () => {
    setImageLoadError(false);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image">
        {imageLoadError ? (
          <div className="card-image-error">
            <div className="error-icon">📷</div>
            <span>Image not available</span>
          </div>
        ) : (
          <img 
            src={product.images[currentImageIndex]} 
            alt={product.name}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
        
        {/* Image Navigation - only show if multiple images and no error */}
        {product.images.length > 1 && !imageLoadError && (
          <>
            <button className="image-nav prev" onClick={prevImage}>
              <ChevronLeft size={16} />
            </button>
            <button className="image-nav next" onClick={nextImage}>
              <ChevronRight size={16} />
            </button>
            
            {/* Image Dots */}
            <div className="image-dots">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  className={`image-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => goToImage(index, e)}
                />
              ))}
            </div>
          </>
        )}

        
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          <span className="price">${product.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 