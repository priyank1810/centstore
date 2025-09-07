import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>CentStore</h3>
              <p>Your trusted partner for quality products and exceptional service worldwide.</p>
              <div className="footer-social">
                <Link to="/contact" className="social-link">
                  <MessageCircle size={20} />
                </Link>
              </div>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/women">Women</Link></li>
                <li><Link to="/men">Men</Link></li>
                <li><Link to="/kids">Kids</Link></li>
                <li><Link to="/bags">Bags</Link></li>
                <li><Link to="/accessories">Accessories</Link></li>
                <li><Link to="/footwear">Footwear</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><Link to="/locations">Our Locations</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Contact Us</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail size={18} />
                  <div>
                    <a href="mailto:Office@karadapharma.com">Office@karadapharma.com</a>
                    <a href="mailto:ali.fadhil@karadapharma.com">ali.fadhil@karadapharma.com</a>
                  </div>
                </div>
                <div className="contact-item">
                  <Phone size={18} />
                  <div>
                    <a href="tel:+13027233904">+1 (302) 723-3904</a>
                    <a href="tel:+18045514128">+1 (804) 551-4128</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; 2024 CentStore. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/contact">Contact Us</Link>
              <span>|</span>
              <Link to="/locations">Locations</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 