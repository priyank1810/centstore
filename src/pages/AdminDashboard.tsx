import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts, Product } from '../contexts/ProductsContext';
import { LogOut, Plus, Edit, Trash2, Eye, Package } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import ProductModal from '../components/ProductModal';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { products, deleteProduct } = useProducts();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');


  const categories = ['All', 'Women', 'Men', 'Kids', 'Bags', 'Accessories'];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };



  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.username}</p>
          </div>
          <div className="header-actions">
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>{products.filter(p => p.category === 'Women').length}</h3>
            <p>Women</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>{products.filter(p => p.category === 'Men').length}</h3>
            <p>Men</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>{products.filter(p => p.category === 'Kids').length}</h3>
            <p>Kids</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>{products.filter(p => p.category === 'Bags').length}</h3>
            <p>Bags</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>{products.filter(p => p.category === 'Accessories').length}</h3>
            <p>Accessories</p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="dashboard-content">
        <div className="content-header">
          <div className="content-title">
            <h2>Products Management</h2>
            <p>Manage your product catalog</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="add-product-btn"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Table */}
        <div className="products-table">
          <div className="table-header">
            <div className="table-row">
              <div className="table-cell">Image</div>
              <div className="table-cell">Product</div>
              <div className="table-cell">Category</div>
              <div className="table-cell">Price</div>
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
                  <div className="price-info">
                    <span className="price">${product.price}</span>
                  </div>
                </div>
                <div className="table-cell">
                  <div className="action-buttons">
                    <button
                      onClick={() => setViewingProduct(product)}
                      className="action-btn view-btn"
                      title="View Product"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="action-btn edit-btn"
                      title="Edit Product"
                    >
                      <Edit size={16} />
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
    </div>
  );
};

export default AdminDashboard; 