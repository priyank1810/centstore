import React from 'react';
import Carousel from '../components/Carousel';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoryShowcase from '../components/CategoryShowcase';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      {/* <img src="/centstore-logo.png" alt="CentStore Logo" className="centstore-logo" /> Removed logo from here */}
      <Carousel />
      <CategoryShowcase />
      <FeaturedProducts />
    </div>
  );
};

export default Home; 