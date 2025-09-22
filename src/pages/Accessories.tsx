import React, { useState, useEffect } from 'react';
import { useProducts } from '../contexts/ProductsContext';
import { SupabaseAccessoryCategoryService } from '../services/supabaseAccessoryCategoryService';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { Product } from '../contexts/ProductsContext';
import './CategoryPage.css';

const Accessories: React.FC = () => {
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessoryCategories, setAccessoryCategories] = useState<string[]>([]);
  const [selectedAccessoryCategory, setSelectedAccessoryCategory] = useState<string>('All');

  useEffect(() => {
    let mounted = true;
    const fetchCats = async () => {
      try {
        const cats = await SupabaseAccessoryCategoryService.getAllCategories();
        if (mounted) setAccessoryCategories(['All', ...cats]);
      } catch (err) {
        console.warn('Failed to load accessory categories', err);
      }
    };
    fetchCats();
    return () => { mounted = false; };
  }, []);

  // All accessory products
  const accessoriesAll = products.filter(product => product.category.toLowerCase() === 'accessories');

  // Group products by sub-category (use 'Uncategorized' for empty)
  const productsBySubCategory = accessoriesAll.reduce<Record<string, Product[]>>((acc, product) => {
    const key = ((product as any).subCategory || 'Uncategorized').toString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {});

  // Build button list combining known categories and actual product keys
  const allSubCategories = Array.from(new Set([
    'All',
    ...accessoryCategories.filter(Boolean),
    ...Object.keys(productsBySubCategory)
  ]));

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

        <div className="subcat-buttons">
          {allSubCategories.map((cat) => (
            <button
              key={cat}
              className={`subcat-btn ${selectedAccessoryCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedAccessoryCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* If a specific sub-category is selected, show its products. Otherwise group by sub-category. */}
        {selectedAccessoryCategory && selectedAccessoryCategory !== 'All' ? (
          <div className="products-grid">
            {(productsBySubCategory[selectedAccessoryCategory] || []).map(product => (
              <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
            ))}
            {(productsBySubCategory[selectedAccessoryCategory] || []).length === 0 && (
              <div className="empty-state">
                <h3>No products in "{selectedAccessoryCategory}"</h3>
                <p>We're working on adding items to this category. Check back soon!</p>
              </div>
            )}
          </div>
        ) : (
          // Render grouped sections
          <div className="accessory-sections">
            {Object.keys(productsBySubCategory).length === 0 && (
          <div className="empty-state">
            <h3>No Accessories Available</h3>
            <p>We're working on adding new accessories to our collection. Check back soon!</p>
              </div>
            )}

            {Object.keys(productsBySubCategory).map((sub) => (
              <section key={sub} className="subcat-section">
                <div className="subcat-header">
                  <h2>{sub}</h2>
                  <span className="subcat-count">{productsBySubCategory[sub].length}</span>
                </div>
                <div className="products-grid">
                  {productsBySubCategory[sub].map(product => (
                    <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
                  ))}
                </div>
              </section>
            ))}
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