import React from 'react';
import Carousel from '../components/Carousel';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoryShowcase from '../components/CategoryShowcase';
import Newsletter from '../components/Newsletter';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Carousel />
      <CategoryShowcase />
      <FeaturedProducts />
      <Newsletter />
    </div>
  );
};

export default Home; 