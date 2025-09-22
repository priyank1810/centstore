import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { SearchProvider } from './contexts/SearchContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Women from './pages/Women';
import Men from './pages/Men';
import Kids from './pages/Kids';
import Bags from './pages/Bags';
import Accessories from './pages/Accessories';
import Footwear from './pages/Footwear';
import Healthcare from './pages/Healthcare';
import Cosmetics from './pages/Cosmetics';
import Locations from './pages/Locations';
import ContactUs from './pages/ContactUs';
import SearchResults from './pages/SearchResults';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AccessoryCategoriesPage from './pages/AccessoryCategoriesPage';
import ScrollToTop from './utils/ScrollToTop'; // Import ScrollToTop
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <SearchProvider>
          <Router>
            <ScrollToTop /> {/* Place ScrollToTop here */}
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
                <Route
                  path="/admin/accessory-categories"
                  element={
                    <ProtectedRoute>
                      <AccessoryCategoriesPage />
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
                      <Route path="/healthcare" element={<Healthcare />} />
                      <Route path="/cosmetics" element={<Cosmetics />} />
                      <Route path="/footwear" element={<Footwear />} />
                      <Route path="/locations" element={<Locations />} />
                      <Route path="/contact" element={<ContactUs />} />
                      <Route path="/search" element={<SearchResults />} />
                    </Routes>
                    <Footer />
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
