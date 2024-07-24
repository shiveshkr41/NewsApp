import React, { useEffect, useState } from 'react';
import OverlayMenu from '../nav/Navigation_2'; // Adjust the path as necessary
import './header.css';
import Cookies from 'js-cookie';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const toggleMenu = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const get_csrf_token = () => {
    const token = Cookies.get('csrftoken');
    console.log('CSRF Token:', token); // Log the CSRF token
    return token;
  };

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/apis/login_status/', {
        method: 'GET',
        credentials: 'include', // Ensure cookies are sent
        headers: {
          'X-CSRFToken': get_csrf_token(), // Set CSRF token header
          'Content-Type': 'application/json', // Ensure proper content type
        },
      });
  
      if (response.ok) {
        // Handle successful authentication
        console.log('Authenticated');
      } else {
        // Handle failed authentication
        console.log('Not authenticated');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  });

  const handleLogout = async () => {
    try {
      const csrfToken = get_csrf_token();
      const response = await fetch('http://127.0.0.1:8000/apis/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
      if (response.ok) {
        setIsLoggedIn(false);
        window.location.href = '/';
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
          {isLoggedIn ? (
            <>
              <button className="header__button" onClick={handleLogout}>
                Logout
              </button>
              <a href="/profile-page">Profile</a>
              <a href="/new-post">New Post</a>
              <a href="/all-posts">All Posts</a>
            </>
          ) : (
            <a href="/login/" className="header__link">
              Sign In
            </a>
          )}
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
