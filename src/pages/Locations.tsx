import React from 'react';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import './Locations.css';

const Locations: React.FC = () => {
  interface Office {
    country: string;
    title: string;
    address: string;
    contact?: string;
    phone?: string;
    phone2?: string;
    whatsapp?: string;
    email?: string;
    identificationNumber?: string;
    legalForm?: string;
    type?: string;
  }
  const offices: Office[] = [
    {
      country: 'INDIA',
      title: 'SHRADDHA MEDICINES',
      address: 'Vidhyanagar Main Road, Nr. Virani School, Rajkot, Gujarat India',
      contact: 'Mr. Aryan',
      phone: '+971502778239',
      whatsapp: '+919408612998',
      type: 'blue'
    },
    {
      country: 'UAE',
      title: 'KARADA INTERNATIONAL',
      address: 'Dubai, IFZA Building A 2, Unit 101, Dubai Silicon Oasis, Dubai, UAE',
      contact: 'Mr. Aryan',
      phone: '+971502778239',
      whatsapp: '+919408612998',
      type: 'blue'
    },
    {
      country: 'CHINA',
      title: 'SHANDONG JINCHUAN IMPORT AND EXPORT CO.LTD',
      address: 'Floor 2, YANGGUANGSHIDAI, ZHENXING ROAD, LIAOCHENG CITY SHANDONG PROVINCE, CHINA',
      contact: 'Mr. Ray Yang',
      phone: '+86 151 0689 7231',
      type: 'blue'
    },
    {
      country: 'IRAQ',
      title: 'AL KARADA SCIENTIFIC DRUG BUREAU',
      address: 'KARADA INNER STREET, ALWAZAN BUILDING Baghdad, IRAQ',
      phone: '+964 7506584904 / 7901551109',
      type: 'green'
    },
    {
      country: 'USA',
      title: 'CENT STORE LLC',
      address: '2109 Dabney RD\n\nRichmond, VA 23230',
      phone: '5023450389',
      type: 'green'
    },
    {
      country: 'EUROPE',
      title: 'FADHIL, s.r.o.',
      address: 'Vyšehradská 8\nBratislava - mestská časť Petržalka 851 06',
      identificationNumber: '47 191 198',
      legalForm: 'Private limited liability company',
      type: 'green'
    }
  ];

  return (
    <div className="locations-page">
      <div className="locations-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Our Global Presence</h1>
            <p className="hero-subtitle">We Believe in the Best</p>
            <div className="hero-description">
              <p>Our global pharmaceutical network operates across multiple continents, bringing quality solutions to markets worldwide. Our strategic locations enable us to serve diverse communities with excellence and reliability.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="locations-content">
        <div className="container">
          <div className="section-header">
            <h2>Office Locations</h2>
            <p>Connect with our teams around the world</p>
          </div>

          <div className="offices-grid">
            {offices.map((office, index) => (
              <div key={index} className={`office-card ${office.type}`}>
                <div className="office-header">
                  <div className="country-flag">
                    <Globe size={24} />
                  </div>
                  <div className="office-title">
                    <h3>{office.country} OFFICE</h3>
                    <h4>{office.title}</h4>
                  </div>
                </div>

                <div className="office-details">
                  <div className="detail-item">
                    <MapPin size={18} />
                    <p>{office.address}</p>
                  </div>

                  {office.contact && (
                    <div className="detail-item">
                      <span className="contact-label">Contact:</span>
                      <span className="contact-name">{office.contact}</span>
                    </div>
                  )}

                  {office.identificationNumber && (
                    <div className="detail-item">
                      <span className="contact-label">Identification number (IČO):</span>
                      <span className="contact-name">{office.identificationNumber}</span>
                    </div>
                  )}

                  {office.legalForm && (
                    <div className="detail-item">
                      <span className="contact-label">Legal form:</span>
                      <span className="contact-name">{office.legalForm}</span>
                    </div>
                  )}

                  {office.phone && (
                    <div className="detail-item">
                      <Phone size={18} />
                      <a href={`tel:${office.phone}`}>{office.phone}</a>
                    </div>
                  )}

                  {office.phone2 && (
                    <div className="detail-item">
                      <Phone size={18} />
                      <a href={`tel:${office.phone2}`}>{office.phone2}</a>
                    </div>
                  )}

                  {office.whatsapp && (
                    <div className="detail-item whatsapp">
                      <Phone size={18} />
                      <span>WhatsApp: </span>
                      <a href={`https://wa.me/${office.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                        {office.whatsapp}
                      </a>
                    </div>
                  )}

                  {office.email && (
                    <div className="detail-item">
                      <Mail size={18} />
                      <a href={`mailto:${office.email}`}>{office.email}</a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locations; 