import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProducts, Product } from '../contexts/ProductsContext';
import { 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Package, 
  ShoppingBag,
  Users,
  TrendingUp,
  Star,
  Filter,
  Search,
  Settings,
  BarChart3
} from 'lucide-react';
import ProductForm from '../components/ProductForm';
import ProductModal from '../components/ProductModal';
import { SupabaseAccessoryCategoryService } from '../services/supabaseAccessoryCategoryService';
import AccessoryCategoriesManager from '../components/AccessoryCategoriesManager';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { products, deleteProduct } = useProducts();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [accessoryCategories, setAccessoryCategories] = useState<string[]>([]);
  const [selectedAccessorySubCategory, setSelectedAccessorySubCategory] = useState<string>('All');
  const [showAccessoryManager, setShowAccessoryManager] = useState<boolean>(false);

  const categories = ['All', 'Women', 'Men', 'Kids', 'Bags', 'Accessories', 'Footwear'];

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const cats = await SupabaseAccessoryCategoryService.getAllCategories();
        if (mounted) setAccessoryCategories(['All', ...cats]);
      } catch (err) {
        console.warn('Failed to fetch accessory categories', err);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  let filteredProducts: Product[] = products;
  if (selectedCategory !== 'All') {
    if (selectedCategory === 'Accessories') {
      filteredProducts = products.filter(p => p.category === 'Accessories');
      if (selectedAccessorySubCategory && selectedAccessorySubCategory !== 'All') {
        filteredProducts = filteredProducts.filter(p => ((p as any).subCategory || '') === selectedAccessorySubCategory);
      }
    } else {
      filteredProducts = products.filter(product => product.category === selectedCategory);
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const totalProducts = products.length;
  const featuredProducts = products.filter(p => p.featured).length;
  const totalCategories = new Set(products.map(p => p.category)).size;
  const averagePrice = products.length > 0 
    ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)
    : '0.00';

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <div className="admin-welcome">
                <h1>
                  <Settings className="header-icon" />
                  Admin Dashboard
                </h1>
                <p>Welcome back, {user?.username}</p>
              </div>
            </div>
            <button onClick={logout} className="logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="dashboard-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon products">
                <Package size={24} />
              </div>
              <div className="stat-content">
                <h3>{totalProducts}</h3>
                <p>Total Products</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon featured">
                <Star size={24} />
              </div>
              <div className="stat-content">
                <h3>{featuredProducts}</h3>
                <p>Featured Products</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon categories">
                <Filter size={24} />
              </div>
              <div className="stat-content">
                <h3>{totalCategories}</h3>
                <p>Categories</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon price">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <h3>${averagePrice}</h3>
                <p>Avg. Price</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="container">
          <div className="content-header">
            <div className="content-title">
              <ShoppingBag className="content-icon" />
              <div>
                <h2>Product Management</h2>
                <p>Manage your store inventory and product catalog</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="add-product-btn"
            >
              <Plus size={20} />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            <div className="filter-header">
              <Filter size={18} />
              <span>Filter by Category</span>
            </div>
            <div className="category-buttons">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => { setSelectedCategory(category); setSelectedAccessorySubCategory('All'); }}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                >
                  {category}
                  {category !== 'All' && (
                    <span className="category-count">
                      {products.filter(p => p.category === category).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {selectedCategory === 'Accessories' && (
              <div className="accessory-sub-filter">
                <label htmlFor="admin-sub-filter">Sub-category:</label>
                <select
                  id="admin-sub-filter"
                  value={selectedAccessorySubCategory}
                  onChange={(e) => setSelectedAccessorySubCategory(e.target.value)}
                >
                  {accessoryCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <Link to="/admin/accessory-categories" className="manage-accessory-cats-btn">
                  Manage Accessory Categories
                </Link>
              </div>
            )}
          </div>

          {/* Products Table */}
          <div className="products-table">
            <div className="table-header">
              <div className="table-row">
                <div className="table-cell">Image</div>
                <div className="table-cell">Product</div>
                <div className="table-cell">Category</div>
                <div className="table-cell">Sub-category</div>
                <div className="table-cell">Price</div>
                <div className="table-cell">Featured</div>
                <div className="table-cell">Actions</div>
              </div>
            </div>
            <div className="table-body">
              {filteredProducts.map(product => (
                <div key={product.id} className="table-row">
                  <div className="table-cell">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </div>
                  <div className="table-cell">
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>{product.description?.substring(0, 50)}...</p>
                    </div>
                  </div>
                  <div className="table-cell">
                    <span className="category-badge">{product.category}</span>
                  </div>
                  <div className="table-cell">
                    <span className="category-badge">{(product as any).subCategory || '-'}</span>
                  </div>
                  <div className="table-cell">
                    <div className="price-info">
                      <span className="price">${product.price}</span>
                    </div>
                  </div>
                  <div className="table-cell">
                    <div className="featured-status">
                      {product.featured ? (
                        <span className="featured-badge featured">⭐ Featured</span>
                      ) : (
                        <span className="featured-badge">Not Featured</span>
                      )}
                    </div>
                  </div>
                  <div className="table-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => setViewingProduct(product)}
                        className="action-btn view-btn"
                        title="View Product Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="action-btn edit-btn"
                        title="Edit Product"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => product.id && handleDeleteProduct(product.id)}
                        className="action-btn delete-btn"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <Package size={48} />
              <h3>No products found</h3>
              <p>
                {selectedCategory === 'All' 
                  ? 'Start by adding your first product'
                  : `No products in ${selectedCategory} category`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddForm && (
        <ProductForm
          onClose={() => setShowAddForm(false)}
          onSave={() => setShowAddForm(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={() => setEditingProduct(null)}
        />
      )}

      {viewingProduct && (
        <ProductModal
          product={viewingProduct}
          isOpen={true}
          onClose={() => setViewingProduct(null)}
        />
      )}

      {showAccessoryManager && (
        <div className="accessory-manager-panel">
          <AccessoryCategoriesManager onClose={() => setShowAccessoryManager(false)} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 