import React from 'react';
import contact from '../data/contact';

const footerLinks = [
  ['Home', '#home'],
  ['Attractions', '#attractions'],
  ['Experiences', '#experiences'],
  ['About Lesotho', '#about'],
  ['Enquiries', '#enquiries'],
];

function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-main page-shell">
        <div className="footer-brand">
          <a className="brand brand--footer" href="#home" aria-label="Maloti Tour Guides home" onClick={(event) => onNavigate(event, 'home')}>
            <span className="brand__text"><strong>Maloti Tour Guides</strong><small>Local knowledge. Highland discovery.</small></span>
          </a>
          <p>A thoughtful starting point for finding your way through Lesotho’s mountains, heritage and warm highland hospitality.</p>
        </div>
        <div className="footer-nav">
          <h2>Explore</h2>
          {footerLinks.map(([label, href]) => <a key={href} href={href} onClick={(event) => onNavigate(event, href.slice(1))}>{label}</a>)}
        </div>
        <div className="footer-contact">
          <h2>Plan a visit</h2>
          <p>Have a destination in mind?</p>
          <a className="footer-contact__link" href="#enquiries" onClick={(event) => onNavigate(event, 'enquiries')}>Send an enquiry <span aria-hidden="true">↗</span></a>
          <div className="footer-contact__details">
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
            <a href={`tel:${contact.alternatePhone.replace(/\s/g, '')}`}>{contact.alternatePhone}</a>
        
          </div>
          <p className="footer-contact__note">Please confirm access, conditions and local costs before setting out.</p>
        </div>
      </div>
      <div className="footer-bottom page-shell">
        <span>© {new Date().getFullYear()} Maloti Tour Guides</span>
        <span>Academic tourism guide</span>
      </div>
    </footer>
  );
}

export default Footer;
