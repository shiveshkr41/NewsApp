import React, { useEffect, useState } from 'react';
import OverlayMenu from '../nav/Navigation_2'; // Adjust the path as necessary
import './header.css';

function Header() {
  const [isFixed, setIsFixed] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const toggleMenu = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };


  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.header');
      const headerHeight = header.offsetHeight;
      const scrollY = window.scrollY;
      setIsFixed(scrollY > headerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isFixed ? 'header--fixed' : ''}`}>
      <div className="header__logo">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          role="d" 
          className="header-nav" 
          aria-hidden="true"
          onClick={toggleMenu}
          style={{ cursor: 'pointer' }}
        >
          <path d="M24 3.5H0v1.1h3.37V21h17.25V4.6H24zm-4.47 16.4H4.47v-15h15.06z"></path>
          <path d="M7.5 8.07h9v1.1h-9zM7.5 15.57h9v1.1h-9zM7.5 11.82h9v1.1h-9z"></path>
        </svg>
        <div className="h"></div>
        <a href="/">
          <img src="https://hbr.org/resources/css/images/HBR_logo_black.svg" className="header-img" alt="Harvard Business Review" />
        </a>
      </div>
      <div className="header__actions">
        <div className="sub">
          <button className="header__button f">Subscribe</button>
          
            <a href="http://127.0.0.1:8000" className="header__link">
              Sign In
            </a>
          
        </div>
        <button className="header__search f">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="15" y2="15" />
          </svg>
        </button>
        <OverlayMenu isOpen={isOverlayOpen} toggleMenu={toggleMenu} />
      </div>
    </header>
  );
}

export default Header;
