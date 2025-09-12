import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import ChevronLeft and ChevronRight
import './Carousel.css';

interface CarouselSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  textPosition: 'left' | 'center' | 'right';
}

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides: CarouselSlide[] = [
    {
      id: 1,
      image: '/carousel-images/carousel-women-fashion.jpg',
      title: 'NEW FALL STYLES',
      subtitle: 'THAT MEANS BUSINESS',
      description: 'Discover the latest collection of premium fashion and accessories',
      ctaText: 'Shop Women',
      ctaLink: '/women',
      textPosition: 'left'
    },
    {
      id: 2,
      image: '/carousel-images/carousel-men-fashion.jpg',
      title: 'MEN\'S ESSENTIALS',
      subtitle: 'REDEFINE YOUR STYLE',
      description: 'Elevate your wardrobe with our premium men\'s collection',
      ctaText: 'Shop Men',
      ctaLink: '/men',
      textPosition: 'right'
    },
    {
      id: 3,
      image: '/carousel-images/carousel-luxury-handbags.jpg',
      title: 'LUXURY HANDBAGS',
      subtitle: 'STATEMENT PIECES',
      description: 'Exquisite handbags that complete your perfect look',
      ctaText: 'Shop Bags',
      ctaLink: '/bags',
      textPosition: 'center'
    },
    {
      id: 4,
      image: '/carousel-images/carousel-kids-fashion.jpg',
      title: 'KIDS COLLECTION',
      subtitle: 'STYLE FOR LITTLE ONES',
      description: 'Comfortable, stylish, and playful clothing for children',
      ctaText: 'Shop Kids',
      ctaLink: '/kids',
      textPosition: 'left'
    },
    {
      id: 5,
      image: '/carousel-images/carousel-fashion-accessories.jpg',
      title: 'FASHION ACCESSORIES',
      subtitle: 'COMPLETE YOUR STYLE',
      description: 'Essential accessories to elevate and personalize your look',
      ctaText: 'Shop Accessories',
      ctaLink: '/accessories',
      textPosition: 'left'
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleMouseEnter = () => {
    setIsPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, nextSlide]);

  return (
    <div 
      className="carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="carousel-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="slide-image">
              <img src={slide.image} alt={slide.title} />
              <div className="slide-overlay"></div>
            </div>
            <div className={`slide-content ${slide.textPosition}`}>
              <div className="slide-text">
                <h1 className="slide-title">{slide.title}</h1>
                <h2 className="slide-subtitle">{slide.subtitle}</h2>
                <p className="slide-description">{slide.description}</p>
                <Link to={slide.ctaLink} className="slide-cta">
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="carousel-arrow prev" onClick={prevSlide}>
        <ChevronLeft size={30} />
      </button>
      <button className="carousel-arrow next" onClick={nextSlide}>
        <ChevronRight size={30} />
      </button>

      {/* Dots Indicator */}
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel; 