import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>New Fall Styles</h1>
          <h2>THAT MEANS BUSINESS</h2>
          <p>Discover the latest collection of premium fashion and accessories</p>
          <div className="hero-buttons">
            <Link to="/women" className="btn btn-primary">Shop Women</Link>
            <Link to="/men" className="btn btn-secondary">Shop Men</Link>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Fashion Collection" 
          />
        </div>
      </div>
    </section>
  );
};

export default Hero; 