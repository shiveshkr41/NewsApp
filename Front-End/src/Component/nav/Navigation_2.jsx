import React from 'react';
import './Navigation_2.css'; // Assume this imports your custom styles
import Footer from '../footer/Footer'
const OverlayMenu = ({ isOpen, toggleMenu }) => {
  return (
    <div className={`overlay ${isOpen ? 'open' : ''}`}>
      <button className="overlay-close" onClick={toggleMenu}>&times;</button>
      <div className="overlay-content">
       <Footer />
      </div>
    </div>
  );
};

export default OverlayMenu;
