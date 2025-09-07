import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'NEW FALL STYLES',
      subtitle: 'THAT MEANS BUSINESS',
      description: 'Discover the latest collection of premium fashion and accessories',
      ctaText: 'Shop Women',
      ctaLink: '/women',
      textPosition: 'left'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'MEN\'S ESSENTIALS',
      subtitle: 'REDEFINE YOUR STYLE',
      description: 'Elevate your wardrobe with our premium men\'s collection',
      ctaText: 'Shop Men',
      ctaLink: '/men',
      textPosition: 'right'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'HANDBAG COLLECTION',
      subtitle: 'LUXURY REDEFINED',
      description: 'Statement pieces that complete your perfect look',
      ctaText: 'Shop Bags',
      ctaLink: '/bags',
      textPosition: 'center'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'KIDS FASHION',
      subtitle: 'STYLE FOR THE LITTLE ONES',
      description: 'Fun, comfortable, and stylish clothing for children',
      ctaText: 'Shop Kids',
      ctaLink: '/kids',
      textPosition: 'left'
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, nextSlide]);

  return (
    <div className="carousel">
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
      <button className="carousel-nav prev" onClick={prevSlide}>
        <ChevronLeft size={24} />
      </button>
      <button className="carousel-nav next" onClick={nextSlide}>
        <ChevronRight size={24} />
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

      {/* Play/Pause Button */}
      <button className="play-pause-btn" onClick={togglePlayPause}>
        {isPlaying ? 'Pause slideshow' : 'Play slideshow'}
      </button>
    </div>
  );
};

export default Carousel; 