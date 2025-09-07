import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryShowcase.css';

const CategoryShowcase: React.FC = () => {
  const categories = [
    {
      name: 'Women',
      link: '/women',
      image: '/category-images/category-women.jpg'
    },
    {
      name: 'Men',
      link: '/men',
      image: '/category-images/category-men.jpg'
    },
    {
      name: 'Kids',
      link: '/kids',
      image: '/category-images/category-kids.jpg'
    },
    {
      name: 'Bags',
      link: '/bags',
      image: '/category-images/category-bags.jpg'
    },
    {
      name: 'Accessories',
      link: '/accessories',
      image: '/category-images/category-accessories.jpg'
    },
    {
      name: 'Footwear',
      link: '/footwear',
      image: '/category-images/category-footwear.jpg'
    }
  ];

  return (
    <section className="category-showcase">
      <div className="container">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <Link key={index} to={category.link} className="category-card">
              <div className="category-image">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <h3>{category.name}</h3>
                  <span className="shop-now">Shop Now</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase; 