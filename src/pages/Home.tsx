import React from 'react';
import Carousel from '../components/Carousel';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoryShowcase from '../components/CategoryShowcase';
import { Helmet } from '@dr.pogodin/react-helmet';
import './Home.css';

const Home: React.FC = () => {
  const homepageTitle = "CentStore - Your One-Stop Shop for Fashion & Accessories";
  const homepageDescription = "Discover the latest trends in fashion, accessories, footwear, and more at CentStore. Shop high-quality products for women, men, and kids.";
  const homepageCanonicalUrl = window.location.origin;

  return (
    <div className="home">
      <Helmet>
        <title>{homepageTitle}</title>
        <meta name="description" content={homepageDescription} />
        <link rel="canonical" href={homepageCanonicalUrl} />
      </Helmet>
      {/* <img src="/centstore-logo.png" alt="CentStore Logo" className="centstore-logo" /> Removed logo from here */}
      <Carousel />
      <CategoryShowcase />
      <FeaturedProducts />
    </div>
  );
};

export default Home; 