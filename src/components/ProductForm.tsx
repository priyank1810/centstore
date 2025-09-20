import React, { useState, useEffect } from 'react';
import { X, Trash2, Upload, GripVertical } from 'lucide-react';
import { useProducts, Product } from '../contexts/ProductsContext';
import { SupabaseAccessoryCategoryService } from '../services/supabaseAccessoryCategoryService';
import { SupabaseStorageService, UploadProgress } from '../services/supabaseStorageService';
import './ProductForm.css';

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onSave: () => void;
}

interface ImageData {
  file: File | null;
  preview: string;
  uploadProgress: UploadProgress;
  downloadURL: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSave }) => {
  const { addProduct, updateProduct } = useProducts();
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Women',
    price: '',
    market_price: '', // Added market_price field
    sub_category: '', // Accessory sub-category (optional)
    description: '',
    featured: false
  });

  const [images, setImages] = useState<ImageData[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        sub_category: (product as any).subCategory || '',
        price: product.price.toString(),
        market_price: product.market_price ? product.market_price.toString() : '', // Initialize market_price
        description: product.description || '',
        featured: product.featured || false
      });

      // Convert existing image URLs to ImageData format
      if (product.images && product.images.length > 0) {
        const existingImages: ImageData[] = product.images.map(imageUrl => ({
          file: null,
          preview: imageUrl,
          uploadProgress: { progress: 100, isComplete: true },
          downloadURL: imageUrl
        }));
        setImages(existingImages);
      }
    }
  }, [product]);

  // Load accessory categories when form mounts
  const [accessoryCategories, setAccessoryCategories] = useState<string[]>([]);
  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const cats = await SupabaseAccessoryCategoryService.getAllCategories();
        if (mounted) {
          // Ensure current product's subCategory is available in the select
          const currentSub = (product as any)?.subCategory;
          const merged = Array.from(new Set([...(cats || []), ...(currentSub ? [currentSub] : [])]));
          setAccessoryCategories(merged);
        }
      } catch (err) {
        console.warn('Could not load accessory categories', err);
      }
    };
    fetchCategories();
    return () => { mounted = false; };
  }, []);

  // Handle Escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Update images state when images change to ensure proper re-rendering
  useEffect(() => {
    // This effect helps ensure the component re-renders when images change
  }, [images]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };



  const handleMultipleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setErrors(prev => ({ ...prev, image: '' }));

    try {
      const uploadPromises = files.map(async (file, fileIndex) => {
        // Validate file
        const validation = SupabaseStorageService.validateImageFile(file);
        if (!validation.isValid) {
          throw new Error(validation.error || 'Invalid image file');
        }

        // Compress image
        const compressedFile = await SupabaseStorageService.compressImage(file);
        
        // Create preview
        const preview = URL.createObjectURL(compressedFile);
        
        // Add to images array immediately
        const newImageData: ImageData = {
          file: compressedFile,
          preview,
          uploadProgress: { progress: 0, isComplete: false },
          downloadURL: ''
        };

        // Update images state
        setImages(prev => [...prev, newImageData]);
        const imageIndex = images.length + fileIndex;

                 // Upload to Supabase Storage
         const downloadURL = await SupabaseStorageService.uploadImage(
           compressedFile,
           (progress) => {
             setImages(prev => prev.map((img, index) => 
               index === imageIndex 
                 ? { ...img, uploadProgress: progress }
                 : img
             ));
           }
         );

        // Update with final download URL
        setImages(prev => prev.map((img, index) => 
          index === imageIndex 
            ? { ...img, downloadURL, uploadProgress: { progress: 100, isComplete: true } }
            : img
        ));

        return downloadURL;
      });

      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading images:', error);
      setErrors(prev => ({ ...prev, image: 'Failed to upload some images. Please try again.' }));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];
    
    // If image has a download URL, delete it from storage
    if (imageToRemove.downloadURL) {
      try {
        await SupabaseStorageService.deleteImage(imageToRemove.downloadURL);
      } catch (error) {
        console.error('Error deleting image from storage:', error);
      }
    }

    // Clean up object URL if it exists
    if (imageToRemove.preview && imageToRemove.file) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    // Remove from state
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Drag and drop handlers for reordering images
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove dragged item
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newImages.splice(insertIndex, 0, draggedImage);
    
    setImages(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Please enter a valid price';
      }
    }

    // Validate market_price if provided
    if (formData.market_price.trim()) {
      const marketPrice = parseFloat(formData.market_price);
      if (isNaN(marketPrice) || marketPrice <= 0) {
        newErrors.market_price = 'Please enter a valid market price';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    const validImages = images.filter(img => img.downloadURL || img.uploadProgress.downloadURL);
    if (validImages.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);

    try {
      const price = parseFloat(formData.price);
      const market_price = formData.market_price.trim() ? parseFloat(formData.market_price) : null; // Parse market_price

      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        subCategory: (formData as any).sub_category || null,
        price,
        market_price, // Include market_price
        description: formData.description.trim(),
        featured: formData.featured,
        images: images
          .filter(img => img.downloadURL || img.uploadProgress.downloadURL)
          .map(img => img.downloadURL || img.uploadProgress.downloadURL || '')
          .filter(url => url)
      };

      if (isEditing && product?.id) {
        await updateProduct(product.id, productData);
      } else {
        await addProduct(productData);
      }

      // Clean up object URLs
      images.forEach(img => {
        if (img.preview && img.file) {
          URL.revokeObjectURL(img.preview);
        }
      });

      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({ submit: 'Failed to save product. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="product-form-backdrop" onClick={handleBackdropClick}>
      <div className="product-form-modal">
        <div className="form-header">
          <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <p className="section-description">Enter the essential product details.</p>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Kids">Kids</option>
                  <option value="Bags">Bags</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Footwear">Footwear</option>
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="sub_category">Accessory Category</label>
              <select
                id="sub_category"
                name="sub_category"
                value={(formData as any).sub_category}
                onChange={handleInputChange}
                disabled={formData.category !== 'Accessories'}
              >
                <option value="">All</option>
                {accessoryCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {formData.category !== 'Accessories' && (
                <p className="field-description">Select <strong>Accessories</strong> as the category to enable this field.</p>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={errors.price ? 'error' : ''}
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>

              {/* New Market Price Field */}
              <div className="form-group">
                <label htmlFor="market_price">Market Price (Optional)</label>
                <input
                  type="number"
                  id="market_price"
                  name="market_price"
                  value={formData.market_price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={errors.market_price ? 'error' : ''}
                />
                {errors.market_price && <span className="error-message">{errors.market_price}</span>}
                <p className="field-description">Original price, shown crossed out if higher than current price.</p>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Featured Product</span>
              </label>
              <p className="field-description">Mark this product as featured to highlight it on the homepage</p>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={4}
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>

          {/* Images Section */}
          <div className="form-section">
            <h3>Product Images</h3>
            <p className="section-description">Upload high-quality images of your product.</p>
            
            {/* Bulk Upload */}
            <div className="bulk-upload-section">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMultipleImageUpload}
                className="bulk-upload-input"
                id="bulk-image-upload"
                disabled={uploading || saving}
              />
              <label htmlFor="bulk-image-upload" className="bulk-upload-label">
                <Upload size={20} />
                <span>{uploading ? 'Uploading Images...' : 'Upload Multiple Images'}</span>
                <span className="bulk-upload-hint">
                  {uploading 
                    ? 'Please wait while images are being processed and uploaded' 
                    : 'Select multiple images to upload at once (PNG, JPG, GIF, WebP up to 10MB each)'
                  }
                </span>
              </label>
            </div>

            {/* Uploaded Images Display */}
            {images.length > 0 && (
              <div className="uploaded-images-section">
                <div className="section-header">
                  <h4>Uploaded Images</h4>
                  <p className="reorder-hint">Drag images to reorder them. The first image will be the main product image.</p>
                </div>
                <div className="uploaded-images-grid">
                  {images.map((imageData, index) => (
                    <div 
                      key={index} 
                      className={`uploaded-image-item ${
                        draggedIndex === index ? 'dragging' : ''
                      } ${
                        dragOverIndex === index ? 'drag-over' : ''
                      } ${
                        index === 0 ? 'main-image' : ''
                      }`}
                      draggable={imageData.uploadProgress.isComplete && !uploading && !saving}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="image-preview">
                        {imageData.uploadProgress.isComplete && !uploading && !saving && (
                          <div className="drag-handle">
                            <GripVertical size={16} />
                          </div>
                        )}
                        {index === 0 && (
                          <div className="main-image-badge">Main</div>
                        )}
                        <img 
                          src={imageData.preview || imageData.downloadURL} 
                          alt={`Product ${index + 1}`}
                        />
                        {!imageData.uploadProgress.isComplete && (
                          <div className="upload-progress">
                            <div 
                              className="progress-bar" 
                              style={{ width: `${imageData.uploadProgress.progress}%` }}
                            />
                            <span className="progress-text">
                              {imageData.uploadProgress.progress}%
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="remove-image-btn"
                          disabled={uploading || saving}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {errors.images && <span className="error-message">{errors.images}</span>}
            {errors.image && <span className="error-message">{errors.image}</span>}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            {errors.submit && <div className="error-message">{errors.submit}</div>}
            
            <div className="form-buttons">
              <button
                type="button"
                onClick={onClose}
                className="cancel-btn"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={uploading || saving}
              >
                {saving ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 