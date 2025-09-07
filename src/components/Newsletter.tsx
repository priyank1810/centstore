import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter-content">
          <h2>Get on the List and save 15%</h2>
          <p>Get first access to special offers and new arrivals.</p>
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          {isSubscribed && (
            <p className="success-message">Thank you for subscribing!</p>
          )}
          <p className="privacy-note">
            By signing up I agree to receive e-mails from CENT STORE and I accept the Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 