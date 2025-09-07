import React from 'react';
import { Mail, Phone } from 'lucide-react';
import './ContactUs.css';

const ContactUs: React.FC = () => {
  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Contact Us</h1>
            <p className="hero-subtitle">Get in Touch with Our Team</p>
            <div className="hero-description">
              <p>We're here to help and answer any questions you might have. Reach out to us and we'll respond as soon as possible.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-content">
        <div className="container">
          <div className="contact-info-centered">
            <h2>Get in Touch</h2>
            <p>Contact us through any of the following methods:</p>
            
            <div className="contact-methods">
              <div className="contact-item">
                <div className="contact-icon">
                  <Mail size={24} />
                </div>
                <div className="contact-details">
                  <h3>General Inquiries</h3>
                  <a href="mailto:Office@karadapharma.com">Office@karadapharma.com</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <Mail size={24} />
                </div>
                <div className="contact-details">
                  <h3>Direct Contact</h3>
                  <a href="mailto:ali.fadhil@karadapharma.com">ali.fadhil@karadapharma.com</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <Phone size={24} />
                </div>
                <div className="contact-details">
                  <h3>Phone Support</h3>
                  <div className="phone-numbers">
                    <a href="tel:+13027233904">+1 (302) 723-3904</a>
                    <a href="tel:+18045514128">+1 (804) 551-4128</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 