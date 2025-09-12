import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Product } from '../services/supabaseProductService'; // Updated import path
import './ProductModal.css';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<number, boolean>>({});

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageLoadErrors({});
  }, [product]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleWishlist = () => {
    console.log('Added to wishlist:', product);
  };

  const handleImageError = (index: number) => {
    setImageLoadErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleImageLoad = (index: number) => {
    setImageLoadErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-body">
          {/* Image Section */}
          <div className="modal-image-section">
            <div className="modal-image-container">
              {imageLoadErrors[currentImageIndex] ? (
                <div className="image-error-placeholder">
                  <div className="error-icon">📷</div>
                  <p>Image could not be loaded</p>
                </div>
              ) : (
                <img 
                  src={product.images[currentImageIndex]} 
                  alt={product.name}
                  className="modal-main-image"
                  onError={() => handleImageError(currentImageIndex)}
                  onLoad={() => handleImageLoad(currentImageIndex)}
                />
              )}
              
              {/* Image Navigation - only show if multiple images */}
              {product.images.length > 1 && (
                <>
                  <button className="modal-image-nav prev" onClick={prevImage}>
                    <ChevronLeft size={20} />
                  </button>
                  <button className="modal-image-nav next" onClick={nextImage}>
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="modal-thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`modal-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => goToImage(index)}
                  >
                    {imageLoadErrors[index] ? (
                      <div className="thumbnail-error">
                        <span>❌</span>
                      </div>
                    ) : (
                      <img 
                        src={image} 
                        alt={`${product.name} ${index + 1}`}
                        onError={() => handleImageError(index)}
                        onLoad={() => handleImageLoad(index)}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="modal-info-section">
            <div className="modal-product-header">
              <h2 className="modal-product-name">{product.name}</h2>
            </div>

            <div className="modal-price-section">
              <div className="modal-price">
                {product.market_price && product.market_price > product.price && (
                  <span className="modal-market-price-crossed">${product.market_price.toFixed(2)}</span>
                )}
                <span className="modal-price-value">${product.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Product Description */}
            <div className="modal-description">
              <h3>Product Details</h3>
              <p>
                {product.description || `Discover premium quality and style with this ${product.category.toLowerCase()} piece. 
                Crafted with attention to detail and designed for modern living, this item combines 
                comfort with contemporary fashion.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal; 