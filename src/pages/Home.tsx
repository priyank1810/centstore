import React from 'react';
import Carousel from '../components/Carousel';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoryShowcase from '../components/CategoryShowcase';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Carousel />
      <CategoryShowcase />
      <FeaturedProducts />
    </div>
  );
};

export default Home; 