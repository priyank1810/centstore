import React from 'react';
import AccessoryCategoriesManager from '../components/AccessoryCategoriesManager';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

const AccessoryCategoriesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="content-header">
          <h2>Accessory Categories</h2>
          <p>Manage accessory categories used in the product form and accessory pages.</p>
        </div>

        <AccessoryCategoriesManager onClose={handleClose} onCategoriesChange={() => { /* optional callback */ }} />
      </div>
    </div>
  );
};

export default AccessoryCategoriesPage; 