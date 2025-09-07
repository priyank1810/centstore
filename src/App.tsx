import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { SearchProvider } from './contexts/SearchContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Women from './pages/Women';
import Men from './pages/Men';
import Kids from './pages/Kids';
import Bags from './pages/Bags';
import Accessories from './pages/Accessories';
import SearchResults from './pages/SearchResults';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <SearchProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Public Routes */}
                <Route path="/*" element={
                  <>
                    <Header />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/women" element={<Women />} />
                      <Route path="/men" element={<Men />} />
                      <Route path="/kids" element={<Kids />} />
                      <Route path="/bags" element={<Bags />} />
                      <Route path="/accessories" element={<Accessories />} />
                      <Route path="/search" element={<SearchResults />} />
                    </Routes>
                  </>
                } />
              </Routes>
            </div>
          </Router>
        </SearchProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;
